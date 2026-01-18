// Movie model interfaces for OMDb API responses

export interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search: MovieSearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

// App-specific movie interface for favorites/watchlist
export interface Movie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  rating?: string;
  genre?: string;
  runtime?: string;
}
