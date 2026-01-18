import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MovieSearchResponse, MovieSearchResult, MovieDetails } from '../../shared/models';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class OmdbService {
    private http = inject(HttpClient);
    private cache = inject(CacheService);
    private baseUrl = environment.omdbBaseUrl;

    searchMovies(query: string, page: number = 1): Observable<MovieSearchResponse> {
        const cacheKey = this.cache.generateKey('search', { s: query, page });
        const cached = this.cache.get<MovieSearchResponse>(cacheKey);
        if (cached) return of(cached);

        return this.http.get<MovieSearchResponse>(this.baseUrl, {
            params: { s: query, type: 'movie', page: page.toString() }
        }).pipe(
            tap(response => {
                if (response.Response === 'True') this.cache.set(cacheKey, response);
            }),
            catchError(this.handleError)
        );
    }

    getMoviesByCategory(category: string, limit: number = 12): Observable<MovieSearchResult[]> {
        const cacheKey = this.cache.generateKey('category12', { s: category, limit });
        const cached = this.cache.get<MovieSearchResult[]>(cacheKey);
        if (cached) return of(cached);

        // Fetch 2 pages to get 12 movies (OMDb returns 10 per page)
        const page1$ = this.http.get<MovieSearchResponse>(this.baseUrl, {
            params: { s: category, type: 'movie', page: '1' }
        });
        const page2$ = this.http.get<MovieSearchResponse>(this.baseUrl, {
            params: { s: category, type: 'movie', page: '2' }
        });

        return forkJoin([page1$, page2$]).pipe(
            map(([res1, res2]) => {
                const movies1 = res1.Response === 'True' ? res1.Search : [];
                const movies2 = res2.Response === 'True' ? res2.Search : [];
                const combined = [...movies1, ...movies2].slice(0, limit);
                this.cache.set(cacheKey, combined);
                return combined;
            }),
            catchError(this.handleError)
        );
    }

    getMovieById(imdbId: string): Observable<MovieDetails> {
        const cacheKey = this.cache.generateKey('movie', { i: imdbId });
        const cached = this.cache.get<MovieDetails>(cacheKey);
        if (cached) return of(cached);

        return this.http.get<MovieDetails>(this.baseUrl, {
            params: { i: imdbId, plot: 'full' }
        }).pipe(
            tap(response => {
                if (response.Response === 'True') this.cache.set(cacheKey, response);
            }),
            catchError(this.handleError)
        );
    }

    getMovieByTitle(title: string, year?: string): Observable<MovieDetails> {
        const params: Record<string, string> = { t: title, plot: 'full' };
        if (year) params['y'] = year;

        return this.http.get<MovieDetails>(this.baseUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Unable to load movies. Please try again.';

        if (error.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
        } else if (error.status === 401) {
            errorMessage = 'Invalid API key.';
        } else if (error.status === 429) {
            errorMessage = 'Too many requests. Please wait.';
        }

        console.error('OMDb API Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
