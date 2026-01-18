import { Routes } from '@angular/router';
import { movieResolver } from './shared/resolvers';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'CineScope - Discover Movies'
    },
    {
        path: 'movie/:imdbId',
        loadComponent: () => import('./pages/movie-details/movie-details.component').then(m => m.MovieDetailsComponent),
        title: 'Movie Details - CineScope',
        resolve: { movie: movieResolver }
    },
    {
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
        title: 'Search Movies - CineScope'
    },
    {
        path: 'watchlist',
        loadComponent: () => import('./pages/watchlist/watchlist.component').then(m => m.WatchlistComponent),
        title: 'My Watchlist - CineScope'
    },
    {
        path: 'genre/:genreName',
        loadComponent: () => import('./pages/genre/genre.component').then(m => m.GenreComponent),
        title: 'Browse Genre - CineScope'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
