import { Component, ChangeDetectionStrategy, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HeaderComponent, FooterComponent } from '../../layout';
import { SkeletonLoaderComponent, RuntimePipe, RatingPipe, OmdbService, WatchlistStore } from '../../shared';
import { MovieDetails } from '../../shared/models';


@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, SkeletonLoaderComponent, RuntimePipe, RatingPipe],
  template: `
    <app-header />
    
    <main class="details">
      @if (loading()) {
        <!-- Loading State -->
        <div class="details__loading">
          <app-skeleton-loader type="detail" width="100%" height="400px" />
          <div class="details__loading-info">
            <app-skeleton-loader type="text" width="60%" height="2rem" />
            <app-skeleton-loader type="text" width="40%" height="1rem" />
            <app-skeleton-loader type="text" width="100%" height="6rem" />
          </div>
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="details__error">
          <div class="details__error-icon">😕</div>
          <h2>Movie Not Found</h2>
          <p>{{ error() }}</p>
          <a routerLink="/home" class="btn-primary">Back to Home</a>
        </div>
      } @else if (movie()) {
        <!-- Movie Content -->
        <article class="details__content">
          <!-- Breadcrumb -->
          <nav class="details__breadcrumb">
            <a routerLink="/home">Home</a>
            <span>/</span>
            <span>{{ movie()!.Title }}</span>
          </nav>

          <!-- Hero Section -->
          <div class="details__hero">
            <div class="details__poster">
              <img 
                [src]="movie()!.Poster !== 'N/A' ? movie()!.Poster : 'assets/images/no-poster.svg'" 
                [alt]="movie()!.Title"
                (error)="onImageError($event)"
              />
            </div>
            
            <div class="details__info">
              <h1 class="details__title">{{ movie()!.Title }}</h1>
              
              <div class="details__meta">
                <span class="details__year">{{ movie()!.Year }}</span>
                <span class="details__rated">{{ movie()!.Rated }}</span>
                <span class="details__runtime">{{ movie()!.Runtime | runtime }}</span>
              </div>

              <!-- Rating -->
              <div class="details__rating">
                <span class="details__rating-stars">{{ movie()!.imdbRating | rating }}</span>
                <span class="details__rating-votes">{{ movie()!.imdbVotes }} votes</span>
              </div>

              <!-- Genres -->
              <div class="details__genres">
                @for (genre of getGenres(); track genre) {
                  <span class="details__genre">{{ genre }}</span>
                }
              </div>

              <!-- Plot -->
              <p class="details__plot">{{ movie()!.Plot }}</p>

              <!-- Cast & Crew -->
              <div class="details__crew">
                <div class="details__crew-item">
                  <label>Director</label>
                  <span>{{ movie()!.Director }}</span>
                </div>
                <div class="details__crew-item">
                  <label>Writers</label>
                  <span>{{ movie()!.Writer }}</span>
                </div>
                <div class="details__crew-item">
                  <label>Stars</label>
                  <span>{{ movie()!.Actors }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="details__actions">
                <button 
                  class="btn-primary"
                  [class.btn-primary--active]="isInWatchlist()"
                  (click)="toggleWatchlist()"
                >
                  @if (isInWatchlist()) {
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    In Watchlist
                  } @else {
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Add to Watchlist
                  }
                </button>
                
                <button class="btn-secondary" (click)="shareMovie()">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="details__additional">
            <div class="details__info-grid">
              <div class="details__info-item">
                <label>Language</label>
                <span>{{ movie()!.Language }}</span>
              </div>
              <div class="details__info-item">
                <label>Country</label>
                <span>{{ movie()!.Country }}</span>
              </div>
              <div class="details__info-item">
                <label>Released</label>
                <span>{{ movie()!.Released }}</span>
              </div>
              @if (movie()!.BoxOffice && movie()!.BoxOffice !== 'N/A') {
                <div class="details__info-item">
                  <label>Box Office</label>
                  <span>{{ movie()!.BoxOffice }}</span>
                </div>
              }
            </div>
          </div>
        </article>
      }
    </main>

    <app-footer />
  `,
  styles: [`
    .details {
      min-height: 100vh;
      padding-bottom: var(--space-3xl);
    }

    .details__loading,
    .details__error {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: var(--space-xl);
    }

    .details__loading-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-top: var(--space-xl);
    }

    .details__error {
      text-align: center;
      padding: var(--space-3xl);
    }

    .details__error-icon {
      font-size: 4rem;
      margin-bottom: var(--space-md);
    }

    .details__error h2 {
      margin-bottom: var(--space-sm);
    }

    .details__error p {
      margin-bottom: var(--space-xl);
    }

    .details__content {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: calc(var(--header-height) + var(--space-xl)) var(--space-xl) var(--space-xl);
      animation: fadeIn 0.5s ease;
    }

    .details__breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      margin-bottom: var(--space-lg);
      font-size: var(--font-size-sm);
      color: var(--text-muted);

      a {
        color: var(--text-secondary);
        text-decoration: none;

        &:hover {
          color: var(--color-primary-light);
        }
      }
    }

    .details__hero {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: var(--space-xl);
      margin-bottom: var(--space-xl);

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .details__poster {
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);

      img {
        width: 100%;
        height: auto;
        display: block;
      }

      @media (max-width: 768px) {
        max-width: 250px;
        margin: 0 auto;
      }
    }

    .details__info {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .details__title {
      font-size: var(--font-size-4xl);
      font-weight: 700;
      line-height: 1.1;
    }

    .details__meta {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      flex-wrap: wrap;

      @media (max-width: 768px) {
        justify-content: center;
      }
    }

    .details__year {
      color: var(--text-secondary);
    }

    .details__rated {
      padding: var(--space-xxs) var(--space-xs);
      border: 1px solid var(--text-muted);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .details__runtime {
      color: var(--text-secondary);
    }

    .details__rating {
      display: flex;
      align-items: center;
      gap: var(--space-sm);

      @media (max-width: 768px) {
        justify-content: center;
      }
    }

    .details__rating-stars {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--color-warning);
    }

    .details__rating-votes {
      color: var(--text-muted);
      font-size: var(--font-size-sm);
    }

    .details__genres {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);

      @media (max-width: 768px) {
        justify-content: center;
      }
    }

    .details__genre {
      padding: var(--space-xxs) var(--space-sm);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .details__plot {
      font-size: var(--font-size-md);
      line-height: 1.7;
      color: var(--text-secondary);
    }

    .details__crew {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .details__crew-item {
      display: flex;
      gap: var(--space-md);

      label {
        min-width: 80px;
        font-weight: 500;
        color: var(--text-muted);
      }

      span {
        color: var(--text-secondary);
      }

      @media (max-width: 768px) {
        flex-direction: column;
        gap: var(--space-xxs);
        text-align: center;
      }
    }

    .details__awards {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
      border: 1px solid rgba(255, 215, 0, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-warning);
      font-size: var(--font-size-sm);

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .details__awards-icon {
      font-size: 1.5rem;
    }

    .details__actions {
      display: flex;
      gap: var(--space-md);
      margin-top: var(--space-md);

      button {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
      }

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .details__additional {
      padding-top: var(--space-xl);
      border-top: 1px solid var(--glass-border);
    }

    .details__info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
    }

    .details__info-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xxs);

      label {
        font-size: var(--font-size-sm);
        color: var(--text-muted);
      }

      span {
        color: var(--text-secondary);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private omdbService = inject(OmdbService);
  private watchlistStore = inject(WatchlistStore);
  private platformId = inject(PLATFORM_ID);

  loading = signal(true);
  movie = signal<MovieDetails | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Check for resolved data first (from route resolver)
    const resolvedMovie = this.route.snapshot.data['movie'];

    if (resolvedMovie && resolvedMovie.Response === 'True') {
      this.movie.set(resolvedMovie);
      this.loading.set(false);
      this.hideInitialLoader();
      return;
    }

    // Fallback: fetch data if resolver didn't provide it
    this.route.paramMap.pipe(
      switchMap(params => {
        const imdbId = params.get('imdbId');
        if (!imdbId) {
          this.error.set('Invalid movie ID');
          this.loading.set(false);
          this.hideInitialLoader();
          return of(null);
        }
        return this.omdbService.getMovieById(imdbId);
      }),
      catchError(err => {
        this.error.set(err.message || 'Failed to load movie details');
        this.loading.set(false);
        this.hideInitialLoader();
        return of(null);
      })
    ).subscribe(movie => {
      if (movie && movie.Response === 'True') {
        this.movie.set(movie);
      } else if (movie) {
        this.error.set(movie.Error || 'Movie not found');
      }
      this.loading.set(false);
      this.hideInitialLoader();
    });
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

  getGenres(): string[] {
    const genres = this.movie()?.Genre;
    if (!genres || genres === 'N/A') return [];
    return genres.split(',').map(g => g.trim());
  }

  isInWatchlist(): boolean {
    const movie = this.movie();
    return movie ? this.watchlistStore.isInWatchlist(movie.imdbID) : false;
  }

  toggleWatchlist(): void {
    const movie = this.movie();
    if (!movie) return;

    this.watchlistStore.toggleWatchlist({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      rating: movie.imdbRating,
      genre: movie.Genre,
      runtime: movie.Runtime
    });
  }

  async shareMovie(): Promise<void> {
    const movie = this.movie();
    if (!movie) return;

    const shareData = {
      title: movie.Title,
      text: `Check out ${movie.Title} (${movie.Year}) on CineScope!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
        console.log('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-poster.svg';
  }
}
