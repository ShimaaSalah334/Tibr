import { Component, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

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

  logout(): void {
    localStorage.clear();
    this.isLoggedIn.set(false);
    this.closeUserMenu();
    this.closeMobileMenu();
    window.dispatchEvent(new Event('authStateChanged'));
  }
}