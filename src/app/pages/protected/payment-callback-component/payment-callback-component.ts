import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-callback-component.html',
  styleUrl: './payment-callback-component.css'
})
export class PaymentCallbackComponent implements OnInit {
  isSuccess: boolean = false;
  isPending: boolean = false;
  transactionId: string | null = null;
  amount: number = 0;
  orderId: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    // قراءة البيانات من الرابط (Query Parameters)
    this.route.queryParams.subscribe(params => {
      this.isLoading = true;
      
      // تحويل القيم النصية إلى قيم منطقية ورقمية صحيحة
      this.isSuccess = params['success'] === 'true';
      this.isPending = params['pending'] === 'true';
      this.transactionId = params['id'] || null;
      this.orderId = params['order'] || null;
      
      // تحويل القروش (cents) إلى جنيه مصري
      const cents = parseFloat(params['amount_cents']) || 0;
      this.amount = cents / 100;

      // التحقق من وجود أخطاء صريحة في بوابة الدفع
      if (params['error_occured'] === 'true') {
        this.isSuccess = false;
        this.errorMessage = this.i18n.translate('payment.gatewayError', 'حدث خطأ أثناء معالجة عملية الدفع من قبل البنك.');
      }

      this.isLoading = false;
    });
  }

  // دالة اختيارية لتوجيه المستخدم يدوياً إذا لم يرغب بالضغط على الروابط
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}