import { Component, signal, HostListener, OnInit, OnDestroy, inject, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  private readonly i18nService = inject(I18nService);
  private readonly elementRef = inject(ElementRef);
  private readonly tickerService = inject(TickerService);
  private readonly ngZone = inject(NgZone);
  readonly currentLang = this.i18nService.currentLang;
  readonly loadingTranslations = this.i18nService.loading;

  router = inject(Router);

  isLoggedIn     = signal<boolean>(false);
  cartCount      = signal<number>(0);
  mobileMenuOpen = signal<boolean>(false);
  userMenuOpen   = signal<boolean>(false);
  isScrolled     = signal<boolean>(false);
  
  tickerData     = signal<TickerItem[]>([]);

  private scrollListener?: () => void;

  // مستمع لحدث الضغط للشاشة - تم تبسيطه لأن الجوال أصبح يعتمد على الـ Backdrop الآن
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.userMenuOpen()) {
      const clickedInsideUser = this.elementRef.nativeElement.querySelector('.user-menu')?.contains(event.target);
      if (!clickedInsideUser) {
        this.closeUserMenu();
      }
    }
  }

  private authStateListener = (): void => {
    this.isLoggedIn.set(!!localStorage.getItem('authToken'));
  };

  ngOnInit(): void {
    this.authStateListener();
    window.addEventListener('authStateChanged', this.authStateListener);
    this.loadTickerPrices();

    // تشغيل مستمع الـ Scroll خارج الـ Angular Zone لتحسين الأداء بنسبة كبيرة
    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        const shouldScroll = window.scrollY > 50;
        // لا نقوم بالتحديث إلا إذا تغيرت الحالة الفعلية لمنع الـ Change Detection غير الضروري
        if (this.isScrolled() !== shouldScroll) {
          this.ngZone.run(() => {
            this.isScrolled.set(shouldScroll);
          });
        }
      };
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('authStateChanged', this.authStateListener);
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  loadTickerPrices(): void {
    this.tickerService.getLatestPrices().subscribe({
      next: (data) => this.tickerData.set(data),
      error: (err) => console.error('Error fetching ticker prices:', err)
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) this.userMenuOpen.set(false);
  }
  closeMobileMenu(): void { this.mobileMenuOpen.set(false); }

  toggleUserMenu(): void  { this.userMenuOpen.update(v => !v); }
  closeUserMenu(): void   { this.userMenuOpen.set(false); }

  switchLanguage(lang: AppLocale): void {
    this.i18nService.setLanguage(lang);
    this.closeMobileMenu();
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn.set(false);
    this.closeUserMenu();
    this.closeMobileMenu();
    window.dispatchEvent(new Event('authStateChanged'));
    this.router.navigate(['/login']); 
  }
}