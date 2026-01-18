# CineScope - Movie Discovery Application

A Movie Discovery Application built with **Angular 21** and the **OMDb API**. This project demonstrates proficiency in Angular component architecture, API integration, state management, routing, and responsive UI design.

![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![SCSS](https://img.shields.io/badge/Styling-SCSS-pink?logo=sass)

## Features

### Core Features
- **Home Page** - Featured movie hero section with category carousels (Action, Comedy, Drama, Thriller)
- **Search** - Real-time search with 300ms debounce, recent searches, and pagination
- **Movie Details** - Complete movie info with poster, plot, rating, director, actors, and awards
- **Watchlist** - Save favorite movies locally with persistent storage
- **Genre Browsing** - Browse movies by genre with load more pagination

### Technical Highlights
- **Fully Responsive** - Mobile-first design optimized for all devices
- **Route Resolvers** - Pre-fetch movie data for seamless navigation
- **Navigation Loading** - Smooth loading indicator during route transitions
- **HTTP Caching** - Intelligent caching to minimize API calls
- **State Management** - Angular Signals for reactive state

## Project Structure

```
src/app/
├── layout/                  # Layout components
│   ├── header/              # Sticky navigation header
│   └── footer/              # Site footer
├── pages/                   # Page components (lazy-loaded)
│   ├── home/                # Home page with carousels
│   ├── movie-details/       # Movie details page
│   ├── search/              # Search functionality
│   ├── genre/               # Genre browsing
│   └── watchlist/           # Watchlist page
└── shared/                  # Reusable utilities
    ├── components/          # UI components (MovieCard, MovieList, etc.)
    ├── services/            # API & caching services
    ├── interceptors/        # HTTP interceptors
    ├── resolvers/           # Route resolvers
    ├── directives/          # Custom directives
    ├── pipes/               # Custom pipes
    ├── state/               # State management
    └── models/              # TypeScript interfaces
```

## Technical Stack

| Category | Technology |
|----------|------------|
| Framework | Angular 21 (Standalone Components) |
| State Management | Angular Signals |
| Styling | SCSS with CSS Variables |
| HTTP Client | Angular HttpClient with Interceptors |
| Routing | Angular Router with Lazy Loading |
| API | OMDb API |

## Requirements Implementation

### Mandatory Features
- [x] Home page with movie categories (12 movies per category)
- [x] Global search functionality with debounce
- [x] Movie details page with all required fields
- [x] Favorites/Watchlist with localStorage persistence
- [x] Genre-based filtering
- [x] Responsive UI (mobile, tablet, desktop)

### Technical Requirements
- [x] Standalone components
- [x] Reusable components (MovieCard, MovieList, SearchBar, LoadingSpinner)
- [x] Centralized API service with error handling
- [x] RxJS operators (debounceTime, distinctUntilChanged, switchMap, forkJoin)
- [x] Custom Pipes (RuntimePipe, RatingPipe)
- [x] Custom Directives (LazyImageDirective)
- [x] HTTP Interceptor for API key injection
- [x] State management with Angular Signals

### Bonus Features
- [x] Route Resolvers for pre-fetching data
- [x] Share Button with Web Share API fallback
- [x] Request Caching with TTL support

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cinescope.git
cd cinescope

# Install dependencies
pnpm install

# Start development server
pnpm run start
```

### Build

```bash
# Build for production
pnpm run build
```

### Environment Configuration

Create your API key at [OMDb API](http://www.omdbapi.com/apikey.aspx) and update:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  omdbApiKey: 'YOUR_API_KEY',
  omdbBaseUrl: 'https://www.omdbapi.com/'
};
```

## Key Implementation Files

| File | Purpose |
|------|---------|
| `app.routes.ts` | Application routing with lazy loading |
| `shared/services/omdb.service.ts` | Centralized OMDb API service |
| `shared/services/cache.service.ts` | HTTP response caching with TTL |
| `shared/interceptors/api-key.interceptor.ts` | Auto-injects API key to requests |
| `shared/resolvers/movie.resolver.ts` | Pre-fetches movie details |
| `shared/state/favorites.store.ts` | Watchlist state with Signals |
| `shared/pipes/runtime.pipe.ts` | Formats runtime (120 min → 2h 0m) |
| `shared/directives/lazy-image.directive.ts` | Image lazy loading with fallback |

## Design Decisions

1. **Standalone Components** - Modern Angular approach without NgModules for simpler architecture
2. **Angular Signals** - Chosen over NgRx for simplicity and native Angular integration
3. **SCSS Variables** - Design tokens for consistent theming and easy customization
4. **Mobile-First Design** - Responsive breakpoints starting from mobile
5. **Route Resolvers** - Better UX by pre-loading data before navigation
6. **HTTP Caching** - Reduces API calls and improves performance
7. **Clean Architecture** - Separation of concerns with layout, pages, and shared modules

## Live Demo

[View Live Demo](https://your-deployment-url.vercel.app)

---

Developed with Angular 21
