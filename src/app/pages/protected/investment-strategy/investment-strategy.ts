import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StrategyPayload, StrategyResponse, StrategyService } from '../../../core/services/strategy.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-investment-strategy',
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-strategy.html',
  styleUrl: './investment-strategy.css',
})
export class InvestmentStrategy implements OnInit {
selectedAsset: 'gold' | 'silver' = 'gold';
  side: 'buy' | 'sell' = 'buy';
  quantity: number = 10;
  conditionType: string = 'Less Than';
  targetPrice: number | null = null;
  executionType: string = 'Auto Execute';
  expirationDate: string = '';

  // قائمة الاستراتيجيات المجلوبة من السيرفر
  strategiesList: StrategyResponse[] = [];

  // رسائل الحالة والتحميل
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isListLoading: boolean = false;


  constructor(private strategyService: StrategyService,public i18n: I18nService) {}

  ngOnInit(): void {
    // جلب الاستراتيجيات فور تحميل المكون (الصفحة)
    this.loadUserStrategies();
  }

  get assetArabicName(): string {
    return this.selectedAsset === 'gold' ? 'الذهب' : 'الفضة';
  }

  selectAsset(asset: 'gold' | 'silver') {
    this.selectedAsset = asset;
  }

  // دالة جلب البيانات من الـ API
  loadUserStrategies() {
    this.isListLoading = true;
    this.strategyService.getStrategies().subscribe({
      next: (data) => {
        this.strategiesList = data;
        this.isListLoading = false;
      },
      error: (err) => {
        this.isListLoading = false;
        console.error('Error fetching strategies:', err);
      }
    });
  }

  // دالة إطلاق وإرسال الاستراتيجية الجديدة
  launchStrategy() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.targetPrice || this.targetPrice <= 0 || this.quantity <= 0) {
      this.errorMessage = 'الرجاء إدخال كمية وسعر مستهدف صحيحين.';
      return;
    }

    const operatorMap: { [key: string]: any } = {
      'Less Than': 'less_than',
      'Greater Than': 'greater_than',
      'Equal To': 'equal'
    };

    const executionMap: { [key: string]: any } = {
      'Alert Only': 'alert_only',
      'Auto Execute': 'auto_execute',
      'Alert + Execute': 'alert_and_execute'
    };

    const payload: StrategyPayload = {
      asset: this.selectedAsset,
      side: this.side,
      quantity: this.quantity,
      operator: operatorMap[this.conditionType],
      targetPriceEgp: this.targetPrice,
      executionType: executionMap[this.executionType]
    };

    if (this.expirationDate) {
      payload.expiresAt = this.expirationDate;
    }

    this.isLoading = true;

    this.strategyService.createStrategy(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `تم إنشاء الاستراتيجية بنجاح! رقم المعاملة: ${response.id}`;
        
        // إعادة تحديث القائمة تلقائياً بعد الإضافة الناجحة دون الحاجة لعمل Refresh للمتصفح
        this.loadUserStrategies(); 
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'جلسة العمل انتهت (401)، يرجى إعادة تسجيل الدخول.';
        } else if (err.status === 400) {
          this.errorMessage = 'خطأ في البيانات أو رصيد غير كافٍ لتنفيذ العملية (400).';
        } else {
          this.errorMessage = 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.';
        }
      }
    });
  }

  // دوال مساعدة لترجمة النصوص داخل الجدول البرمجي بشكل أنيق للعميل
  translateAsset(asset: string): string {
    return asset.toLowerCase() === 'gold' ? 'ذهب' : 'فضة';
  }

  translateSide(side: string): string {
    return side.toLowerCase() === 'buy' ? 'شراء' : 'بيع';
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'executed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  }
}
