import { Component, signal, HostListener, OnInit, OnDestroy, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { I18nService, AppLocale } from '../../core/services/i18n.service';
import { TickerService, TickerItem } from '../../core/services/ticker.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe, HttpClientModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  // حقن الخدمات (Services) والـ ElementRef
  private readonly i18nService = inject(I18nService);
  private readonly elementRef = inject(ElementRef);
  private readonly tickerService = inject(TickerService);

  // لغات الترجمة
  readonly currentLang = this.i18nService.currentLang;
  readonly loadingTranslations = this.i18nService.loading;

  // الحالات (Signals)
  isLoggedIn     = signal<boolean>(false);
  cartCount      = signal<number>(0);
  mobileMenuOpen = signal<boolean>(false);
  userMenuOpen   = signal<boolean>(false);
  isScrolled     = signal<boolean>(false);
  
  // بيانات شريط الأسعار الحية (Ticker)
  tickerData     = signal<TickerItem[]>([]);

  // مستمع لحدث الضغط في أي مكان بالشاشة لإغلاق القوائم تلقائياً (Dropdowns)
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // 1. إغلاق قائمة المستخدم إذا كانت مفتوحة والضغطة خارجها
    if (this.userMenuOpen()) {
      const clickedInsideUser = this.elementRef.nativeElement.querySelector('.user-menu')?.contains(event.target);
      if (!clickedInsideUser) {
        this.closeUserMenu();
      }
    }

    // 2. إغلاق قائمة الموبايل إذا كانت مفتوحة والضغطة خارجها وخارج زر الـ Hamburger نفسه
    if (this.mobileMenuOpen()) {
      const clickedInsideMobile = this.elementRef.nativeElement.querySelector('.mobile-menu')?.contains(event.target);
      const clickedHamburger = this.elementRef.nativeElement.querySelector('.hamburger')?.contains(event.target);
      if (!clickedInsideMobile && !clickedHamburger) {
        this.closeMobileMenu();
      }
    }
  }

  // مستمع لحدث الـ Scroll لتغيير شكل الـ Navbar عند النزول لأسفل
  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  private authStateListener = (): void => {
    this.isLoggedIn.set(!!localStorage.getItem('authToken'));
  };

  ngOnInit(): void {
    this.authStateListener();
    window.addEventListener('authStateChanged', this.authStateListener);
    
    // جلب أسعار المعادن والعملات الحقيقية عند تحميل الصفحة
    this.loadTickerPrices();
  }

  ngOnDestroy(): void {
    window.removeEventListener('authStateChanged', this.authStateListener);
  }

  // دالة جلب الأسعار من الخدمة (Service)
  loadTickerPrices(): void {
    this.tickerService.getLatestPrices().subscribe({
      next: (data) => this.tickerData.set(data),
      error: (err) => console.error('Error fetching ticker prices:', err)
    });
  }

  // التحكم في قائمة الموبايل
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) this.userMenuOpen.set(false);
  }
  closeMobileMenu(): void { this.mobileMenuOpen.set(false); }

  // التحكم في قائمة المستخدم
  toggleUserMenu(): void  { this.userMenuOpen.update(v => !v); }
  closeUserMenu(): void   { this.userMenuOpen.set(false); }

  // تغيير لغة التطبيق
  switchLanguage(lang: AppLocale): void {
    this.i18nService.setLanguage(lang);
    this.closeMobileMenu();
  }

  // تسجيل الخروج
  logout(): void {
    localStorage.clear();
    this.isLoggedIn.set(false);
    this.closeUserMenu();
    this.closeMobileMenu();
    window.dispatchEvent(new Event('authStateChanged'));
  }
}