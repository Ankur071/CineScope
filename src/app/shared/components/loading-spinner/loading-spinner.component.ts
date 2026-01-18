import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (overlay()) {
      <div class="spinner-overlay">
        <div class="spinner" [class]="'spinner--' + size()"></div>
      </div>
    } @else {
      <div class="spinner" [class]="'spinner--' + size()"></div>
    }
  `,
  styles: [`
    .spinner {
      border-radius: 50%;
      border-style: solid;
      border-color: var(--color-primary);
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
    }

    .spinner--sm {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }

    .spinner--md {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .spinner--lg {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: var(--z-modal);
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  overlay = input<boolean>(false);
}
