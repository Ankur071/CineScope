import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { HeaderComponent, FooterComponent } from '../../layout';
import { MovieListComponent, SearchBarComponent, OmdbService } from '../../shared';
import { MovieSearchResult } from '../../shared/models';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MovieListComponent, SearchBarComponent],
  template: `
    <app-header />
    
    <main class="search-page">
      <div class="search-page__container">
        <!-- Search Header -->
        <div class="search-page__header">
          <h1>Search Movies</h1>
          <div class="search-page__bar">
            <app-search-bar 
              (searchChanged)="onSearchChange($event)"
            />
          </div>
        </div>

        <!-- Search Info -->
        @if (query()) {
          <div class="search-page__info">
            <p>
              @if (totalResults() > 0) {
                Showing {{ movies().length }} of {{ totalResults() }} results for 
                <strong>"{{ query() }}"</strong>
              } @else if (!loading()) {
                No results found for <strong>"{{ query() }}"</strong>
              }
            </p>
          </div>
        }

        <!-- Results -->
        <app-movie-list 
          [movies]="movies()"
          [loading]="loading()"
          [emptyMessage]="query() ? 'No movies found for your search' : 'Start typing to search for movies'"
        />

        <!-- Pagination -->
        @if (totalPages() > 1 && movies().length > 0) {
          <div class="search-page__pagination">
            <button 
              class="btn-secondary"
              [disabled]="currentPage() <= 1"
              (click)="changePage(currentPage() - 1)"
            >
              Previous
            </button>
            <span class="search-page__page-info">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>
            <button 
              class="btn-secondary"
              [disabled]="currentPage() >= totalPages()"
              (click)="changePage(currentPage() + 1)"
            >
              Next
            </button>
          </div>
        }
      </div>
    </main>

    <app-footer />
  `,
  styles: [`
    .search-page {
      min-height: 100vh;
      padding-bottom: var(--space-3xl);
    }

    .search-page__container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: calc(var(--header-height) + var(--space-xl)) var(--space-xl) var(--space-xl);
    }

    .search-page__header {
      margin-bottom: var(--space-xl);
      text-align: center;

      h1 {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--space-lg);
      }
    }

    .search-page__bar {
      display: flex;
      justify-content: center;

      app-search-bar {
        width: 100%;
        max-width: 500px;
      }
    }

    .search-page__info {
      margin-bottom: var(--space-lg);
      text-align: center;
      color: var(--text-secondary);

      strong {
        color: var(--color-primary-light);
      }
    }

    .search-page__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      margin-top: var(--space-xl);
    }

    .search-page__page-info {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private omdbService = inject(OmdbService);
  private platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  loading = signal(false);
  movies = signal<MovieSearchResult[]>([]);
  query = signal('');
  currentPage = signal(1);
  totalResults = signal(0);
  totalPages = signal(0);

  ngOnInit(): void {
    // Subscribe to search subject with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.query.set(query);
      this.currentPage.set(1);
      if (query.trim()) {
        this.search(query, 1);
        // Update URL
        this.router.navigate([], {
          queryParams: { q: query, page: 1 },
          queryParamsHandling: 'merge'
        });
      } else {
        this.movies.set([]);
        this.totalResults.set(0);
      }
    });

    // Check for initial query params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const q = params['q'];
      const page = parseInt(params['page']) || 1;

      if (q && q !== this.query()) {
        this.query.set(q);
        this.currentPage.set(page);
        this.search(q, page);
      } else {
        // No search query, just hide the initial loader
        this.hideInitialLoader();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);
    this.search(this.query(), page);

    // Update URL
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private search(query: string, page: number): void {
    this.loading.set(true);

    // OMDb returns 10 results per page. To show 12, we fetch 2 API pages.
    // Our page 1 = API pages 1,2 (results 1-12)
    // Our page 2 = API pages 3,4 (results 21-32)
    const apiPage1 = (page - 1) * 2 + 1;
    const apiPage2 = apiPage1 + 1;

    // Fetch first page
    this.omdbService.searchMovies(query, apiPage1).subscribe({
      next: (response1) => {
        if (response1.Response === 'True') {
          const totalApiResults = parseInt(response1.totalResults);
          const firstPageResults = response1.Search;

          // Check if we need more results
          if (firstPageResults.length === 10 && totalApiResults > apiPage1 * 10) {
            // Fetch second page
            this.omdbService.searchMovies(query, apiPage2).subscribe({
              next: (response2) => {
                const secondPageResults = response2.Response === 'True' ? response2.Search : [];
                const combined = [...firstPageResults, ...secondPageResults].slice(0, 12);

                this.movies.set(combined);
                this.totalResults.set(totalApiResults);
                this.totalPages.set(Math.ceil(totalApiResults / 12));
                this.loading.set(false);
                this.hideInitialLoader();
              },
              error: () => {
                // Use first page results if second fails
                this.movies.set(firstPageResults.slice(0, 12));
                this.totalResults.set(totalApiResults);
                this.totalPages.set(Math.ceil(totalApiResults / 12));
                this.loading.set(false);
                this.hideInitialLoader();
              }
            });
          } else {
            // Not enough for second page, use what we have
            this.movies.set(firstPageResults);
            this.totalResults.set(totalApiResults);
            this.totalPages.set(Math.ceil(totalApiResults / 12));
            this.loading.set(false);
            this.hideInitialLoader();
          }
        } else {
          this.movies.set([]);
          this.totalResults.set(0);
          this.totalPages.set(0);
          this.loading.set(false);
          this.hideInitialLoader();
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.movies.set([]);
        this.loading.set(false);
        this.hideInitialLoader();
      }
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
}
