import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
// Navigation State
  activeTab: 'personal' | 'security' | 'verification' | 'preferences' = 'personal';

  // Form State Properties
  userData = {
    fullName: 'أحمد العتيبي',
    email: 'a.otaibi@aurum.com',
    phone: '+966 50 123 4567',
    currency: 'SAR - ريال سعودي',
    twoFactor: true,
    language: 'العربية',
    darkMode: false,
    priceAlerts: true
  };

  // Button Action States
  saveButtonText = 'حفظ التغييرات';
  isSaving = false;
  isSaveSuccess = false;

  switchTab(tabId: 'personal' | 'security' | 'verification' | 'preferences'): void {
    this.activeTab = tabId;
  }

  saveChanges(): void {
    if (this.isSaving) return;

    this.isSaving = true;
    this.saveButtonText = 'جاري الحفظ...';

    // Simulate API Response processing
    setTimeout(() => {
      this.isSaving = false;
      this.isSaveSuccess = true;
      this.saveButtonText = 'تم الحفظ بنجاح';

      // Reset button to normal after delay
      setTimeout(() => {
        this.isSaveSuccess = false;
        this.saveButtonText = 'حفظ التغييرات';
      }, 2000);
    }, 1000);
  }
}
