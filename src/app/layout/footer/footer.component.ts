import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <footer class="footer">
      <div class="footer__container">
        <!-- Logo -->
        <a routerLink="/home" class="footer__logo">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <polygon points="10,8 16,12 10,16" fill="currentColor"/>
          </svg>
          <span>CineScope</span>
        </a>

        <nav class="footer__nav">
          <a routerLink="/home">Home</a>
          <a routerLink="/search">Search</a>
          <a routerLink="/watchlist">Watchlist</a>
        </nav>

        <div class="footer__bottom">
          <span>© 2026 CineScope. All Rights Reserved.</span>
          <span class="footer__divider">|</span>
          <span>Powered by OMDb API</span>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background: #0d0d12;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: var(--space-xl) 0;
      margin-top: auto;
    }

    .footer__container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-lg);
    }

    .footer__logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #fff;
      font-size: 1.125rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }

      svg {
        color: #5865F2;
      }
    }

    .footer__nav {
      display: flex;
      align-items: center;
      gap: var(--space-xl);

      a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s;

        &:hover {
          color: #fff;
        }
      }

      @media (max-width: 480px) {
        gap: var(--space-md);
      }
    }

    .footer__bottom {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.75rem;

      @media (max-width: 480px) {
        flex-direction: column;
        text-align: center;
        gap: 4px;
      }
    }

    .footer__divider {
      opacity: 0.3;

      @media (max-width: 480px) {
        display: none;
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent { }

