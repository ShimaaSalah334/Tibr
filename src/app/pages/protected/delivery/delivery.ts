import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../../core/services/delivery.service';
import { WalletApiData, WalletService } from '../../../core/services/wallet.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-delivery',
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.html',
  styleUrl: './delivery.css',
})
export class Delivery {
addresses: any[] = [];
deliveryRequests :any[] = [];
  
  deliveryForm = {
    addressId: null,
    assetType: 1,
    amountGrams: null
  };

  addressForm = {
    street: '',
    city: '',
    area: '',
    country: 'EGY',
    postalCode: '',
    isDefault: true
  };

  constructor(
    private deliveryService: DeliveryService,
    private walletService: WalletService,
    public i18n: I18nService
  ) {}

  successMessage = '';
  errorMessage = '';
  createdDeliveryInfo: any = null;
 
  goldHoldings :number =0;
  silverHoldings :number =0;


  ngOnInit(): void {
    this.loadAddresses();
    this.loadHoldings();
    this.loadAllOrderDelivery();
    console.log(this.deliveryRequests);
    
  }
   loadAllOrderDelivery(): void{
  this.deliveryService.getmyDliveries().subscribe({
      next: (data) => {
        console.log(data.data);
        
        this.deliveryRequests = data.data},
      error: (err) => this.showError(this.i18n.translate('delivery.loadError', 'حدث خطأ أثناء تحميل طلبات التوصيل الخاصة بك'))
    });
}
  loadAddresses(): void {
    this.deliveryService.getAddresses().subscribe({
      next: (data) => this.addresses = data,
      error: (err) => this.showError(this.i18n.translate('delivery.addressLoadError', 'حدث خطأ أثناء تحميل العناوين'))
    });
  }
  loadHoldings(): void {
     this.walletService.getWalletBalances().subscribe({
          next: (data: WalletApiData[]) => {
            data.forEach(wallet => {
              if (wallet.walletType === "Gold") {
                // حيازة الذهب
                this.goldHoldings = wallet.availableBalance;
              } else if (wallet.walletType === "Silver") {
                // حيازة الفضة
                this.silverHoldings = wallet.availableBalance;
              }
            });
            
          },
          error: (err) => console.error(this.i18n.translate('delivery.holdingsError', 'حدث خطأ أثناء جلب بيانات المحفظة'), err)
        });
  }
  onCreateAddress(): void {
    this.deliveryService.createAddress(this.addressForm).subscribe({
      next: () => {
        this.showSuccess(this.i18n.translate('delivery.addressCreated', 'تم إضافة العنوان بنجاح'));
        this.loadAddresses();
        this.resetAddressForm();
      },
      error: (err) => this.showError(this.i18n.translate('delivery.addressCreateError', 'حدث خطأ أثناء إضافة العنوان'))
    });
  }

  onDeleteAddress(id: number): void {
    this.deliveryService.deleteAddress(id).subscribe({
      next: () => {
        this.showSuccess(this.i18n.translate('delivery.addressDeleted', 'تم حذف العنوان بنجاح'));
        this.loadAddresses();
      },
      error: (err) => this.showError(this.i18n.translate('delivery.addressDeleteError', 'حدث خطأ أثناء حذف العنوان'))
    });
  }

  onSubmitDelivery(): void {
    if (!this.deliveryForm.addressId || !this.deliveryForm.amountGrams) {
      this.showError(this.i18n.translate('delivery.formIncomplete', 'يرجى ملء جميع الحقول المطلوبة'));
      return;
    }
console.log('Submitting delivery request with data:', this.deliveryForm);
    if(this.deliveryForm.assetType === 1 && this.deliveryForm.amountGrams > this.goldHoldings){
      this.showError(this.i18n.translate('delivery.insufficientGold', 'عذراً، لا يمكنك طلب توصيل كمية تفوق حيازاتك من الذهب'));
    } else if(this.deliveryForm.assetType === 2 && this.deliveryForm.amountGrams > this.silverHoldings){
      this.showError(this.i18n.translate('delivery.insufficientSilver', 'عذراً، لا يمكنك طلب توصيل كمية تفوق حيازاتك من الفضة'));
    }
    this.deliveryService.createDeliveryRequest(this.deliveryForm.addressId,this.deliveryForm.amountGrams, this.deliveryForm.assetType).subscribe({
      next: (response) => {
        this.showSuccess(this.i18n.translate('delivery.requestSubmitted', 'تم تقديم طلب التوصيل بنجاح'));
        this.trackDelivery(response.id || 1);
      },
      error: (err) => this.showError(this.i18n.translate('delivery.requestError', 'حدث خطأ أثناء تقديم طلب التوصيل'))
    });
  }

  trackDelivery(id: number): void {
    this.deliveryService.getDeliveryById(id).subscribe({
      next: (data) => this.createdDeliveryInfo = data,
      error: (err) => this.showError(this.i18n.translate('delivery.trackError', 'تعذر جلب تفاصيل الطلب الحالية'))
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 4000);
  }

  private showError(msg: string): void {
    this.errorMessage = msg;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 4000);
  }

  private resetAddressForm(): void {
    this.addressForm = {
      street: '',
      city: '',
      area: '',
      country: 'EGY',
      postalCode: '',
      isDefault: false
    };
  }
}
