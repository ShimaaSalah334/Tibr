import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetDetails, AssetMap } from '../../../core/interfaces/iasset-price';
import { TradeService } from '../../../core/services/trade.service';
import { environment } from '../../../core/environments/environment.development';
import { WalletApiData } from '../../../core/services/wallet.service';
import { HttpClient } from '@angular/common/http';
import { AssetPrice } from '../../../core/services/asset-price.service';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
interface AssetMetadata {
  id: 'gold' | 'silver';
  title: string;
  purityLabel: string;
  availableGrams: number;
  livePricePerGram: number;
}
@Component({
  selector: 'app-selling-metals',
  imports: [CommonModule, FormsModule],
  templateUrl: './selling-metals.html',
  styleUrl: './selling-metals.css',
})
export class SellingMetals implements OnInit {
  assets: WalletApiData[] = [];

  selectedAssetId: 'gold' | 'silver' = null!;
  sellAmountGrams: number | null = null;
  goldPricePerGram: number = 0;
  silverPricePerGram: number = 0;
  constructor(
    private http: HttpClient,
    private tradeService: TradeService,
    private assetPriceService: AssetPrice,
    private router: Router,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadLiveMarketData();
  }

  loadLiveMarketData(): void {
    this.http
      .get<WalletApiData[]>(`${environment.apiUrl}/wallet`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .subscribe({
        next: (response) => {
          this.assets = response;
        },
        error: (err) => {
          console.error('فشل في جلب الرصيد من الـ API', err);
        },
      });

       this.assetPriceService.getCurrentPrices().subscribe({
      next: (data) => {
        this.goldPricePerGram = data.gold.sellPrice ; 
        this.silverPricePerGram = data.silver.sellPrice;
      },
      error: (err) => {
        console.error('فشل في جلب الأسعار من الـ API، سيتم استخدام أسعار افتراضية', err);
        this.goldPricePerGram = 0; 
        this.silverPricePerGram = 0;
      }
    });
  }


  get currentAsset(): any {
    return this.assets[this.selectedAssetId === 'gold' ? 1 : 2];
  }


  selectAsset(assetId: 'gold' | 'silver'): void {
    this.selectedAssetId = assetId;
    this.sellAmountGrams = this.selectedAssetId === 'gold' ? this.assets[1].availableBalance : this.assets[2].availableBalance; 
    console.log(this.selectedAssetId);
    
  }

 
  sellAllLiquidity(): void {
    this.sellAmountGrams = this.currentAsset.availableGrams;
  }

  /**
   * Computes layout estimation metrics: Raw value before platform deductions
   */
  get rawEstimatedValue(): number {
    console.log("this.sellAmountGrams",this.sellAmountGrams);
    
    if (!this.sellAmountGrams || this.sellAmountGrams <= 0) return 0;
    return this.selectedAssetId === 'gold' ? this.sellAmountGrams * this.goldPricePerGram : this.sellAmountGrams * this.silverPricePerGram;
  }


  get finalNetPayout(): number {
    return this.rawEstimatedValue ;
  }


  get isInputInvalid(): boolean {
    if (!this.sellAmountGrams || this.sellAmountGrams <= 0) return true;
    return this.sellAmountGrams > this.currentAsset.availableGrams;
  }


  executeLiquidationSale(): void {
    if (this.isInputInvalid) return;
    this.tradeService.sellTrade(this.selectedAssetId === 'gold' ? 1 : 2, this.sellAmountGrams!,this.rawEstimatedValue).subscribe({
      next: (res) => {
        if (res) {
          const successMessage = this.i18n.translate(
            'selling.saleSuccessAlert',
            'تمت عملية البيع بنجاح! تم إيداع {{amount}} ج.م في محفظتك.'
          ).replace('{{amount}}', this.finalNetPayout.toFixed(2));
          alert(successMessage);
          this.router.navigate(['/wallet']);
        } else {
          alert(this.i18n.translate('selling.saleFailureAlert', 'فشلت المعاملة'));
        }
      },
      error: (err) => {
        console.error('Liquidation API error', err);
        alert(this.i18n.translate('selling.saleErrorAlert', 'حدث خطأ أثناء تنفيذ الطلب، يرجى المحاولة لاحقاً.'));
      },
    });
  }
}
