import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieSearchResult } from '../../models';
import { LazyImageDirective } from '../../directives';
import { RatingPipe } from '../../pipes';
import { WatchlistStore } from '../../state';


@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LazyImageDirective, RatingPipe],
  template: `
    <article class="movie-card" [routerLink]="['/movie', movie().imdbID]">
      <!-- Poster Image -->
      <div class="movie-card__poster">
        <img 
          [appLazyImage]="movie().Poster"
          [alt]="movie().Title"
          class="movie-card__image"
        />
        
        <!-- Overlay on hover -->
        <div class="movie-card__overlay">
          <span class="movie-card__view">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <polygon points="8,5 19,12 8,19"/>
            </svg>
            View Details
          </span>
        </div>
      </div>

      <!-- Movie Info -->
      <div class="movie-card__info">
        <h3 class="movie-card__title">{{ movie().Title }}</h3>
        <div class="movie-card__meta">
          <span class="movie-card__year">{{ movie().Year }}</span>
          @if (showRating() && rating()) {
            <span class="movie-card__rating">{{ rating() | rating }}</span>
          }
        </div>
      </div>

      <!-- Watchlist Button -->
      @if (showWatchlistButton()) {
        <button 
          class="movie-card__watchlist"
          [class.movie-card__watchlist--active]="isInWatchlist()"
          (click)="onWatchlistClick($event)"
          [attr.aria-label]="isInWatchlist() ? 'Remove from watchlist' : 'Add to watchlist'"
          [title]="isInWatchlist() ? 'Remove from Watchlist' : 'Add to Watchlist'"
        >
          @if (isInWatchlist()) {
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          }
        </button>
      }
    </article>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .movie-card {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .movie-card__poster {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 150%;
      border-radius: 8px;
      overflow: hidden;
      background: #1a1a2e;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .movie-card:hover .movie-card__poster {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    .movie-card__image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .movie-card__overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .movie-card:hover .movie-card__overlay {
      opacity: 1;
    }

    .movie-card__view {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: #5865F2;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: white;

      svg {
        width: 12px;
        height: 12px;
      }
    }

    .movie-card__info {
      padding: 12px 2px 0;
    }

    .movie-card__title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .movie-card__meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .movie-card__rating {
      color: #fbbf24;
    }

    .movie-card__watchlist {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      border: none;
      cursor: pointer;
      color: white;
      opacity: 0;
      transition: opacity 0.2s ease, background 0.2s ease;
      z-index: 10;

      &:hover {
        background: #5865F2;
      }
    }

    .movie-card:hover .movie-card__watchlist {
      opacity: 1;
    }

    .movie-card__watchlist--active {
      opacity: 1;
      background: #5865F2;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  private watchlistStore = inject(WatchlistStore);

  movie = input.required<MovieSearchResult>();
  showRating = input<boolean>(false);
  showWatchlistButton = input<boolean>(true);
  rating = input<string>('');

  watchlistToggled = output<MovieSearchResult>();

  isInWatchlist(): boolean {
    return this.watchlistStore.isInWatchlist(this.movie().imdbID);
  }

  onWatchlistClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const movie = this.movie();
    this.watchlistStore.toggleWatchlist({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster
    });

    this.watchlistToggled.emit(movie);
  }
}
