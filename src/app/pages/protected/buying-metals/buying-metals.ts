import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetPrice } from '../../../core/services/asset-price.service';
import { environment } from '../../../core/environments/environment.development';
import { WalletApiData } from '../../../core/services/wallet.service';
import { TradeService } from '../../../core/services/trade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buying-metals',
  imports: [CommonModule, FormsModule],
  templateUrl: './buying-metals.html',
  styleUrl: './buying-metals.css',
})
export class BuyingMetals implements OnInit {
  currentAsset: 'gold' | 'silver' = 'gold';
  availableBalance: number = 0;
  goldPricePerGram: number = 0;
  silverPricePerGram: number = 0;
  currentUnitPrice: number = 0;

  inputGrams: number | null = null;
  expectedPrice: number  = 0;
  totalGrams: number = 0;
  totalCost: number = 0;


  isProcessing: boolean = false;
  showSuccessModal: boolean = false;
  successModalScale: boolean = false;


  constructor(private http: HttpClient, private assetPriceService: AssetPrice,private tradeService: TradeService,private router: Router) {}

  ngOnInit(): void {
    this.fetchPricesFromApi();
      this.http.get<WalletApiData[]>(`${environment.apiUrl}/wallet`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      }).subscribe({
        next: (response) => {
          this.availableBalance = response[0].balance;
        },
        error: (err) => {
          console.error('فشل في جلب الرصيد من الـ API', err);
        }
      });
  }

  fetchPricesFromApi(): void {
    this.assetPriceService.getCurrentPrices().subscribe({
      next: (data) => {
        this.goldPricePerGram = data.gold.sellPrice ; 
        this.silverPricePerGram = data.silver.sellPrice;
        this.updateCurrentUnitPrice();
      },
      error: (err) => {
        console.error('فشل في جلب الأسعار من الـ API، سيتم استخدام أسعار افتراضية', err);
        this.goldPricePerGram = 0; 
        this.silverPricePerGram = 0;
        this.updateCurrentUnitPrice();
      }
    });
  }
 updateCurrentUnitPrice(): void {
    this.currentUnitPrice = this.currentAsset === 'gold' ? this.goldPricePerGram : this.silverPricePerGram;
    this.calculateFromGrams();
  }

  setAsset(asset: 'gold' | 'silver'): void {
    this.currentAsset = asset;
    this.updateCurrentUnitPrice();
  }

  calculateFromGrams(): void {
    if (this.inputGrams && this.inputGrams > 0) {
      this.totalGrams = this.inputGrams;
      this.totalCost = this.totalGrams * this.currentUnitPrice;
      this.expectedPrice = Number(this.totalCost.toFixed(2));
    } else {
      this.clearCalculations();
    }
  }

  calculateFromExpectedPrice(): void {
    if (this.expectedPrice && this.expectedPrice > 0 && this.currentUnitPrice > 0) {
      this.totalCost = this.expectedPrice;
      this.totalGrams = this.expectedPrice / this.currentUnitPrice;
      this.inputGrams = Number(this.totalGrams.toFixed(4));
    } else {
      this.clearCalculations();
    }
  }

  clearCalculations(): void {
    this.totalGrams = 0;
    this.totalCost = 0;
    if (this.inputGrams === 0) this.inputGrams = null;
    if (this.expectedPrice === 0) this.expectedPrice = 0;
  }

  get isBalanceInsufficient(): boolean {
    return this.totalCost > this.availableBalance;
  }

  get isConfirmDisabled(): boolean {
    return (
      this.totalCost <= 0 || 
      this.isBalanceInsufficient || 
      this.isProcessing
    );
  }

  processOrder(): void {
    if (this.isConfirmDisabled) return;

    this.isProcessing = true;
    this.tradeService.buyTrade(this.currentAsset === 'gold' ? 1 : 2, this.totalGrams, this.expectedPrice).subscribe({
      next: (response) => {
        console.log('Buy Trade Response:', response);
      },
      error: (err) => {
        console.error('Buy Trade Error:', err);
        alert('حدث خطأ أثناء تنفيذ عملية الشراء. يرجى المحاولة مرة أخرى لاحقاً.');
        this.isProcessing = false;
      }
    });
    setTimeout(() => {
      this.isProcessing = false;
      this.availableBalance -= this.totalCost; 
      
      this.showSuccessModal = true;
      setTimeout(() => {
        this.successModalScale = true;
      }, 50);
    }, 2000); 
  }

  resetWorkflow(): void {
    this.successModalScale = false;
    setTimeout(() => {
      this.showSuccessModal = false;
      this.inputGrams = null;
      this.expectedPrice = 0;
      this.totalGrams = 0;
      this.totalCost = 0;
    }, 200);
    this.router.navigate(['/wallet']);
  }
}
