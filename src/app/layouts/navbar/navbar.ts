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
export class Navbar {

  isLoggedIn     = signal<boolean>(false);
  cartCount      = signal<number>(0);
  mobileMenuOpen = signal<boolean>(false);
  userMenuOpen   = signal<boolean>(false);
  isScrolled     = signal<boolean>(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) this.userMenuOpen.set(false);
  }

  closeMobileMenu(): void { this.mobileMenuOpen.set(false); }

  toggleUserMenu(): void  { this.userMenuOpen.update(v => !v); }
  closeUserMenu(): void   { this.userMenuOpen.set(false); }

  logout(): void {
    this.isLoggedIn.set(false);
    this.closeUserMenu();
    this.closeMobileMenu();
  }
}