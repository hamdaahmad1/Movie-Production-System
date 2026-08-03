import { Movie } from "./movie";
import { Review } from "./review";

export interface AdminDashboard {
  totalMovies: number;
  totalActors: number;
  totalDirectors: number;
  totalUsers: number;

  recentMovies: Movie[];
}

export interface EditorDashboard {
  totalMovies: number;

  recentMovies: Movie[];
}

export interface ViewerDashboard {
  favorites: Movie[];
  watchlist: Movie[];
  reviews: Review[];
}