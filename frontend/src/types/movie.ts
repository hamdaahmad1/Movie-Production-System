export interface Movie {
    id: number;
    title: string;
    release_year: number;
    duration: number;
    genre: string;
    rating: number;
    directorId: number;
    actorIds: number[];
}