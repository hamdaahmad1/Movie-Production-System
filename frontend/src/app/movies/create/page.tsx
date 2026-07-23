"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { createMovie } from "@/services/movieService";

import { getDirectors } from "@/services/directorService";

import { getActors } from "@/services/actorService";

export default function CreateMovie() {
  const router = useRouter();
  const [poster, setPoster] = useState<File | null>(null);

  const { user, loading } = useAuth();

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    releaseDate: "",
    duration: "",
    genre: "",
    language: "",
    rating: "",
    trailerId: "",
    directorId: "",
    actorIds: [] as number[],
  });

  const [directors, setDirectors] = useState<any[]>([]);

  const [actors, setActors] = useState<any[]>([]);

  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");

      return;
    }

    if (user.role !== "ADMIN" && user.role !== "EDITOR") {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const directorsData = await getDirectors();

        const actorsData = await getActors();

        setDirectors(directorsData.data || directorsData);

        setActors(actorsData.data || actorsData);
      } catch (error) {
        console.error(error);

        setError("Failed to load directors and actors");
      }
    }

    loadData();
  }, []);

  function validateForm() {
    const title = movie.title.trim();

    const description = movie.description.trim();

    const genre = movie.genre.trim();

    const language = movie.language.trim();

    const trailerId = movie.trailerId.trim();

    const duration = Number(movie.duration);

    const rating = Number(movie.rating);

    if (!title) {
      return "Movie title is required";
    }

    if (title.length < 2) {
      return "Movie title must be at least " + "2 characters long";
    }

    if (title.length > 150) {
      return "Movie title cannot exceed " + "150 characters";
    }

    if (!description) {
      return "Description is required";
    }

    if (description.length < 20) {
      return "Description must be at least " + "20 characters long";
    }

    if (description.length > 2000) {
      return "Description cannot exceed " + "2000 characters";
    }

    if (!movie.releaseDate) {
      return "Release date is required";
    }

    const releaseDate = new Date(movie.releaseDate);

    if (releaseDate > new Date()) {
      return "Release date cannot be in the future";
    }

    if (!movie.duration) {
      return "Duration is required";
    }

    if (isNaN(duration)) {
      return "Duration must be a number";
    }

    if (duration < 30) {
      return "Duration must be at least 30 minutes";
    }

    if (duration > 500) {
      return "Duration cannot exceed 500 minutes";
    }

    if (!genre) {
      return "Genre is required";
    }

    if (genre.length < 3) {
      return "Genre must be at least 3 characters long";
    }

    if (genre.length > 50) {
      return "Genre cannot exceed 50 characters";
    }

    if (!language) {
      return "Language is required";
    }

    if (language.length < 2) {
      return "Language must be at least 2 characters long";
    }

    if (language.length > 30) {
      return "Language cannot exceed 30 characters";
    }

    if (!movie.rating) {
      return "Rating is required";
    }

    if (isNaN(rating)) {
      return "Rating must be a number";
    }

    if (rating < 1 || rating > 10) {
      return "Rating must be between 1 and 10";
    }

    if (!trailerId) {
      return "Trailer URL is required";
    }

    if (!movie.directorId) {
      return "Director is required";
    }

    if (movie.actorIds.length === 0) {
      return "At least one actor must be selected";
    }

    if (poster) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(poster.type)) {
        return "Only JPG, PNG and WEBP images are allowed";
      }

      if (poster.size > 5 * 1024 * 1024) {
        return "Image size cannot exceed 5MB";
      }
    }

    return "";
  }

  function handleActorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedIds = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value)
    );

    setMovie({
      ...movie,
      actorIds: selectedIds,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    setError("");

    try {
      const formData = new FormData();

      formData.append("title", movie.title.trim());

      formData.append("description", movie.description.trim());

      formData.append("releaseDate", movie.releaseDate);

      formData.append("duration", String(movie.duration));

      formData.append("genre", movie.genre.trim());

      formData.append("language", movie.language.trim());

      formData.append("rating", String(movie.rating));

      formData.append("trailerId", movie.trailerId.trim());

      formData.append("directorId", String(movie.directorId));

      movie.actorIds.forEach((id) => {
        formData.append("actorIds", String(id));
      });

      if (poster) {
        formData.append("image", poster);
      }

      await createMovie(formData);

      alert("Movie created successfully!");

      router.push("/movies");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create movie.");
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return null;
  }

  return (
    <div>
      <h1>Create Movie</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <button onClick={() => router.push("/movies")}>Movies List</button>

      <br />
      <br />

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Movie Title</label>

        <br />

        <input
          type="text"
          maxLength={150}
          value={movie.title}
          onChange={(e) =>
            setMovie({
              ...movie,
              title: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Description</label>

        <br />

        <textarea
          rows={6}
          maxLength={2000}
          value={movie.description}
          onChange={(e) =>
            setMovie({
              ...movie,
              description: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Release Date</label>

        <br />

        <input
          type="date"
          value={movie.releaseDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setMovie({
              ...movie,
              releaseDate: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Duration in minutes</label>

        <br />

        <input
          type="number"
          min={30}
          max={500}
          value={movie.duration}
          onChange={(e) =>
            setMovie({
              ...movie,
              duration: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Genre</label>

        <br />

        <input
          type="text"
          maxLength={50}
          value={movie.genre}
          onChange={(e) =>
            setMovie({
              ...movie,
              genre: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Language</label>

        <br />

        <input
          type="text"
          maxLength={30}
          value={movie.language}
          onChange={(e) =>
            setMovie({
              ...movie,
              language: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Rating</label>

        <br />

        <input
          type="number"
          min={1}
          max={10}
          step={0.1}
          value={movie.rating}
          onChange={(e) =>
            setMovie({
              ...movie,
              rating: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>YouTube Trailer URL</label>

        <br />

        <input
          type="url"
          value={movie.trailerId}
          onChange={(e) =>
            setMovie({
              ...movie,
              trailerId: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Movie Poster</label>

        <br />

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;

            setPoster(file);
          }}
        />

        <br />

        <small>Optional. JPG, PNG, WEBP only. Max size 5MB.</small>
        {poster && (
          <img
            src={URL.createObjectURL(poster)}
            alt="Poster preview"
            width={160}
            height={220}
            style={{
              objectFit: "cover",
            }}
          />
        )}

        <label>Director</label>

        <br />

        <select
          value={movie.directorId}
          onChange={(e) =>
            setMovie({
              ...movie,
              directorId: e.target.value,
            })
          }
        >
          <option value="">Select Director</option>

          {directors.map((director) => (
            <option key={director.id} value={director.id}>
              {director.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Actors</label>

        <br />

        <select
          multiple
          value={movie.actorIds.map(String)}
          onChange={handleActorChange}
        >
          {actors.map((actor) => (
            <option key={actor.id} value={actor.id}>
              {actor.name}
            </option>
          ))}
        </select>

        <br />

        <br />
        <br />

        <button type="submit">Create Movie</button>
      </form>
    </div>
  );
}
