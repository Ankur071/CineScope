import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

const RECENT_SEARCHES_KEY = 'cinescope_recent_searches';
const MAX_RECENT_SEARCHES = 5;


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar" [class.search-bar--focused]="isFocused()">
      <!-- Search Icon -->
      <svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>

      <!-- Input -->
      <input
        type="text"
        class="search-bar__input"
        [placeholder]="placeholder()"
        [(ngModel)]="searchQuery"
        (input)="onInput()"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown.enter)="onSearch()"
        (keydown.escape)="onClear()"
      />

      <!-- Clear Button -->
      @if (searchQuery) {
        <button 
          class="search-bar__clear"
          (click)="onClear()"
          aria-label="Clear search"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      }

      <!-- Recent Searches Dropdown -->
      @if (showRecentSearches() && recentSearches().length > 0) {
        <div class="search-bar__dropdown">
          <div class="search-bar__dropdown-header">
            <span>Recent Searches</span>
            <button (click)="clearRecentSearches()">Clear All</button>
          </div>
          @for (search of recentSearches(); track search) {
            <button 
              class="search-bar__dropdown-item"
              (mousedown)="selectRecentSearch(search)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
              {{ search }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 400px;
      background: var(--bg-surface);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      padding: var(--space-xs) var(--space-md);
      transition: all var(--transition-normal);

      &--focused {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-hue), 70%, 55%, 0.2);
      }
    }

    .search-bar__icon {
      width: 20px;
      height: 20px;
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .search-bar__input {
      flex: 1;
      background: none;
      border: none;
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--font-size-md);
      color: var(--text-primary);
      outline: none;

      &::placeholder {
        color: var(--text-muted);
      }
    }

    .search-bar__clear {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: var(--space-xxs);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: var(--glass-bg);
      }
    }

    .search-bar__dropdown {
      position: absolute;
      top: calc(100% + var(--space-xs));
      left: 0;
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-xs);
      z-index: var(--z-dropdown);
      animation: fadeInDown 0.2s ease;
    }

    .search-bar__dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--font-size-xs);
      color: var(--text-muted);

      button {
        background: none;
        border: none;
        color: var(--color-primary-light);
        cursor: pointer;
        font-size: var(--font-size-xs);

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .search-bar__dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      width: 100%;
      padding: var(--space-sm);
      background: none;
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--glass-bg);
        color: var(--text-primary);
      }

      svg {
        color: var(--text-muted);
      }
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  searchQuery = '';
  isFocused = signal(false);
  showRecentSearches = signal(false);
  recentSearches = signal<string[]>(this.loadRecentSearches());
  placeholder = signal('Search movies...');

  searchChanged = output<string>();
  searchSubmitted = output<string>();

  constructor() {
    // Setup debounce for real-time search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchChanged.emit(query);
    });
  }

  onInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.showRecentSearches.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    // Delay hiding to allow click on dropdown items
    setTimeout(() => {
      this.showRecentSearches.set(false);
    }, 200);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.addToRecentSearches(this.searchQuery.trim());
      this.searchSubmitted.emit(this.searchQuery.trim());
      this.showRecentSearches.set(false);
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery.trim() }
      });
    }
  }

  onClear(): void {
    this.searchQuery = '';
    this.searchChanged.emit('');
  }

  selectRecentSearch(search: string): void {
    this.searchQuery = search;
    this.onSearch();
  }

  clearRecentSearches(): void {
    this.recentSearches.set([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }

  private addToRecentSearches(query: string): void {
    const searches = this.recentSearches();
    const filtered = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    this.recentSearches.set(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }

  private loadRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
