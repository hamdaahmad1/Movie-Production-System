export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
  
    updatedAt: string;
  
    userId: number;
  
    movieId: number;
  
    user: {
      username: string;
    };
  }