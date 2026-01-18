import { Component, ChangeDetectionStrategy, input, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { MovieSearchResult } from '../../models';


@Component({
  selector: 'app-movie-carousel',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SkeletonLoaderComponent],
  template: `
    <section class="carousel">
      <!-- Header -->
      <div class="carousel__header">
        <h2 class="carousel__title">{{ title() }}</h2>
        
        <!-- Scroll Controls -->
        <div class="carousel__controls">
          <button 
            class="carousel__control"
            (click)="scroll('left')"
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button 
            class="carousel__control"
            (click)="scroll('right')"
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Carousel Track -->
      <div class="carousel__track" #carouselTrack>
        @if (loading()) {
          @for (i of skeletonCount; track i) {
            <app-skeleton-loader type="card" />
          }
        } @else {
          @for (movie of movies(); track movie.imdbID) {
            <div class="carousel__item">
              <app-movie-card 
                [movie]="movie"
                [showWatchlistButton]="true"
              />
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .carousel {
      margin-bottom: var(--space-xl);
    }

    .carousel__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-md);
      padding-right: var(--space-md);
    }

    .carousel__title {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-primary);

      &::before {
        content: '';
        width: 4px;
        height: 1.2em;
        background: #5865F2;
        border-radius: 2px;
      }
    }

    .carousel__controls {
      display: flex;
      gap: var(--space-xs);
    }

    .carousel__control {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      background: var(--bg-card);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-elevated);
        color: var(--text-primary);
        border-color: var(--color-primary);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .carousel__track {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-sm) 0;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }

      > * {
        flex-shrink: 0;
        scroll-snap-align: start;
      }
    }

    .carousel__item {
      width: var(--card-width);
      flex-shrink: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCarouselComponent {
  title = input.required<string>();
  movies = input<MovieSearchResult[]>([]);
  loading = input<boolean>(false);

  carouselTrack = viewChild<ElementRef<HTMLDivElement>>('carouselTrack');

  skeletonCount = Array.from({ length: 8 }, (_, i) => i + 1);

  scroll(direction: 'left' | 'right'): void {
    const track = this.carouselTrack()?.nativeElement;
    if (!track) return;

    const scrollAmount = track.clientWidth * 0.8;
    const newPosition = direction === 'left'
      ? track.scrollLeft - scrollAmount
      : track.scrollLeft + scrollAmount;

    track.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  }
}
