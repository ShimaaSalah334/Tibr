import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.Service';

@Component({
  selector: 'app-reast-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reast-password.html',
  styleUrl: './reast-password.css',
})
export class ReastPassword {
  resetForm: FormGroup;
  resetEmail = signal<string | null>(null);

  // إدارة تركيز الحقول (Focus Inputs) عبر الـ Signals للأداء السلس الخفيف
  isPasswordFocused = signal<boolean>(false);
  isConfirmPasswordFocused = signal<boolean>(false);

  // إدارة إخفاء وإظهار العين المستقل لكل حقل
  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);

  // إدارة الحالة التفاعلية للاستمارة (idle | loading | success | error)
  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  // التحكم في ظهور الـ Custom Alert الفاخر
  showAlertModal = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.resetEmail.set(localStorage.getItem('resetEmail'));
  }

  // ميكانيزم مطابقة التحقق من تطابق الحقلين برمجياً
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  // دوال التبديل المرئية لحقول الإدخال
  togglePasswordView(): void {
    this.hidePassword.update(state => !state);
  }

  toggleConfirmPasswordView(): void {
    this.hideConfirmPassword.update(state => !state);
  }

  // دالة إغلاق التنبيه والتوجه لصفحة تسجيل الدخول
  closeAlertAndNavigate(): void {
    this.showAlertModal.set(false);
    this.formState.set('idle');
    this.router.navigate(['/login']);
  }

  // معالجة وحفظ البيانات وتأثيرات التحميل التفاعلية المطلوبة
  onSubmit(): void {
    if (!this.resetForm.valid || this.formState() !== 'idle') {
      this.resetForm.markAllAsTouched();
      return;
    }

    const email = this.resetEmail();
    const otp = this.resetForm.get('otp')?.value;
    const password = this.resetForm.get('password')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    if (!email) {
      this.errorMessage.set('البريد الإلكتروني غير متوفر. يرجى العودة إلى استعادة كلمة المرور وطلب رمز جديد.');
      this.formState.set('error');
      return;
    }

    this.formState.set('loading');
    this.errorMessage.set(null);

    this.authService.resetPassword({
      email,
      otp,
      NewPassword: password,
      ConfirmPassword: confirmPassword
    }).subscribe({
      next: () => {
        this.formState.set('success');
        // تفريغ البيانات وتجهيز المودال المخصص
        this.resetForm.reset();
        localStorage.removeItem('resetEmail');
        
        // إظهار الـ Custom Alert بدلاً من الـ alert التقليدي
        this.showAlertModal.set(true);
      },
      error: (error) => {
        console.error('Reset password error:', error);
        this.formState.set('error');
        this.errorMessage.set(error?.error?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور. تأكد من الكود وحاول مجددًا.');
      }
    });
  }
}