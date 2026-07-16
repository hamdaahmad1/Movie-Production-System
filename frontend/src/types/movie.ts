import { Actor } from "./actor";
import { Director } from "./director";

export interface Movie {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    language: string;
    posterPath?: string | null;
    trailerId: string;
    duration: number;
    genre: string;
    rating: number;

    directorId: number;

    director?: Director;

    actors?: Actor[];
}