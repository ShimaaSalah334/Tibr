import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../../core/services/delivery.service';
import { WalletApiData, WalletService } from '../../../core/services/wallet.service';

@Component({
  selector: 'app-delivery',
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.html',
  styleUrl: './delivery.css',
})
export class Delivery {
addresses: any[] = [];
  
  deliveryForm = {
    addressId: null,
    assetType: 1,
    amountGrams: null
  };

  addressForm = {
    street: '',
    city: '',
    state: '',
    country: 'EGY',
    postalCode: '',
    isDefault: true
  };

  successMessage = '';
  errorMessage = '';
  createdDeliveryInfo: any = null;
 
  goldHoldings :number =0;
  silverHoldings :number =0;

  constructor(private deliveryService: DeliveryService, private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadAddresses();
    this.loadHoldings();
  }

  loadAddresses(): void {
    this.deliveryService.getAddresses().subscribe({
      next: (data) => this.addresses = data,
      error: (err) => this.showError('حدث خطأ أثناء تحميل العناوين')
    });
  }
  loadHoldings(): void {
     this.walletService.getWalletBalances().subscribe({
          next: (data: WalletApiData[]) => {
            data.forEach(wallet => {
              if (wallet.walletType === 2) {
                // حيازة الذهب
                this.goldHoldings = wallet.availableBalance;
              } else if (wallet.walletType === 3) {
                // حيازة الفضة
                this.silverHoldings = wallet.availableBalance;
              }
            });
            
          },
          error: (err) => console.error('خطأ أثناء جلب بيانات المحفظة:', err)
        });
  }
  onCreateAddress(): void {
    this.deliveryService.createAddress(this.addressForm).subscribe({
      next: () => {
        this.showSuccess('تم إضافة العنوان بنجاح');
        this.loadAddresses();
        this.resetAddressForm();
      },
      error: (err) => this.showError('حدث خطأ أثناء إضافة العنوان')
    });
  }

  onDeleteAddress(id: number): void {
    this.deliveryService.deleteAddress(id).subscribe({
      next: () => {
        this.showSuccess('تم حذف العنوان بنجاح');
        this.loadAddresses();
      },
      error: (err) => this.showError('حدث خطأ أثناء حذف العنوان')
    });
  }

  onSubmitDelivery(): void {
    if (!this.deliveryForm.addressId || !this.deliveryForm.amountGrams) {
      this.showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
console.log('Submitting delivery request with data:', this.deliveryForm);
    if(this.deliveryForm.assetType === 1 && this.deliveryForm.amountGrams > this.goldHoldings){
      alert('عذراً، لا يمكنك طلب توصيل كمية تفوق حيازاتك من الذهب');
    } else if(this.deliveryForm.assetType === 2 && this.deliveryForm.amountGrams > this.silverHoldings){
      alert('عذراً، لا يمكنك طلب توصيل كمية تفوق حيازاتك من الفضة');
    }
    this.deliveryService.createDeliveryRequest(this.deliveryForm.addressId,this.deliveryForm.amountGrams, this.deliveryForm.assetType).subscribe({
      next: (response) => {
        this.showSuccess('تم تقديم طلب التوصيل بنجاح');
        this.trackDelivery(response.id || 1);
      },
      error: (err) => this.showError('حدث خطأ أثناء تقديم طلب التوصيل')
    });
  }

  trackDelivery(id: number): void {
    this.deliveryService.getDeliveryById(id).subscribe({
      next: (data) => this.createdDeliveryInfo = data,
      error: (err) => this.showError('تعذر جلب تفاصيل الطلب الحالية')
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
      state: '',
      country: 'EGY',
      postalCode: '',
      isDefault: false
    };
  }
}
