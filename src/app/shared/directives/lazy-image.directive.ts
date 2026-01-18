import { Directive, ElementRef, input, effect, inject } from '@angular/core';

@Directive({ selector: '[appLazyImage]', standalone: true })
export class LazyImageDirective {
    private el = inject(ElementRef<HTMLImageElement>);
    private observer: IntersectionObserver | null = null;
    private loaded = false;

    appLazyImage = input.required<string>();
    fallback = input<string>('assets/images/no-poster.svg');

    constructor() {
        effect(() => {
            if (!this.loaded) this.setupObserver();
        });
    }

    private setupObserver(): void {
        const img = this.el.nativeElement;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) this.loadImage();
                    });
                },
                { rootMargin: '50px', threshold: 0.1 }
            );
            this.observer.observe(img);
        } else {
            this.loadImage();
        }
    }

    private loadImage(): void {
        const img = this.el.nativeElement;
        const src = this.appLazyImage();

        if (this.observer) {
            this.observer.unobserve(img);
            this.observer.disconnect();
        }

        img.loading = 'lazy';
        img.decoding = 'async';

        img.onload = () => {
            img.style.opacity = '1';
            this.loaded = true;
        };

        img.onerror = () => {
            img.src = this.fallback();
            img.style.opacity = '1';
            this.loaded = true;
        };

        if (src && src !== 'N/A') {
            img.src = src;
        } else {
            img.src = this.fallback();
            img.style.opacity = '1';
        }
    }
}
