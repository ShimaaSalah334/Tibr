import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { IFavoriteItem } from '../../../../core/interfaces/ifavorite-item';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorite.html',
  styleUrl: './favorite.css',
})
export class Favorite implements OnInit {
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

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
        this.error.set('Unable to load your favorites right now.');
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
        this.error.set('Unable to update your favorites.');
      },
    });
  }
}
