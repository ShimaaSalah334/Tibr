import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
// Import your Toast service here. Example: import { ToastrService } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-verfiy-account',
  imports: [ReactiveFormsModule],
  templateUrl: './verfiy-account.html',
  styleUrl: './verfiy-account.css',
})
export class VerfiyAccount implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  email: string = '';
  
  // Injecting dependencies using standard modern Angular inject()
  private router = inject(Router);
  private toast = inject(ToastrService); // Standard Toast Service injection

  // أسماء مفاتيح التحكم للحقول الستة لسهولة إدارتها ديناميكياً
  inputKeys = ['code1', 'code2', 'code3', 'code4', 'code5', 'code6'];
  
  // جلب مراجع الحقول من الـ DOM لإدارة الـ Focus البرمجي
  @ViewChildren('otpInputField') inputs!: QueryList<ElementRef>;

  // إدارة الحالات الرقمية والزمنية للمكون عبر الـ Signals الحديثة
  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  isResending = signal<boolean>(false);
  isTimerActive = signal<boolean>(false);
  timerValue = signal<number>(59);
  
  // إشارات التحكم في المودالات المخصصة (Custom Alerts)
  showSuccessModal = signal<boolean>(false);
  showResendModal = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  private timerIntervalId: any;
  private tempUserId: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute, public i18n: I18nService) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('registeredEmail') || '';
    this.initForm();
  }

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  private initForm(): void {
    const group: any = {};
    this.inputKeys.forEach(key => {
      group[key] = ['', [Validators.required, Validators.pattern(/^\d$/)]];
    });
    this.otpForm = this.fb.group(group);
  }

  // ميكانيكية الكتابة والتنقل الأمامي التلقائي للحقول
  onInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const value = inputEl.value;

    if (value && index < this.inputs.length - 1) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  // ميكانيكية التنقل العكسي البرمجي عن الضغط على Backspace
  onKeyDown(event: KeyboardEvent, index: number): void {
    const inputEl = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !inputEl.value && index > 0) {
      this.inputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  // ميكانيكية دعم لصق الرمز المكون من 6 أرقام دفعة واحدة (Paste Event Support)
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text');
    if (clipboardData && /^\d{6}$/.test(clipboardData)) {
      const digits = clipboardData.split('');
      this.inputKeys.forEach((key, i) => {
        this.otpForm.get(key)?.setValue(digits[i]);
      });
      this.inputs.last.nativeElement.focus();
    }
  }

  startResendTimer(): void {
    this.clearResendTimer();
    this.timerValue.set(59);
    this.isTimerActive.set(true);

    this.timerIntervalId = setInterval(() => {
      this.timerValue.update(val => val - 1);
      if (this.timerValue() <= 0) {
        this.clearResendTimer();
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
    this.isTimerActive.set(false);
  }

  // دالة إغلاق تنبيه إعادة الإرسال
  closeResendModal(): void {
    this.showResendModal.set(false);
  }

  // دالة المودال النهائي للانتقال لتوثيق الهوية (KYC)
  closeSuccessAndNavigate(): void {
    this.showSuccessModal.set(false);
    this.formState.set('idle');
    localStorage.removeItem('registeredEmail');
    if (this.tempUserId) {
      localStorage.setItem('userId', this.tempUserId);
    }
    this.router.navigate(['/verfiy-kyc']);
  }

  resendCode(): void {
    if (this.isTimerActive()) return;

    this.isResending.set(true);
    this.errorMessage.set('');

    this.authService.resendOtp(this.email).subscribe({
      next: () => {
        this.isResending.set(false);
        this.otpForm.reset();
        this.inputs.first.nativeElement.focus();
        this.startResendTimer();
        
        // إظهار تنبيه إعادة الإرسال الفخم
        this.showResendModal.set(true);
      },
      error: (error) => {
        this.isResending.set(false);
        console.error(error);
        this.formState.set('error');
        
        const msg = localStorage.getItem('tibr_locale')=="ar"?  'حدث خطأ أثناء إعادة إرسال رمز الأمان. يرجى المحاولة لاحقاً.':'An error occurred while resending the security code. Please try again later.';
        this.errorMessage.set(msg);
        
        // Triggering the error toast notification
        this.toast.error(msg); 
      }
    });
  }

  onSubmit(): void {
    if (this.otpForm.invalid || this.formState() === 'loading') {
      return;
    }

    this.formState.set('loading');
    this.errorMessage.set('');

    const rawOtpCode = Object.values(this.otpForm.value).join('');

    const payload = {
      otp: rawOtpCode,
      email: this.email,
    };

    this.authService.verfiyAccount(payload).subscribe({
      next: (response) => {
        console.log(response);
        this.formState.set('success');
        this.tempUserId = response.userId;

        this.showSuccessModal.set(true);
      },
      error: (error) => {
        console.error(error);
        this.formState.set('error');
        
        const msg = localStorage.getItem('tibr_locale')=="ar"? error?.error?.messageAR :error?.error?.messageEN ;
        this.errorMessage.set(msg);
        
        // Triggering the error toast notification
        this.toast.error(msg); 
      }
    });
  }
}