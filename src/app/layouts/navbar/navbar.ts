import { Component, signal, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { I18nService, AppLocale } from '../../core/services/i18n.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

  private readonly i18nService = inject(I18nService);

  readonly currentLang = this.i18nService.currentLang;
  readonly loadingTranslations = this.i18nService.loading;

  isLoggedIn     = signal<boolean>(false);
  cartCount      = signal<number>(0);
  mobileMenuOpen = signal<boolean>(false);
  userMenuOpen   = signal<boolean>(false);
  isScrolled     = signal<boolean>(false);

  private authStateListener = (): void => {
    this.isLoggedIn.set(!!localStorage.getItem('authToken'));
  };

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) this.userMenuOpen.set(false);
  }

  closeMobileMenu(): void { this.mobileMenuOpen.set(false); }

  ngOnInit(): void {
    this.authStateListener();
    window.addEventListener('authStateChanged', this.authStateListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('authStateChanged', this.authStateListener);
  }

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
  }
}