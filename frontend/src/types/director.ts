export interface Director {
    id: number;
    name: string;
    dob: string;
    nationality: string;
    biography: string;
    imageUrl: string;
    movies?: {
        id: number;
        title: string;
    }[];
}
