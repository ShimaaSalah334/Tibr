import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WalletApiData, WalletService } from '../../../core/services/wallet.service';
import { Router } from '@angular/router';

interface Transaction {
  type: string;
  typeEn: string;
  icon: string;
  iconColorClass: string;
  date: string;
  amount: string;
  status: string;
  statusColorClass: string;
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // أضفنا HttpClientModule هنا
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet implements OnInit {
  // متغيرات مسبقة التعيين كـ قيم افتراضية حتى تنتهي عملية التحميل
  goldPrice = '2,450.50';
  goldChange = '+0.5%';
  silverPrice = '28.30';
  silverChange = '-0.2%';

  userName = 'احمد محمد';
  userTier = 'عضو ذهبي';
  isVerified = true;

  totalPortfolioValue = '0.00';
  portfolioChangeToday = '+0.00 (0%)';
  lastUpdatedText = 'الآن';
  
  // المتغيرات المرتبطة بالـ HTML مباشرة
  cashWalletBalance = '0.00';
  goldHoldings = '0.00';
  silverHoldings = '0.00';

  // مصفوفة العمليات
  transactions: Transaction[] = [];

  constructor(private walletService: WalletService,private router: Router) {}

  ngOnInit(): void {
    this.loadWalletData();
    this.loadTransactions();
  }

  // استدعاء بيانات المحافظ وتوزيعها بناءً على الـ walletType
  loadWalletData(): void {
    this.walletService.getWalletBalances().subscribe({
      next: (data: WalletApiData[]) => {
        data.forEach(wallet => {
          if (wallet.walletType === 1) {
            // المحفظة النقدية
            this.cashWalletBalance = wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
          } else if (wallet.walletType === 2) {
            // حيازة الذهب
            this.goldHoldings = wallet.availableBalance.toString();
          } else if (wallet.walletType === 3) {
            // حيازة الفضة
            this.silverHoldings = wallet.availableBalance.toString();
          }
        });
        
        // حساب إجمالي قيمة المحفظة تقريبياً (إذا كانت الحيازات تحتاج ضرب في الأسعار الحالية)
        this.calculateTotalPortfolio();
      },
      error: (err) => console.error('خطأ أثناء جلب بيانات المحفظة:', err)
    });
  }

  // استدعاء العمليات المعالجة وتحويلها لتناسب التصميم البصري
  loadTransactions(): void {
    this.walletService.getTransactions().subscribe({
      next: (apiTransactions: any[]) => {
        this.transactions = apiTransactions.map(tx => ({
          type: tx.typeAr || tx.type || 'عملية مجهولة',
          typeEn: tx.typeEn || 'Unknown',
          icon: this.getIconByAction(tx.action),
          iconColorClass: this.getIconClassByAction(tx.action),
          date: tx.date || 'اليوم',
          amount: tx.formattedAmount || `${tx.amount} EGP`,
          status: tx.statusAr || 'مكتمل',
          statusColorClass: tx.status === 'completed' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'
        }));
      },
      error: (err) => {
        console.error('خطأ أثناء جلب العمليات:', err);
        this.transactions = []; 
      }
    });
  }

  calculateTotalPortfolio(): void {
    const cash = parseFloat(this.cashWalletBalance.replace(/,/g, '')) || 0;
    const goldValue = (parseFloat(this.goldHoldings) || 0) * parseFloat(this.goldPrice.replace(/,/g, ''));
    const silverValue = (parseFloat(this.silverHoldings) || 0) * parseFloat(this.silverPrice.replace(/,/g, ''));
    
    this.totalPortfolioValue = (cash + goldValue + silverValue).toLocaleString('en-US', { minimumFractionDigits: 2 });
  }

  private getIconByAction(action: string): string {
    switch(action) {
      case 'buy': return 'shopping_bag';
      case 'sell': return 'sell';
      case 'deposit': return 'add_card';
      case 'withdraw': return 'payments';
      default: return 'swap_horiz';
    }
  }

  private getIconClassByAction(action: string): string {
    switch(action) {
      case 'buy': return 'bg-success bg-opacity-10 text-success';
      case 'sell': return 'bg-danger bg-opacity-10 text-danger';
      default: return 'bg-primary bg-opacity-10 text-primary';
    }
  }

  onAction(actionType: string) {
    console.log(`Action triggered: ${actionType}`);
    if (actionType === 'buy') {
      // توجيه المستخدم إلى صفحة شراء المعادن
      this.router.navigate(['/buying-metals']);
    } else if (actionType === 'sell') {
      // توجيه المستخدم إلى صفحة بيع المعادن
      this.router.navigate(['/selling-metals']);
    }else if (actionType === 'deposit') {
      // توجيه المستخدم إلى صفحة إيداع الأموال
      this.router.navigate(['/depositing-funds']);
    } else if (actionType === 'withdraw') {
      // توجيه المستخدم إلى صفحة سحب الأموال
      this.router.navigate(['/withdraw-funds']);
    }else if (actionType === 'strategy') {
      // توجيه المستخدم إلى صفحة استراتيجية الاستثمار
      this.router.navigate(['/investment-strategy']);
    }else if(actionType === 'delivery'){
      this.router.navigate(['/delivery']);
    }
  }
}