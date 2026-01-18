import { Injectable } from '@angular/core';

interface CacheEntry<T> {
    data: T;
    expiry: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
    private cache = new Map<string, CacheEntry<unknown>>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes

    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;
        if (!entry) return null;
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }

    set<T>(key: string, data: T, ttlMs: number = this.defaultTTL): void {
        this.cache.set(key, { data, expiry: Date.now() + ttlMs });
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    generateKey(prefix: string, params: Record<string, string | number>): string {
        const sortedParams = Object.entries(params)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        return `${prefix}:${sortedParams}`;
    }
}
