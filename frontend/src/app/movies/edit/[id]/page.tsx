"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getMovie, updateMovie } from "@/services/movieService";
import { getActors } from "@/services/actorService";
import { getDirectors } from "@/services/directorService";
import { useAuth } from "@/context/AuthContext";

export default function EditMovie() {
  const router = useRouter();
  const params = useParams();

  const { user, loading } = useAuth();

  const id = Number(params.id);

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    releaseDate: "",
    duration: "",
    genre: "",
    language: "",
    rating: "",
    posterPath: "",
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

    if (
      user.role !== "ADMIN" &&
      user.role !== "EDITOR"
    ) {
      router.replace("/movies");
    }
  }, [user, loading, router]);

  
  useEffect(() => {
    async function loadData() {
      try {
        const movieData = await getMovie(id);

        const directorsData = await getDirectors();

        const actorsData = await getActors();

        setDirectors(directorsData);

        setActors(actorsData);

        setMovie({
          title: movieData.title,

          description: movieData.description,

          releaseDate:
            movieData.releaseDate.split("T")[0],

          duration: String(movieData.duration),

          genre: movieData.genre,

          language: movieData.language,

          rating: String(movieData.rating),

          posterPath:
            movieData.posterPath || "",

          trailerId: movieData.trailerId,

          directorId:
            String(movieData.directorId),

          actorIds:
            movieData.actors.map(
              (actor: any) => actor.id,
            ),
        });
      } catch (error) {
        console.error(error);

        setError(
          "Failed to load movie data.",
        );
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);


  function validateForm() {
    const title =
      movie.title.trim();

    if (!title) {
      return "Title is required";
    }

    if (
      title.length < 2 ||
      title.length > 150
    ) {
      return "Title must be between 2 and 150 characters";
    }

    if (
      !/^[A-Za-z0-9\s:'.,!?()-]+$/.test(
        title,
      )
    ) {
      return "Title contains invalid characters";
    }

    const description =
      movie.description.trim();

    if (!description) {
      return "Description is required";
    }

    if (description.length < 20) {
      return "Description must be at least 20 characters";
    }

    if (description.length > 2000) {
      return "Description cannot exceed 2000 characters";
    }

    if (!movie.releaseDate) {
      return "Release date is required";
    }

    if (
      new Date(movie.releaseDate) >
      new Date()
    ) {
      return "Release date cannot be in the future";
    }

    if (!movie.duration) {
      return "Duration is required";
    }

    const duration =
      Number(movie.duration);

    if (!Number.isInteger(duration)) {
      return "Duration must be an integer";
    }

    if (duration < 30) {
      return "Duration must be at least 30 minutes";
    }

    if (duration > 500) {
      return "Duration cannot exceed 500 minutes";
    }

    const genre =
      movie.genre.trim();

    if (!genre) {
      return "Genre is required";
    }

    if (genre.length < 3) {
      return "Genre must be at least 3 characters";
    }

    if (genre.length > 50) {
      return "Genre cannot exceed 50 characters";
    }

    if (
      !/^[A-Za-z\s-]+$/.test(
        genre,
      )
    ) {
      return "Genre can only contain letters, spaces and hyphens";
    }

    const language =
      movie.language.trim();

    if (!language) {
      return "Language is required";
    }

    if (language.length < 2) {
      return "Language must be at least 2 characters";
    }

    if (language.length > 30) {
      return "Language cannot exceed 30 characters";
    }

    if (
      !/^[A-Za-z\s]+$/.test(
        language,
      )
    ) {
      return "Language can only contain letters and spaces";
    }

    if (!movie.rating) {
      return "Rating is required";
    }

    const rating =
      Number(movie.rating);

    if (isNaN(rating)) {
      return "Rating must be a number";
    }

    if (rating < 1 || rating > 10) {
      return "Rating must be between 1 and 10";
    }

    if (!movie.trailerId.trim()) {
      return "Trailer URL is required";
    }

    try {
      new URL(
        movie.trailerId.trim(),
      );
    } catch {
      return "Trailer URL must be valid";
    }

    if (!movie.directorId) {
      return "Please select a director";
    }

    if (
      movie.actorIds.length === 0
    ) {
      return "Please select at least one actor";
    }

    if (
      movie.posterPath &&
      movie.posterPath.length > 500
    ) {
      return "Poster URL cannot exceed 500 characters";
    }

    return "";
  }

  

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      await updateMovie(
        id,
        {
          title: movie.title.trim(),

          description:
            movie.description.trim(),

          releaseDate:
            movie.releaseDate,

          duration:
            Number(movie.duration),

          genre:
            movie.genre.trim(),

          language:
            movie.language.trim(),

          rating:
            Number(movie.rating),

          posterPath:
            movie.posterPath.trim()
              ? movie.posterPath.trim()
              : null,

          trailerId:
            movie.trailerId.trim(),

          directorId:
            Number(movie.directorId),
        },
        movie.actorIds
      );

      alert(
        "Movie updated successfully!",
      );

      router.push("/movies");
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ||
          "Failed to update movie.",
      );
    }
  }

 

  if (loading) {
    return <p>Loading...</p>;
  }

  if (
    !user ||
    (
      user.role !== "ADMIN" &&
      user.role !== "EDITOR"
    )
  ) {
    return null;
  }

  
  return (
    <div>
      <h1>Edit Movie</h1>

      <button
        onClick={() =>
          router.push("/")
        }
      >
        Home
      </button>

      <button
        onClick={() =>
          router.push("/movies")
        }
      >
        Movies List
      </button>

      <br />
      <br />

      {error && <p>{error}</p>}

      <form
        onSubmit={handleSubmit}
      >
        <label>
          Title
        </label>

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

        <label>
          Description
        </label>

        <br />

        <textarea
          maxLength={2000}
          value={movie.description}
          onChange={(e) =>
            setMovie({
              ...movie,
              description:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>
          Release Date
        </label>

        <br />

        <input
          type="date"
          value={movie.releaseDate}
          max={
            new Date()
              .toISOString()
              .split("T")[0]
          }
          onChange={(e) =>
            setMovie({
              ...movie,
              releaseDate:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>
          Duration in Minutes
        </label>

        <br />

        <input
          type="number"
          min={30}
          max={500}
          value={movie.duration}
          onChange={(e) =>
            setMovie({
              ...movie,
              duration:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>
          Genre
        </label>

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

        <label>
          Language
        </label>

        <br />

        <input
          type="text"
          maxLength={30}
          value={movie.language}
          onChange={(e) =>
            setMovie({
              ...movie,
              language:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>
          Rating
        </label>

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
              rating:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>
          Poster URL
        </label>

        <br />

        <input
          type="url"
          placeholder="https://example.com/poster.jpg"
          value={movie.posterPath}
          onChange={(e) =>
            setMovie({
              ...movie,
              posterPath:
                e.target.value,
            })
          }
        />

        <br />

        <small>
          Optional. Enter a valid URL for the movie poster.
        </small>

        <br />
        <br />

        {movie.posterPath && (
          <>
            <img
              src={movie.posterPath}
              alt={movie.title}
              width={160}
              height={220}
              style={{
                objectFit: "cover",
                border:
                  "1px solid #ccc",
              }}
            />

            <br />
            <br />
          </>
        )}

        <label>
          YouTube Trailer URL
        </label>

        <br />

        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={movie.trailerId}
          onChange={(e) =>
            setMovie({
              ...movie,
              trailerId:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>
          Director
        </label>

        <br />

        <select
          value={movie.directorId}
          onChange={(e) =>
            setMovie({
              ...movie,
              directorId:
                e.target.value,
            })
          }
        >
          <option value="">
            Select Director
          </option>

          {directors.map(
            (director) => (
              <option
                key={director.id}
                value={director.id}
              >
                {director.name}
              </option>
            ),
          )}
        </select>

        <br />
        <br />

        <label>
          Actors
        </label>

        <br />

        <select
          multiple
          size={5}
          value={movie.actorIds.map(
            String,
          )}
          onChange={(e) => {
            const ids =
              Array.from(
                e.target
                  .selectedOptions,
                (option) =>
                  Number(
                    option.value,
                  ),
              );

            setMovie({
              ...movie,
              actorIds: ids,
            });
          }}
        >
          {actors.map((actor) => (
            <option
              key={actor.id}
              value={actor.id}
            >
              {actor.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <button
          type="submit"
        >
          Update Movie
        </button>
      </form>
    </div>
  );
}
