import { Component, ChangeDetectionStrategy, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HeaderComponent, FooterComponent } from '../../layout';
import { MovieCarouselComponent, OmdbService } from '../../shared';
import { MovieSearchResult } from '../../shared/models';

interface CategoryData {
  title: string;
  keyword: string;
  movies: MovieSearchResult[];
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, MovieCarouselComponent],
  template: `
    <app-header />
    
    @if (loading()) {
      <!-- Loading spinner for in-app navigation -->
      <div class="page-loading">
        <div class="page-loading__spinner"></div>
      </div>
    } @else {
      <main class="home">
        <!-- Hero Section -->
        @if (featuredMovie()) {
          <section class="hero">
            <div class="hero__background">
              <img [src]="featuredMovie()!.Poster" [alt]="" class="hero__bg-image" />
              <div class="hero__overlay"></div>
            </div>
            <div class="hero__container">
              <div class="hero__poster">
                <img [src]="featuredMovie()!.Poster" [alt]="featuredMovie()!.Title" />
                <div class="hero__poster-glow"></div>
              </div>
              <div class="hero__content">
                <span class="hero__badge">Featured</span>
                <h1 class="hero__title">{{ featuredMovie()!.Title }}</h1>
                <p class="hero__year">{{ featuredMovie()!.Year }}</p>
                <div class="hero__actions">
                  <a [routerLink]="['/movie', featuredMovie()!.imdbID]" class="hero__btn hero__btn--primary">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </section>
        }

        <!-- Category Carousels -->
        <div class="home__categories">
          @for (category of categories(); track category.keyword) {
            <app-movie-carousel 
              [title]="category.title"
              [movies]="category.movies"
              [loading]="false"
            />
          }
        </div>
      </main>

      <app-footer />
    }
  `,
  styles: [`
    .page-loading {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
      z-index: 100;
    }

    .page-loading__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-lg);
    }

    .page-loading__spinner {
      width: 48px;
      height: 48px;
      border: 3px solid transparent;
      border-top-color: #5865F2;
      border-right-color: #4752C4;
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
    }

    .page-loading__text {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .home {
      min-height: 100vh;
      padding-bottom: var(--space-3xl);
    }

    .hero {
      position: relative;
      padding: calc(var(--header-height) + var(--space-xl)) var(--space-xl) var(--space-xl);
      margin-bottom: var(--space-lg);
      overflow: hidden;
    }

    .hero__background {
      position: absolute;
      inset: 0;
      z-index: -2;
    }

    .hero__bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      filter: blur(30px) saturate(1.2);
      transform: scale(1.1);
    }

    .hero__overlay {
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(to bottom, transparent 60%, #0f0f1a 100%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 10, 40, 0.7) 50%, rgba(0, 0, 0, 0.85) 100%);
    }

    .hero__container {
      display: flex;
      align-items: center;
      gap: var(--space-3xl);
      max-width: var(--container-max);
      margin: 0 auto;
      flex-wrap: wrap;
    }

    .hero__content {
      flex: 1;
      min-width: 280px;
      animation: fadeInUp 0.8s ease;
    }

    .hero__poster {
      position: relative;
      flex-shrink: 0;
      width: 280px;
      z-index: 1;
      animation: fadeInLeft 0.8s ease;
    }

    .hero__poster img {
      width: 100%;
      height: auto;
      border-radius: var(--radius-lg);
      box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease;
    }

    .hero__poster:hover img {
      transform: scale(1.02);
    }

    .hero__poster-glow {
      position: absolute;
      inset: -20px;
      background: linear-gradient(135deg, rgba(88, 101, 242, 0.3), rgba(71, 82, 196, 0.2));
      filter: blur(40px);
      z-index: -1;
      border-radius: var(--radius-xl);
    }
    .hero__badge {
      display: inline-block;
      padding: var(--space-xs) var(--space-md);
      background: linear-gradient(135deg, #5865F2, #4752C4);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--space-md);
    }

    .hero__title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      margin-bottom: var(--space-xs);
      line-height: 1.1;
    }

    .hero__year {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin-bottom: var(--space-xl);
    }

    .hero__actions {
      display: flex;
      gap: var(--space-md);
    }

    .hero__btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-md) var(--space-xl);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-md);
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .hero__btn--primary {
      background: linear-gradient(135deg, #5865F2, #4752C4);
      color: white;
      box-shadow: 0 4px 20px rgba(88, 101, 242, 0.4);
    }

    .hero__btn--primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(88, 101, 242, 0.5);
    }

    .home__categories {
      padding: 0 var(--space-xl);
      max-width: var(--container-max);
      margin: 0 auto;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 1100px) {
      .hero {
        min-height: auto;
        padding: calc(var(--header-height) + var(--space-lg)) var(--space-lg) var(--space-xl);
        margin-bottom: var(--space-lg);
      }

      .hero__container {
        flex-direction: column;
        text-align: center;
        gap: var(--space-xl);
      }

      .hero__poster {
        width: 220px;
        margin: 0 auto;
      }

      .hero__title {
        font-size: var(--font-size-3xl);
      }

      .hero__actions {
        justify-content: center;
      }
    }

    @media (max-width: 900px) {
      .hero__container {
        flex-direction: column;
        text-align: center;
        gap: var(--space-xl);
      }

      .hero__poster {
        width: 200px;
        margin: 0 auto;
      }

      .hero__title {
        font-size: var(--font-size-2xl);
      }

      .hero__actions {
        justify-content: center;
      }
    }

    @media (max-width: 600px) {
      .hero {
        padding: calc(var(--header-height) + var(--space-md)) var(--space-md) var(--space-lg);
        margin-bottom: var(--space-md);
      }

      .hero__poster {
        width: 160px;
      }

      .hero__title {
        font-size: var(--font-size-xl);
      }

      .home__categories {
        padding: 0 var(--space-md);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private omdbService = inject(OmdbService);
  private platformId = inject(PLATFORM_ID);

  loading = signal(true);
  featuredMovie = signal<MovieSearchResult | null>(null);
  categories = signal<CategoryData[]>([
    { title: 'Action Movies', keyword: 'action', movies: [] },
    { title: 'Comedy Movies', keyword: 'comedy', movies: [] },
    { title: 'Drama Movies', keyword: 'drama', movies: [] },
    { title: 'Thriller Movies', keyword: 'thriller', movies: [] }
  ]);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    const categoryKeywords = ['action', 'comedy', 'drama', 'thriller'];

    const requests = categoryKeywords.map(keyword =>
      this.omdbService.getMoviesByCategory(keyword)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const updatedCategories = this.categories().map((cat, index) => ({
          ...cat,
          movies: results[index] || []
        }));

        this.categories.set(updatedCategories);

        // Set featured movie from first category
        if (results[0] && results[0].length > 0) {
          // Pick a random movie from action for featured
          const randomIndex = Math.floor(Math.random() * Math.min(5, results[0].length));
          this.featuredMovie.set(results[0][randomIndex]);
        }

        this.loading.set(false);
        this.hideInitialLoader();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      }
    });
  }

  private hideInitialLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.querySelector('.app-loading') as HTMLElement;
      if (loader) {
        loader.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => loader.remove(), 300);
      }
    }
  }
}
