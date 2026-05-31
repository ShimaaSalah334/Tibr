import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.Service';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  forgotForm: FormGroup;
  isEmailFocused = signal<boolean>(false);

  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // دالة الإرسال المتوافقة مع مؤثرات المنصة البنكية الفخمة
  onSubmit(): void {
    if (!this.forgotForm.valid || this.formState() !== 'idle') {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = this.forgotForm.get('email')?.value;
    this.formState.set('loading');
    this.errorMessage.set(null);

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.formState.set('success');
        localStorage.setItem('resetEmail', email); 
        setTimeout(() => {
          this.formState.set('idle');
          this.forgotForm.reset();
          alert('تم إرسال رابط استعادة الأصول بنجاح! تفقد بريدك الإلكتروني الآن.');
          this.router.navigate(['/reset-password']);
        }, 1500);
      },
      error: (error) => {
        console.error('Forgot password error:', error);
        this.formState.set('error');
        this.errorMessage.set(error?.error?.message || 'حدث خطأ أثناء إرسال رابط الاستعادة. حاول مرة أخرى.');
      }
    });
  }
}
