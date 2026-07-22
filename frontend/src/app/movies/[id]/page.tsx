"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";

import { useAuth } from "@/context/AuthContext";

import { getMovieReviews, deleteReview } from "@/services/reviewService";
import Link from "next/link";

export default function MovieDetailsPage() {
  const params = useParams();

  const router = useRouter();

  const movieId = Number(params.id);
  

  const { user, loading } = useAuth();

  const [reviews, setReviews] = useState<any[]>([]);

  async function loadReviews() {
    try {
      const data = await getMovieReviews(movieId);

      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (movieId) {
      loadReviews();
    }
  }, [movieId]);

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Delete this review?");

    if (!confirmDelete) return;

    try {
      await deleteReview(id);

      alert("Review deleted");

      loadReviews();
    } catch (error) {
      console.error(error);

      alert("Failed to delete review");
    }
  }
  function renderStars(rating: number) {
    return (
      <span style={{ fontSize: "25px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{star <= rating ? "★" : "☆"}</span>
        ))}
      </span>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
        }}
      >
        <h1>Movie Reviews</h1>

        <button onClick={() => router.back()}>Back</button>

        <br />
        <br />

        <h2>Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <h3>{review.user?.username}</h3>

              <p>
                <strong>Rating:</strong>
                <br />

                {renderStars(review.rating)}
              </p>

              <p>
                <strong>Comment:</strong> {review.comment}
              </p>

              {user?.role === "ADMIN" && (
                <Link href={`/movies/${movieId}/review/edit/${review.id}`}>
                  <button>Edit Review</button>
                </Link>
              )}

              {(user?.role === "ADMIN" || review.user?.id === user?.id) && (
                <button onClick={() => handleDelete(review.id)}>
                  Delete Review
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
