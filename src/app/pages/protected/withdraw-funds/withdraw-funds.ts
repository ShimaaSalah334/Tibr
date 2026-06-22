import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WithdrawService } from '../../../core/services/withdraw.service';
import { WithdrawRequest } from '../../../core/interfaces/withdraw';
import { WalletApiData, WalletService } from '../../../core/services/wallet.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-withdraw-funds',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './withdraw-funds.html',
  styleUrl: './withdraw-funds.css',
})
export class WithdrawFunds implements OnInit {
  withdrawForm!: FormGroup;
  availableBalance: number = 0; 
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private withdrawService: WithdrawService,
    private walletService: WalletService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadWalletData();
  }
 loadWalletData(): void {
    this.walletService.getWalletBalances().subscribe({
      next: (data: WalletApiData[]) => {
        data.forEach(wallet => {
          console.log(wallet.walletType == "Silver");
          if (wallet.walletType == "Cash") {
            this.availableBalance = wallet.availableBalance;
          } 
        });
      },
      error: (err) => console.error('خطأ أثناء جلب بيانات المحفظة:', err)
    });
  }
  initForm(): void {
    this.withdrawForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(100), Validators.max(50000)]],
      type: ['Bank', Validators.required], // القيمة مطابقة للـ API: 'Bank' أو 'EWallet'
      name: ['', Validators.required],     // اسم البنك أو مقدم الخدمة
      number: ['', Validators.required]    // الآيبان أو رقم الهاتف
    });

    // مراقبة التغييرات لمسح القيم السابقة عند تبديل طريقة السحب
    this.withdrawForm.get('type')?.valueChanges.subscribe(() => {
      this.withdrawForm.get('name')?.reset('');
      this.withdrawForm.get('number')?.reset('');
    });
  }

  // خاصية للتحقق مما إذا كان المبلغ المدخل أكبر من الحد اليومي المسموح به
  get isAmountOverLimit(): boolean {
    const amountControl = this.withdrawForm.get('amount');
    return !!(amountControl?.value > 50000 || amountControl?.value > this.availableBalance);
  }

  // مساعد لفحص حالة الخطأ لتطبيق كلاسات التحقق المخصصة
  isFieldInvalid(controlName: string): boolean {
    const control = this.withdrawForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  confirmWithdrawal(): void {
    if (this.withdrawForm.invalid) {
      this.withdrawForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    // تجهيز البيانات وفقاً للإنترفيس WithdrawRequest الخاص بالسيرفيس
    const payload: WithdrawRequest = this.withdrawForm.value;

    // استدعاء السيرفيس بدلاً من الـ http المباشر
    this.withdrawService.createWithdrawal(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = this.i18n.translate('withdraw.success', 'تم إنشاء طلب السحب بنجاح!');
        // إعادة تعيين النموذج مع الحفاظ على النوع الافتراضي
        this.withdrawForm.reset({ type: 'Bank', amount: null, name: '', number: '' });
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error.status === 400) {
          this.errorMessage = this.i18n.translate('withdraw.validationError', 'فشل في التحقق من البيانات. يرجى التأكد من المدخلات والحدود المسموحة.');
        } else if (error.status === 401) {
          this.errorMessage = this.i18n.translate('withdraw.unauthorized', 'غير مصرح لك لإتمام هذه العملية. يرجى تسجيل الدخول مجدداً.');
        } else {
          this.errorMessage = this.i18n.translate('withdraw.unexpectedError', 'حدث خطأ غير متوقع أثناء معالجة طلبك، يرجى المحاولة لاحقاً.');
        }
      }
    });
  }
}