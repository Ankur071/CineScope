import { Pipe, PipeTransform } from '@angular/core';

// Transforms "7.5" → "★ 7.5"
@Pipe({ name: 'rating', standalone: true })
export class RatingPipe implements PipeTransform {
    transform(value: string | null | undefined, format: 'star' | 'percentage' = 'star'): string {
        if (!value || value === 'N/A') return 'N/A';

        const rating = parseFloat(value);
        if (isNaN(rating)) return value;

        return format === 'percentage' ? `${Math.round(rating * 10)}%` : `★ ${rating.toFixed(1)}`;
    }
}
