import { Injectable, signal, computed, effect } from '@angular/core';
import { Movie } from '../models';

const WATCHLIST_KEY = 'cinescope_watchlist';

@Injectable({ providedIn: 'root' })
export class WatchlistStore {
    private _watchlist = signal<Movie[]>(this.loadFromStorage());
    readonly watchlist = this._watchlist.asReadonly();
    readonly count = computed(() => this._watchlist().length);
    readonly watchlistIds = computed(() => new Set(this._watchlist().map(m => m.imdbID)));

    constructor() {
        effect(() => this.saveToStorage(this._watchlist()));
    }

    isInWatchlist(imdbId: string): boolean {
        return this.watchlistIds().has(imdbId);
    }

    addToWatchlist(movie: Movie): void {
        if (!this.isInWatchlist(movie.imdbID)) {
            this._watchlist.update(list => [...list, movie]);
        }
    }

    removeFromWatchlist(imdbId: string): void {
        this._watchlist.update(list => list.filter(m => m.imdbID !== imdbId));
    }

    toggleWatchlist(movie: Movie): void {
        if (this.isInWatchlist(movie.imdbID)) {
            this.removeFromWatchlist(movie.imdbID);
        } else {
            this.addToWatchlist(movie);
        }
    }

    clearWatchlist(): void {
        this._watchlist.set([]);
    }

    private loadFromStorage(): Movie[] {
        try {
            const stored = localStorage.getItem(WATCHLIST_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    private saveToStorage(watchlist: Movie[]): void {
        try {
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
        } catch {
            // Storage full
        }
    }
}
