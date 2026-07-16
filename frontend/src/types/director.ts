export interface Director {
    id: number;
    name: string;
    dob: string;
    nationality: string;
    biography: string;
    imagePath: string | null;
    movies?: {
        id: number;
        title: string;
    }[];
}

export interface DirectorFormData {
    name: string;
    dob: string;
    nationality: string;
    biography: string;
    image?: File;
  }