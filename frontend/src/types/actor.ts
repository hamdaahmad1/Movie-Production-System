export interface Actor {
    id: number;
    name: string;
    dob: string;
    gender: string;
    biography: string;
    nationality : string;
    awards: number;
    imagePath: string | null;

    movies?: {
        id:number;
        title:string;
    }[];
}

export interface ActorFormData {
    name: string;
    dob: string;
    nationality: string;
    gender: string;
    biography: string;
    awards: string;
    image?: File;
  }