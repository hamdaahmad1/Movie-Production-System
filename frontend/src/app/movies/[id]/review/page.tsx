"use client";

import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";

import { useAuth } from "@/context/AuthContext";

import { createReview } from "@/services/reviewService";

import toast from "react-hot-toast";

export default function WriteReviewPage() {
  const params = useParams();

  const router = useRouter();

  const movieId = Number(params.id);

  const { user, loading } = useAuth();

  const [rating, setRating] = useState<number>(5);

  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");

      return;
    }

    if (user.role !== "VIEWER") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  function handleStarClick(value: number) {
    setRating(value);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a comment");

      return;
    }

    setSubmitting(true);

    const loadingToast = toast.loading("Submitting review...");

    try {
      await createReview(movieId, {
        rating,
        comment,
      });

      toast.dismiss(loadingToast);

      toast.success("Review submitted successfully");

      router.push(`/movies/${movieId}`);
    } catch (error: any) {
      console.error(error);

      toast.dismiss(loadingToast);

      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
        }}
      >
        <h1>Write Review</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <p>Rating:</p>

            <div style={{ fontSize: "30px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "30px",
                  }}
                >
                  {star <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>

          <br />
          <br />

          <label>Comment</label>

          <br />

          <textarea
            rows={6}
            cols={50}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <br />
          <br />

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
