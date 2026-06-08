import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-withdraw-funds',
  imports: [CommonModule, FormsModule],
  templateUrl: './withdraw-funds.html',
  styleUrl: './withdraw-funds.css',
})
export class WithdrawFunds {
// Balance State
  availableBalance = 45000.00;
  minWithdrawal = 100;
  maxDailyWithdrawal = 50000;

  // Form State
  withdrawalAmount: number | null = null;
  selectedBank: string = 'rajhi'; // Default selected bank input

  // Live Spot Market Ticker Data
  spotPrices = {
    gold: '7,432.50',
    silver: '104.22'
  };

  // Check if requested input exceeds the total user balance limits
  get isAmountOverLimit(): boolean {
    if (!this.withdrawalAmount) return false;
    return this.withdrawalAmount > this.availableBalance;
  }

  // Handle transaction confirmation event
  confirmWithdrawal(): void {
    if (!this.withdrawalAmount || this.isAmountOverLimit) {
      alert('الرجاء إدخال مبلغ صحيح ضمن الحدود المتاحة.');
      return;
    }
    
    alert(`تم تقديم طلب سحب بمبلغ ${this.withdrawalAmount} ر.س بنجاح.`);
  }
}
