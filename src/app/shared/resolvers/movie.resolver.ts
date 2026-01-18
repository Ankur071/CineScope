import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { OmdbService } from '../services/omdb.service';
import { MovieDetails } from '../models';

export const movieResolver: ResolveFn<MovieDetails | null> = (route) => {
    const omdbService = inject(OmdbService);
    const router = inject(Router);
    const imdbId = route.paramMap.get('imdbId');

    if (!imdbId) {
        router.navigate(['/home']);
        return of(null);
    }

    return omdbService.getMovieById(imdbId).pipe(
        catchError(() => {
            router.navigate(['/home']);
            return of(null);
        })
    );
};
