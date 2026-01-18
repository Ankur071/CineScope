import { Pipe, PipeTransform } from '@angular/core';

// Transforms "120 min" → "2h 0m"
@Pipe({ name: 'runtime', standalone: true })
export class RuntimePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value || value === 'N/A') return 'N/A';

        const match = value.match(/(\d+)/);
        if (!match) return value;

        const totalMinutes = parseInt(match[1], 10);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
    }
}
