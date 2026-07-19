export interface AdminDashboard {
    totalMovies: number;
    totalActors: number;
    totalDirectors: number;
    totalUsers: number;
  
    recentMovies: {
      id: number;
      title: string;
      genre: string;
      rating: number;
      posterPath: string | null;
      director: {
        name: string;
      };
  
      actors: {
        id: number;
        name: string;
      }[];
    }[];
  }