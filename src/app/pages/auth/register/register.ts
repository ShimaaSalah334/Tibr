import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.Service';
import { RegisterPayload } from '../../../core/interfaces/register-payload';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  
  // Injecting required dependencies
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isFirstNameFocused = signal<boolean>(false);
  isLastNameFocused = signal<boolean>(false);
  isEmailFocused = signal<boolean>(false);
  isPhoneFocused = signal<boolean>(false);
  isPasswordFocused = signal<boolean>(false);
  isConfirmPasswordFocused = signal<boolean>(false);

  // Added 'error' state to handle failed API requests cleanly
  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');

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
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid && this.formState() === 'idle') {
      this.formState.set('loading');
      this.errorMessage.set('');

      const { firstName, lastName, countryCode, phone, email, password, confirmPassword } = this.registerForm.value;
      const fullPhoneNumber = `${countryCode}${phone}`;

    // 3. بناء الـ Payload النهائي بنفس هيكلة الـ Interface تماماً
    const payload: RegisterPayload = {
      email,
      phone: fullPhoneNumber,
      password,
      confirmPassword,
      firstName,
      lastName
    };
      
      this.authService.register(payload).subscribe({
        next: (response) => {
          this.formState.set('success');
          this.registerForm.reset({ countryCode: '+20', terms: false });
          
          alert('تم إنشاء الحساب بنجاح! سيتم توجيهك الآن إلى لوحة التحكم الأمنية.');
          localStorage.setItem('registeredEmail', email);
          this.router.navigate(['/verfiy-account']); 
        },
        error: (err) => {
          this.formState.set('error');
          this.errorMessage.set(err.error?.message || 'حدث خطأ ما أثناء التسجيل. يرجى المحاولة مرة أخرى.');
          console.error('Registration error:', err);
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}