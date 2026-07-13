"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createMovie } from "@/services/movieService";
import { getActors } from "@/services/actorService";
import { getDirectors } from "@/services/directorService";

export default function CreateMovie() {
  const router = useRouter();

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    releaseDate: "",
    duration: "",
    genre: "",
    language: "",
    rating: "",
    posterUrl: "",
    trailerId: "",
    directorId: "",
    actorIds: [] as number[],
  });

  const [directors, setDirectors] = useState<any[]>([]);

  const [actors, setActors] = useState<any[]>([]);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const directorsData = await getDirectors();

      const actorsData = await getActors();

      setDirectors(directorsData);

      setActors(actorsData);
    }

    loadData();
  }, []);

  function validateForm() {
    const title = movie.title.trim();

    if (!title) return "Title is required";

    if (title.length < 2 || title.length > 100)
      return "Title must be between 2 and 100 characters";

    if (/^\d+$/.test(title)) return "Title cannot contain only numbers";

    if (/(.)\1{5,}/.test(title))
      return "Title contains too many repeated characters";

    const description = movie.description.trim();

    if (!description) return "Description is required";

    if (description.length < 20)
      return "Description must be at least 20 characters";

    if (description.length > 2000)
      return "Description cannot exceed 2000 characters";

    if (!movie.releaseDate) return "Release date is required";

    if (new Date(movie.releaseDate) > new Date())
      return "Release date cannot be in the future";

    if (!movie.duration) return "Duration is required";

    if (Number(movie.duration) < 30)
      return "Duration must be at least 30 minutes";

    if (Number(movie.duration) > 500)
      return "Duration cannot exceed 500 minutes";
    const genre = movie.genre.trim();

    if (!genre) return "Genre is required";

    if (genre.length < 3 || genre.length > 30)
      return "Genre must be between 3 and 30 characters";

    if (!/^[A-Za-z\s-]+$/.test(genre))
      return "Genre can only contain letters, spaces and hyphens";

    const language = movie.language.trim();

    if (!language) return "Language is required";

    if (language.length < 2 || language.length > 30)
      return "Language must be between 2 and 30 characters";

    if (!/^[A-Za-z\s]+$/.test(language))
      return "Language can only contain letters and spaces";

    if (!movie.rating) return "Rating is required";

    if (Number(movie.rating) < 1 || Number(movie.rating) > 10)
      return "Rating must be between 1 and 10";

    if (!movie.posterUrl.trim()) return "Poster URL is required";

    try {
      new URL(movie.posterUrl);
    } catch {
      return "Poster URL must be valid";
    }

    if (!movie.trailerId.trim()) return "Trailer URL is required";

    try {
      new URL(movie.trailerId);
    } catch {
      return "Trailer URL must be valid";
    }

    if (!movie.directorId) return "Please select a director";

    if (movie.actorIds.length === 0) return "Please select at least one actor";

    return "";
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    setError("");

    try {
      await createMovie({
        ...movie,

        title: movie.title.trim(),

        description: movie.description.trim(),

        genre: movie.genre.trim(),

        language: movie.language.trim(),

        posterUrl: movie.posterUrl.trim(),

        trailerId: movie.trailerId.trim(),

        duration: Number(movie.duration),

        rating: Number(movie.rating),

        directorId: Number(movie.directorId),
      });

      alert("Movie Created Successfully!");

      router.push("/movies");
    } catch (error) {
      console.error(error);

      alert("Failed to create movie");
    }
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
        <label>Title</label>
        <br />

        <input
          type="text"
          maxLength={100}
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

        <label>Duration</label>
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
          maxLength={30}
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
          step="0.1"
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

        <label>Poster URL</label>

        <br />

        <input
          type="text"
          value={movie.posterUrl}
          onChange={(e) =>
            setMovie({
              ...movie,

              posterUrl: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>YouTube Trailer URL</label>

        <br />

        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
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
          size={5}
          onChange={(e) => {
            const ids = Array.from(
              e.target.selectedOptions,

              (option) => Number(option.value)
            );

            setMovie({
              ...movie,

              actorIds: ids,
            });
          }}
        >
          {actors.map((actor) => (
            <option key={actor.id} value={actor.id}>
              {actor.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <button type="submit">Create Movie</button>
      </form>
    </div>
  );
}
