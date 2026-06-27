import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { IFavoriteItem } from '../../../../core/interfaces/ifavorite-item';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './favorite.html',
  styleUrl: './favorite.css',
})
export class Favorite implements OnInit {
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  favorites = signal<IFavoriteItem[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.favoriteService.getMyFavorites().subscribe({
      next: (items) => {
        this.favorites.set(items || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load favorites', err);
        this.error.set(this.i18n.translate('favorite.error.load'));
        this.isLoading.set(false);
      },
    });
  }

  onViewDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onToggleFavorite(productId: number): void {
    this.favoriteService.toggleFavorite(productId).subscribe({
      next: () => this.loadFavorites(),
      error: (err) => {
        console.error('Failed to update favorite', err);
        this.error.set(this.i18n.translate('favorite.error.update'));
      },
    });
  }
}
