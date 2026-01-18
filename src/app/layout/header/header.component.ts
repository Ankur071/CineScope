import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WatchlistStore } from '../../shared';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header__container">
        <!-- Logo -->
        <a routerLink="/home" class="header__logo">
          <svg class="header__logo-icon" viewBox="0 0 24 24" fill="none" width="32" height="32">
            <circle cx="12" cy="12" r="10" stroke="#5865F2" stroke-width="2" fill="none"/>
            <polygon points="10,8 16,12 10,16" fill="#5865F2"/>
          </svg>
          <div class="header__logo-content">
            <span class="header__logo-text">CineScope</span>
            <span class="header__logo-tagline">Discover Movies</span>
          </div>
        </a>

        <!-- Spacer -->
        <div class="header__spacer"></div>

        <!-- Right Side: Nav + Actions -->
        <div class="header__right">
          <!-- Navigation Links -->
          <nav class="header__nav">
            <!-- Home -->
            <a 
              routerLink="/home" 
              routerLinkActive="header__nav-link--active"
              class="header__nav-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Home</span>
            </a>

            <!-- Genre Dropdown -->
            <div class="header__dropdown" (mouseenter)="showGenreMenu.set(true)" (mouseleave)="showGenreMenu.set(false)">
              <button class="header__nav-link header__dropdown-trigger">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
                </svg>
                <span>Genre</span>
                <svg class="header__dropdown-arrow" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              
              @if (showGenreMenu()) {
                <div class="header__dropdown-menu">
                  <a routerLink="/genre/action" class="header__dropdown-item" (click)="showGenreMenu.set(false)">Action</a>
                  <a routerLink="/genre/comedy" class="header__dropdown-item" (click)="showGenreMenu.set(false)">Comedy</a>
                  <a routerLink="/genre/drama" class="header__dropdown-item" (click)="showGenreMenu.set(false)">Drama</a>
                  <a routerLink="/genre/thriller" class="header__dropdown-item" (click)="showGenreMenu.set(false)">Thriller</a>
                </div>
              }
            </div>
          </nav>

          <!-- Actions -->
          <div class="header__actions">
            <!-- Search Icon -->
            <button class="header__icon-btn" (click)="toggleSearchModal()" title="Search">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>

            <!-- Watchlist -->
            <a routerLink="/watchlist" class="header__icon-btn" title="My Watchlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              @if (watchlistCount() > 0) {
                <span class="header__badge">{{ watchlistCount() }}</span>
              }
            </a>

            <!-- Profile Dropdown -->
            <div class="header__dropdown" (mouseenter)="showProfileMenu.set(true)" (mouseleave)="showProfileMenu.set(false)">
              <button class="header__icon-btn header__profile-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
              
              @if (showProfileMenu()) {
                <div class="header__dropdown-menu header__dropdown-menu--right">
                  <div class="header__profile-header">
                    <div class="header__profile-avatar">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <span>User</span>
                  </div>
                  <div class="header__dropdown-divider"></div>
                  <button class="header__dropdown-item" (click)="showProfileMenu.set(false)">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                    </svg>
                    Sign In
                  </button>
                  <button class="header__dropdown-item" (click)="showProfileMenu.set(false)">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    Sign Up
                  </button>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          class="header__menu-toggle"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="isMobileMenuOpen()"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            @if (isMobileMenuOpen()) {
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            } @else {
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            }
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      @if (isMobileMenuOpen()) {
        <nav class="header__mobile-nav">
          <a routerLink="/home" class="header__mobile-link" (click)="closeMobileMenu()">Home</a>
          <a routerLink="/genre/action" class="header__mobile-link" (click)="closeMobileMenu()">Action</a>
          <a routerLink="/genre/comedy" class="header__mobile-link" (click)="closeMobileMenu()">Comedy</a>
          <a routerLink="/genre/drama" class="header__mobile-link" (click)="closeMobileMenu()">Drama</a>
          <a routerLink="/genre/thriller" class="header__mobile-link" (click)="closeMobileMenu()">Thriller</a>
          <a routerLink="/watchlist" class="header__mobile-link" (click)="closeMobileMenu()">
            Watchlist ({{ watchlistCount() }})
          </a>
        </nav>
      }

      <!-- Search Modal -->
      @if (isSearchOpen()) {
        <div class="search-modal" (click)="closeSearchModal()">
          <div class="search-modal__content" (click)="$event.stopPropagation()">
            <div class="search-modal__header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input 
                type="text" 
                class="search-modal__input"
                placeholder="Search movies, TV shows..."
                [(ngModel)]="searchQuery"
                (keyup.enter)="performSearch()"
                #searchInput
              />
              <button class="search-modal__close" (click)="closeSearchModal()">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div class="search-modal__hints">
              <span class="search-modal__hint">Press Enter to search</span>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-sticky);
      background: transparent;
    }

    .header__container {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      max-width: var(--container-max);
      margin: 0 auto;
      padding: var(--space-sm) var(--space-lg);
      height: var(--header-height);
    }

    .header__logo {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 700;
      font-size: var(--font-size-xl);
      white-space: nowrap;
    }

    .header__logo-icon {
      flex-shrink: 0;
    }

    .header__logo-content {
      display: flex;
      flex-direction: column;
      line-height: 1.1;

      @media (max-width: 576px) {
        display: none;
      }
    }

    .header__logo-text {
      color: white;
      font-weight: 600;
      font-size: var(--font-size-lg);
      letter-spacing: -0.5px;
    }

    .header__logo-tagline {
      color: var(--text-muted);
      font-size: 10px;
      font-weight: 400;
      letter-spacing: 0.5px;
    }

    .header__spacer {
      flex: 1;
    }

    .header__right {
      display: none;
      align-items: center;
      gap: var(--space-xs);

      @media (min-width: 768px) {
        display: flex;
      }
    }

    .header__nav {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .header__nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: var(--font-size-sm);
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.1);
      }

      &--active {
        color: white;
        background: rgba(88, 101, 242, 0.2);
      }
    }

    .header__dropdown {
      position: relative;
    }

    .header__dropdown-trigger {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .header__dropdown-arrow {
      transition: transform var(--transition-fast);
    }

    .header__dropdown:hover .header__dropdown-arrow {
      transform: rotate(180deg);
    }

    .header__dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 180px;
      padding: var(--space-xs);
      background: rgba(20, 20, 30, 0.98);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-lg);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      animation: fadeInDown 0.2s ease;

      &--right {
        left: auto;
        right: 0;
      }
    }

    .header__dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      background: none;
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      text-decoration: none;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: rgba(88, 101, 242, 0.2);
        color: white;
      }
    }

    .header__dropdown-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: var(--space-xs) 0;
    }

    .header__profile-header {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      color: var(--text-primary);
      font-weight: 500;
    }

    .header__profile-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #5865F2, #7C3AED);
      border-radius: var(--radius-full);
      color: white;
    }

    .header__actions {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .header__icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-decoration: none;

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .header__badge {
      position: absolute;
      top: 2px;
      right: 2px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      background: var(--color-primary);
      border-radius: var(--radius-full);
      color: white;
      font-size: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header__menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.1);
      }

      @media (min-width: 768px) {
        display: none;
      }
    }

    .header__mobile-nav {
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      padding: var(--space-lg);
      background: #0a0a12;
      z-index: 999;
      overflow-y: auto;
      animation: fadeIn 0.2s ease;

      @media (min-width: 768px) {
        display: none;
      }
    }

    .header__mobile-link {
      padding: var(--space-md) var(--space-sm);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 1rem;
      font-weight: 500;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      transition: color 0.2s ease;

      &:hover {
        color: #fff;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    /* Search Modal */
    .search-modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 15vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      animation: fadeIn 0.2s ease;
    }

    .search-modal__content {
      width: 100%;
      max-width: 600px;
      margin: 0 var(--space-md);
      background: rgba(20, 20, 30, 0.98);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-xl);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideInUp 0.3s ease;
    }

    .search-modal__header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      color: var(--text-muted);
    }

    .search-modal__input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-size: var(--font-size-xl);
      color: white;

      &::placeholder {
        color: var(--text-muted);
      }
    }

    .search-modal__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .search-modal__hints {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-sm) var(--space-lg) var(--space-md);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .search-modal__hint {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
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

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private watchlistStore = inject(WatchlistStore);
  private router = inject(Router);

  isMobileMenuOpen = signal(false);
  showGenreMenu = signal(false);
  showProfileMenu = signal(false);
  isSearchOpen = signal(false);
  searchQuery = '';

  watchlistCount = this.watchlistStore.count;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleSearchModal(): void {
    this.isSearchOpen.update(v => !v);
    if (this.isSearchOpen()) {
      this.searchQuery = '';
      // Focus input after modal opens
      setTimeout(() => {
        const input = document.querySelector('.search-modal__input') as HTMLInputElement;
        input?.focus();
      }, 100);
    }
  }

  closeSearchModal(): void {
    this.isSearchOpen.set(false);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.closeSearchModal();
    }
  }
}
