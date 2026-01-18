import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    @if (isNavigating()) {
      <div class="nav-loading">
        <div class="nav-loading__spinner"></div>
      </div>
    }
    <router-outlet />
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .nav-loading {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 15, 26, 0.95);
      z-index: 9999;
      animation: fadeIn 0.15s ease;
    }

    .nav-loading__spinner {
      width: 48px;
      height: 48px;
      border: 3px solid transparent;
      border-top-color: #5865F2;
      border-right-color: #4752C4;
      border-radius: 50%;
      animation: spin 0.8s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class App implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;
  isNavigating = signal(false);

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.router.navigated) {
        this.isNavigating.set(true);
      }

      if (event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError) {
        setTimeout(() => this.isNavigating.set(false), 100);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
