import { Component, signal } from '@angular/core';
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

  // ── State ─────────────────────────────────────────────────
  isLoggedIn    = signal<boolean>(false);   // replace with auth service
  cartCount     = signal<number>(0);        // replace with cart service
  mobileMenuOpen = signal<boolean>(false);
  userMenuOpen   = signal<boolean>(false);

  // ── Mobile menu ───────────────────────────────────────────
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) this.userMenuOpen.set(false);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  // ── User menu ─────────────────────────────────────────────
  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  // ── Auth ──────────────────────────────────────────────────
  logout(): void {
    this.isLoggedIn.set(false);
    this.closeUserMenu();
    this.closeMobileMenu();
    // TODO: call auth service logout + redirect
  }
}