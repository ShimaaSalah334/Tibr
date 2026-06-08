import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-investment-strategy',
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-strategy.html',
  styleUrl: './investment-strategy.css',
})
export class InvestmentStrategy {
// State variables for conditional strategy
  selectedAsset: 'gold' | 'silver' = 'gold';
  conditionType: string = 'Less Than';
  targetPrice: number | null = null;
  executionType: string = 'Alert Only';
  expirationDate: string = '';

  ngOnInit(): void {
    // Optional default configurations initialization
  }

  // Strategic Asset selection handler
  selectAsset(asset: 'gold' | 'silver'): void {
    this.selectedAsset = asset;
  }

  // Mapped Arabic translations Computed Logic
  get assetArabicName(): string {
    return this.selectedAsset === 'gold' ? 'الذهب' : 'الفضة';
  }

  get conditionArabicText(): string {
    switch (this.conditionType) {
      case 'Greater Than': return 'أكبر من';
      case 'Equal To': return 'يساوي';
      default: return 'أقل من';
    }
  }

  get executionArabicText(): string {
    switch (this.executionType) {
      case 'Auto Execute': return 'الشراء تلقائياً';
      case 'Alert + Execute': return 'تنبيهك والشراء تلقائياً';
      default: return 'تنبيهك فقط';
    }
  }

  // Trigger strategy deploy operation pipeline
  launchStrategy(): void {
    if (!this.targetPrice || this.targetPrice <= 0) {
      alert('الرجاء إدخال سعر مستهدف صحيح قبل إطلاق الاستراتيجية.');
      return;
    }
    
    const summary = `تم إطلاق استراتيجية ${this.assetArabicName} بنجاح عند سعر ${this.targetPrice}$ بتنفيذ: ${this.executionArabicText}`;
    alert(summary);
  }
}
