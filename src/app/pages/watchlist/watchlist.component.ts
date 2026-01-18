import { Component, ChangeDetectionStrategy, inject, computed, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent, FooterComponent } from '../../layout';
import { MovieListComponent, WatchlistStore } from '../../shared';
import { MovieSearchResult } from '../../shared/models';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, MovieListComponent],
  template: `
    <app-header />
    
    <main class="watchlist-page">
      <div class="watchlist-page__container">
        <!-- Header -->
        <div class="watchlist-page__header">
          <h1>My Watchlist</h1>
          <p class="watchlist-page__count">
            {{ watchlistCount() }} {{ watchlistCount() === 1 ? 'movie' : 'movies' }} saved
          </p>
        </div>

        @if (watchlistCount() === 0) {
          <!-- Empty State -->
          <div class="watchlist-page__empty">
            <div class="watchlist-page__empty-icon">🎬</div>
            <h2>Your watchlist is empty</h2>
            <p>Start exploring movies and add them to your watchlist!</p>
            <a routerLink="/home" class="btn-primary">Browse Movies</a>
          </div>
        } @else {
          <!-- Watchlist Grid -->
          <app-movie-list 
            [movies]="watchlistAsSearchResults()"
            [showWatchlistButton]="true"
          />

          <!-- Clear All Button -->
          <div class="watchlist-page__actions">
            <button class="btn-secondary" (click)="clearAll()">
              Clear Watchlist
            </button>
          </div>
        }
      </div>
    </main>

    <app-footer />
  `,
  styles: [`
    .watchlist-page {
      min-height: 100vh;
      padding-bottom: var(--space-3xl);
    }

    .watchlist-page__container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: calc(var(--header-height) + var(--space-xl)) var(--space-xl) var(--space-xl);
    }

    .watchlist-page__header {
      margin-bottom: var(--space-xl);
      text-align: center;

      h1 {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--space-xs);
      }
    }

    .watchlist-page__count {
      color: var(--text-secondary);
    }

    .watchlist-page__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl);
      text-align: center;
    }

    .watchlist-page__empty-icon {
      font-size: 5rem;
      margin-bottom: var(--space-lg);
    }

    .watchlist-page__empty h2 {
      margin-bottom: var(--space-sm);
    }

    .watchlist-page__empty p {
      color: var(--text-secondary);
      margin-bottom: var(--space-xl);
    }

    .watchlist-page__actions {
      display: flex;
      justify-content: center;
      margin-top: var(--space-xl);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistComponent implements OnInit {
  private watchlistStore = inject(WatchlistStore);
  private platformId = inject(PLATFORM_ID);

  watchlistCount = this.watchlistStore.count;

  // Convert watchlist to SearchResult format for MovieList
  watchlistAsSearchResults = computed<MovieSearchResult[]>(() => {
    return this.watchlistStore.watchlist().map(item => ({
      Title: item.title,
      Year: item.year,
      imdbID: item.imdbID,
      Type: 'movie',
      Poster: item.poster
    }));
  });

  ngOnInit(): void {
    // Hide initial loader immediately since watchlist data comes from local storage
    this.hideInitialLoader();
  }

  private hideInitialLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.querySelector('.app-loading') as HTMLElement;
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 300);
      }
    }
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear your watchlist?')) {
      this.watchlistStore.clearWatchlist();
    }
  }
}

