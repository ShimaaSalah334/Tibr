import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-pendding-account',
  imports: [CommonModule, RouterModule],
  templateUrl: './pendding-account.html',
  styleUrl: './pendding-account.css',
})
export class PenddingAccount {
public i18n = inject(I18nService);
  
  // حالة زر تحديث البيانات
  public isChecking = signal<boolean>(false);

  public checkStatus(): void {
    this.isChecking.set(true);
    
    // محاكاة طلب للـ API للتحقق هل تمت الموافقة أم لا
    setTimeout(() => {
      this.isChecking.set(false);
      // هنا يمكنك إضافة منطق التوجيه (Routing) إذا تغيرت الحالة إلى Active
    }, 1500);
  }
}
