"use client";

import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";

import { useAuth } from "@/context/AuthContext";

import { getReview, updateReview } from "@/services/reviewService";

import toast from "react-hot-toast";

export default function EditReviewPage() {
  const params = useParams();

  const router = useRouter();

  const movieId = Number(params.id);

  const reviewId = Number(params.reviewId);

  const { user, loading } = useAuth();

  const [rating, setRating] = useState<number>(5);

  const [comment, setComment] = useState("");

  const [loadingReview, setLoadingReview] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");

      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadReview() {
      const toastId = toast.loading("Loading review...");

      try {
        const data = await getReview(reviewId);

        setRating(data.rating);

        setComment(data.comment);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load review");
      } finally {
        toast.dismiss(toastId);

        setLoadingReview(false);
      }
    }

    if (reviewId) {
      loadReview();
    }
  }, [reviewId]);

  function handleStarClick(value: number) {
    setRating(value);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a comment");

      return;
    }

    const toastId = toast.loading("Updating review...");

    try {
      setSaving(true);

      await updateReview(reviewId, {
        rating,
        comment,
      });

      toast.dismiss(toastId);

      toast.success("Review updated successfully");

      router.push(`/movies/${movieId}`);
    } catch (error: any) {
      toast.dismiss(toastId);

      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update review");
    } finally {
      setSaving(false);
    }
  }

  if (loading || loadingReview) {
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
        <h1>Edit Review</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <p>Rating:</p>

            <div
              style={{
                fontSize: "30px",
              }}
            >
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <br />
          <br />

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
