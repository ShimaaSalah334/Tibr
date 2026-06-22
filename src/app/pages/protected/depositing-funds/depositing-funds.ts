import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepositService } from '../../../core/services/deposit.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-depositing-funds',
  imports: [CommonModule, FormsModule],
  templateUrl: './depositing-funds.html',
  styleUrl: './depositing-funds.css',
})
export class DepositingFunds {
  depositAmount: number | null = null;

  constructor(
    private depositService: DepositService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {}

  get formattedAmount(): string {
    if (!this.depositAmount || isNaN(this.depositAmount)) {
      return '0.00';
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.depositAmount);
  }

  setAmount(amount: number): void {
    this.depositAmount = amount;
  }
  executeDeposit(): void {
    if (!this.depositAmount || this.depositAmount <= 0) {
      alert(this.i18n.translate('deposit.error', 'الرجاء إدخال مبلغ صحيح لإتمام عملية الإيداع.'));
      return;
    }

    console.log(`Initiating deposit of ${this.depositAmount} EGP...`);

    this.depositService.createDeposit(this.depositAmount).subscribe({
      next: (response) => {
          if (response.checkoutUrl) {
            window.location.href = response.checkoutUrl;
          } else {
            alert(this.i18n.translate('deposit.successAlert', 'تم تأكيد الإيداع بنجاح! رقم العملية: {{checkoutUrl}}'));
          }
      },
      error: (err) => {
        console.error('Deposit Error:', err);
        alert(this.i18n.translate('deposit.serverError', 'حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.'));
      }
    });
  }
}
