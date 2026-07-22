"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { getFavorites, getWatchlist } from "@/services/movieInteractionService";

import { getMyReviews } from "@/services/reviewService";
import Link from "next/link";

export default function ViewerPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [favorites, setFavorites] = useState<any[]>([]);

  const [watchlist, setWatchlist] = useState<any[]>([]);

  const [reviews, setReviews] = useState<any[]>([]);
  const ITEMS_PER_PAGE = 5;

  const [favoritePage, setFavoritePage] = useState(1);

  const [watchlistPage, setWatchlistPage] = useState(1);

  const [reviewPage, setReviewPage] = useState(1);
  const paginatedFavorites = favorites.slice(
    (favoritePage - 1) * ITEMS_PER_PAGE,
    favoritePage * ITEMS_PER_PAGE
  );

  const paginatedWatchlist = watchlist.slice(
    (watchlistPage - 1) * ITEMS_PER_PAGE,
    watchlistPage * ITEMS_PER_PAGE
  );

  const paginatedReviews = reviews.slice(
    (reviewPage - 1) * ITEMS_PER_PAGE,
    reviewPage * ITEMS_PER_PAGE
  );

  async function loadDashboardData() {
    try {
      const favoritesData = await getFavorites();

      const watchlistData = await getWatchlist();

      const reviewsData = await getMyReviews();

      setFavorites(favoritesData.map((item: any) => item.movie));

      setWatchlist(watchlistData.map((item: any) => item.movie));

      setReviews(reviewsData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");

      return;
    }

    if (user.role !== "VIEWER") {
      router.replace("/");

      return;
    }

    loadDashboardData();
  }, [user, loading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>Viewer Dashboard</h1>

        <p>Welcome, {user?.firstName}!</p>

        <hr />

        <h2>Favorite Movies</h2>

        {favorites.length === 0 ? (
          <p>No favorite movies.</p>
        ) : (
          <>
            {paginatedFavorites.map((movie) => (
              <div
                key={movie.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              >
                {movie.posterPath && (
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    style={{
                      width: "150px",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <h3>{movie.title}</h3>

                <p>
                  <strong>Rating:</strong> {movie.rating}/10
                </p>

                <p>
                  <strong>Genre:</strong> {movie.genre}
                </p>

                <Link href={`/movies/${movie.id}`}>View Movie</Link>
              </div>
            ))}

            <div style={{ marginTop: "15px", marginBottom: "20px" }}>
              <button
                disabled={favoritePage === 1}
                onClick={() => setFavoritePage((p) => p - 1)}
              >
                Previous
              </button>

              <span style={{ margin: "0 10px" }}>Page {favoritePage}</span>

              <button
                disabled={favoritePage * ITEMS_PER_PAGE >= favorites.length}
                onClick={() => setFavoritePage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        <hr />

        <h2>Watchlist Movies</h2>

        {watchlist.length === 0 ? (
          <p>No movies in watchlist.</p>
        ) : (
          <>
            {paginatedWatchlist.map((movie) => (
              <div
                key={movie.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              >
                {movie.posterPath && (
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    style={{
                      width: "150px",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <h3>{movie.title}</h3>

                <p>
                  <strong>Genre:</strong> {movie.genre}
                </p>

                <p>
                  <strong>Rating:</strong> {movie.rating}/10
                </p>

                <Link href={`/movies/${movie.id}`}>View Movie</Link>
              </div>
            ))}

            <div style={{ marginTop: "15px", marginBottom: "20px" }}>
              <button
                disabled={watchlistPage === 1}
                onClick={() => setWatchlistPage((p) => p - 1)}
              >
                Previous
              </button>

              <span style={{ margin: "0 10px" }}>Page {watchlistPage}</span>

              <button
                disabled={watchlistPage * ITEMS_PER_PAGE >= watchlist.length}
                onClick={() => setWatchlistPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        <hr />

        <h2>My Reviews</h2>

        {reviews.length === 0 ? (
          <p>You have not written any reviews.</p>
        ) : (
          <>
            {paginatedReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              >
                {review.movie?.posterPath && (
                  <img
                    src={review.movie.posterPath}
                    alt={review.movie.title}
                    style={{
                      width: "150px",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <h3>{review.movie?.title}</h3>

                <p>
                  <strong>Rating:</strong> {review.rating}/5
                </p>

                <p>
                  <strong>Comment:</strong> {review.comment}
                </p>

                <Link href={`/movies/${review.movie?.id}`}>View Movie</Link>
              </div>
            ))}

            <div style={{ marginTop: "15px", marginBottom: "20px" }}>
              <button
                disabled={reviewPage === 1}
                onClick={() => setReviewPage((p) => p - 1)}
              >
                Previous
              </button>

              <span style={{ margin: "0 10px" }}>Page {reviewPage}</span>

              <button
                disabled={reviewPage * ITEMS_PER_PAGE >= reviews.length}
                onClick={() => setReviewPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
