import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { MovieSearchResult } from '../../models';


@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="movie-list">
      @if (loading()) {
        <!-- Skeleton Loading State -->
        <div class="movie-list__grid">
          @for (i of skeletonCount; track i) {
            <app-skeleton-loader type="card" class="stagger-{{ i }}" />
          }
        </div>
      } @else if (movies().length === 0) {
        <!-- Empty State -->
        <div class="movie-list__empty">
          <div class="movie-list__empty-icon">🎬</div>
          <p class="movie-list__empty-text">{{ emptyMessage() }}</p>
        </div>
      } @else {
        <!-- Movie Grid -->
        <div class="movie-list__grid">
          @for (movie of movies(); track movie.imdbID; let i = $index) {
            <div class="movie-list__item">
              <app-movie-card 
                [movie]="movie"
                [showWatchlistButton]="showWatchlistButton()"
                class="animate-fade-in-up stagger-{{ (i % 10) + 1 }}"
              />
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .movie-list__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, var(--card-width));
      gap: var(--space-lg);
      justify-content: center;
    }

    .movie-list__item {
      width: var(--card-width);
    }

    .movie-list__item app-movie-card {
      display: block;
      width: 100%;
    }

    .movie-list__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl);
      text-align: center;
    }

    .movie-list__empty-icon {
      font-size: 4rem;
      margin-bottom: var(--space-md);
      opacity: 0.5;
    }

    .movie-list__empty-text {
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
      max-width: 300px;
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.4s ease forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @for $i from 1 through 10 {
      .stagger-#{$i} {
        animation-delay: #{$i * 50}ms;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  movies = input<MovieSearchResult[]>([]);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No movies found');
  showWatchlistButton = input<boolean>(true);

  // Number of skeleton cards to show while loading
  skeletonCount = Array.from({ length: 10 }, (_, i) => i + 1);
}
