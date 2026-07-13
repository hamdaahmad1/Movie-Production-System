export interface Actor {
    id: number;
    name: string;
    dob: string;
    gender: string;
    biography: string;
    nationality : string;
    awards: number;
    imageUrl: string;

    movies?: {
        id:number;
        title:string;
    }[];
}