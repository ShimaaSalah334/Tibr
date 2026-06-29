import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.Service';
import { RegisterPayload } from '../../../core/interfaces/register-payload';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public i18n= inject(I18nService);

  isFirstNameFocused = signal<boolean>(false);
  isLastNameFocused = signal<boolean>(false);
  isEmailFocused = signal<boolean>(false);
  isPhoneFocused = signal<boolean>(false);
  isPasswordFocused = signal<boolean>(false);
  isConfirmPasswordFocused = signal<boolean>(false);

  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');

  // التحكم في ظهور الـ Custom Alert الفاخر الخاص بإنشاء الحساب
  showAlertModal = signal<boolean>(false);
  tempEmail = ''; // للاحتفاظ بالبريد مؤقتاً لتمريره بعد إغلاق التنبيه

  constructor() {
    this.registerForm = this.fb.group({
      firstName:['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+20', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    this.registerForm.valueChanges.subscribe(() => {
      if (this.formState() === 'error') {
        this.formState.set('idle');
        this.errorMessage.set('');
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  // دالة إغلاق التنبيه والتوجه للوحة التحكم الأمني (تفعيل الحساب)
  closeAlertAndNavigate(): void {
    this.showAlertModal.set(false);
    this.formState.set('idle');
    this.router.navigate(['/verfiy-account']);
  }

  onSubmit(): void {
    if (this.registerForm.valid && this.formState() !== 'loading') {
      this.formState.set('loading');
      this.errorMessage.set('');

      const { firstName, lastName, countryCode, phone, email, password, confirmPassword } = this.registerForm.value;
      const fullPhoneNumber = `${countryCode}${phone}`;
      
      this.tempEmail = email; // تخزين البريد مؤقتاً

      const payload: RegisterPayload = {
        email,
        phone: fullPhoneNumber,
        password,
        confirmPassword,
        firstName,
        lastName,
        lang:localStorage.getItem('tibr_locale')=="en"?"en":"ar"
      };
      
      this.authService.register(payload).subscribe({
        next: (response) => {
          this.formState.set('success');
          this.registerForm.reset({ countryCode: '+20', terms: false });
          
          localStorage.setItem('registeredEmail', this.tempEmail);
          
          this.showAlertModal.set(true);
        },
        error: (err) => {
          this.formState.set('error');
          this.errorMessage.set(localStorage.getItem('tibr_locale')=="ar"? err.error?.messageAR : err.error?.messageEN);
          console.log(err);
          
          console.error('Registration error:', err);
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}