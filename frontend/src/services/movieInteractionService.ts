import API from "./api";

export async function addFavorite(movieId: number) {
  const response = await API.post(
    `/movie-interactions/favorite/${movieId}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function removeFavorite(movieId: number) {
  const response = await API.delete(
    `/movie-interactions/favorite/${movieId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function getFavorites() {
  const response = await API.get(
    "/movie-interactions/favorites",
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function addWatchlist(movieId: number) {
  const response = await API.post(
    `/movie-interactions/watchlist/${movieId}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function removeWatchlist(movieId: number) {
  const response = await API.delete(
    `/movie-interactions/watchlist/${movieId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function getWatchlist() {
  const response = await API.get(
    "/movie-interactions/watchlist",
    {
      withCredentials: true,
    }
  );

  return response.data;
}