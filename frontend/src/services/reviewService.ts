import API from "./api";

export async function getMovieReviews(movieId: number) {
  const response = await API.get(
    `/reviews/movie/${movieId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function getReview(id: number) {
  const response = await API.get(`/reviews/${id}`, {
    withCredentials: true,
  });

  return response.data;
}

export async function createReview(
    movieId: number,
    data: {
      rating: number;
      comment: string;
    }
  ) {
    const response = await API.post(
      `/reviews/movie/${movieId}`,
      data,
      {
        withCredentials: true,
      }
    );
  
    return response.data;
  }

  export async function updateReview(
    id:number,
    data:any
   ){
   
    const response = await API.patch(
      `/reviews/${id}`,
      data,
      {
       withCredentials:true,
      }
    );
   
    return response.data;
   }

export async function deleteReview(id: number) {
  const response = await API.delete(
    `/reviews/${id}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}
export async function getMyReviews() {
    const response = await API.get(
      "/reviews/my-reviews",
      {
        withCredentials: true,
      }
    );
  
    return response.data;
  }