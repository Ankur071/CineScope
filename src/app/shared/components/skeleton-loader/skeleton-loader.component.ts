import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="skeleton" 
      [class.skeleton--card]="type() === 'card'"
      [class.skeleton--text]="type() === 'text'"
      [class.skeleton--detail]="type() === 'detail'"
      [class.skeleton--circle]="type() === 'circle'"
      [style.width]="width()"
      [style.height]="height()"
    ></div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(
        90deg,
        var(--bg-card) 25%,
        var(--bg-elevated) 50%,
        var(--bg-card) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite ease-in-out;
      border-radius: var(--radius-md);
    }

    .skeleton--card {
      width: var(--card-width);
      height: var(--card-height);
      border-radius: var(--radius-lg);
    }

    .skeleton--text {
      height: 1em;
      border-radius: var(--radius-sm);
    }

    .skeleton--detail {
      height: 300px;
      border-radius: var(--radius-lg);
    }

    .skeleton--circle {
      border-radius: var(--radius-full);
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  type = input<'card' | 'text' | 'detail' | 'circle'>('text');
  width = input<string>('100%');
  height = input<string>('');
}
