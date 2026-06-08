import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepositService } from '../../../core/services/deposit.service';

@Component({
  selector: 'app-depositing-funds',
  imports: [CommonModule, FormsModule],
  templateUrl: './depositing-funds.html',
  styleUrl: './depositing-funds.css',
})
export class DepositingFunds {
  depositAmount: number | null = null;

  constructor(private depositService: DepositService) {}

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
      alert('الرجاء إدخال مبلغ صحيح لإتمام عملية الإيداع.');
      return;
    }

    console.log(`Initiating deposit of ${this.depositAmount} EGP...`);

    this.depositService.createDeposit(this.depositAmount).subscribe({
      next: (response) => {
          if (response.checkoutUrl) {
            window.location.href = response.checkoutUrl;
          } else {
            alert(`تم تأكيد الإيداع بنجاح! رقم العملية: ${response.checkoutUrl}`);
          }
      },
      error: (err) => {
        console.error('Deposit Error:', err);
        alert('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.');
      }
    });
  }
}
