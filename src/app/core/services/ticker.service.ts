import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface TickerItem {
  label: string;
  value: string;
  type: 'gold' | 'silver' | 'currency';
  change?: string;
  isUp?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TickerService {
  private http = inject(HttpClient);
  
  // استبدل هذا برابط الـ API والـ Key الخاص بك
  private readonly apiKey = 'b1a33ff7029c4a0d8013e6730950a715'; 
  private readonly apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${this.apiKey}`;

  getLatestPrices(): Observable<TickerItem[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const rates = data.rates;
        const egpRate = rates['EGP']; // سعر الدولار مقابل الجنيه
        
        // الأونصة العالمية تساوي 31.1034768 جرام
        const ounceToGram = 31.1034768;
        
        // أسعار المعادن الحالية تكون مقيمة بـ (1 / سعر المعدن بالدولار) للأونصة
        const goldOunceUSD = 1 / rates['XAU'];
        const silverOunceUSD = 1 / rates['XAG'];

        // تحويل الأسعار للجرام بالجنيه المصري
        const gold24kEGP = (goldOunceUSD / ounceToGram) * egpRate;
        const gold21kEGP = gold24kEGP * (21 / 24);
        const gold18kEGP = gold24kEGP * (18 / 24);
        const silverEGP = (silverOunceUSD / ounceToGram) * egpRate;

        // أسعار صرف العملات الأخرى مقابل الجنيه المصري
        const usdToEgp = egpRate;
        const eurToEgp = egpRate / rates['EUR'];
        const sarToEgp = egpRate / rates['SAR'];

        // بناء المصفوفة النهائية للـ Ticker
        return [
          { label: 'GOLD 24K', value: `${Math.round(gold24kEGP).toLocaleString()} EGP`, type: 'gold', change: '1.2%', isUp: true },
          { label: 'GOLD 21K', value: `${Math.round(gold21kEGP).toLocaleString()} EGP`, type: 'gold', change: '0.8%', isUp: true },
          { label: 'GOLD 18K', value: `${Math.round(gold18kEGP).toLocaleString()} EGP`, type: 'gold' },
          { label: 'SILVER', value: `${silverEGP.toFixed(2)} EGP`, type: 'silver', change: '0.1%', isUp: false },
          { label: 'USD / EGP', value: `${usdToEgp.toFixed(2)} EGP`, type: 'currency' },
          { label: 'EUR / EGP', value: `${eurToEgp.toFixed(2)} EGP`, type: 'currency' },
          { label: 'SAR / EGP', value: `${sarToEgp.toFixed(2)} EGP`, type: 'currency' }
        ];
      })
    );
  }
}