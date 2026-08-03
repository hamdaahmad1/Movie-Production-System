import { Actor } from "./actor";
import { Director } from "./director";

export interface Movie {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    language: string;
    posterPath?: string | null;
    bannerPath?: string | null;
    trailerId: string;
    duration: number;
    genre: string;
    rating: number;
    averageRating: number;   // Calculated average
    totalRatings: number;    // Number of ratings

    directorId: number;

    director?: Director;

    actors?: Actor[];
}
export interface MovieResponse {
    data: Movie[];
  
    total: number;
  
    page: number;
  
    limit: number;
  
    totalPages: number;
  }