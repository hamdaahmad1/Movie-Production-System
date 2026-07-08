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
    release_year: 0,
    duration: 0,
    genre: "",
    rating: 0,
    directorId: 0,
    actorIds: [] as number[],
  });

  const [directors, setDirectors] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const directorsData = await getDirectors();
      setDirectors(directorsData);

      const actorsData = await getActors();
      setActors(actorsData);
    }

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createMovie(movie);

    alert("Movie Created Successfully!");

    router.push("/movies");
  };

  return (
    <div>
      <h1>Create Movie</h1>

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <br />
        <input
          type="text"
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

        <label>Release Year</label>
        <br />
        <input
          type="number"
          value={movie.release_year}
          onChange={(e) =>
            setMovie({
              ...movie,
              release_year: Number(e.target.value),
            })
          }
        />
        <br />
        <br />

        <label>Duration</label>
        <br />
        <input
          type="number"
          value={movie.duration}
          onChange={(e) =>
            setMovie({
              ...movie,
              duration: Number(e.target.value),
            })
          }
        />
        <br />
        <br />

        <label>Genre</label>
        <br />
        <input
          type="text"
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

        <label>Rating</label>
        <br />
        <input
          type="number"
          step="0.1"
          value={movie.rating}
          onChange={(e) =>
            setMovie({
              ...movie,
              rating: Number(e.target.value),
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
              directorId: Number(e.target.value),
            })
          }
        >
          <option value={0}>Select Director</option>

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
            const selectedIds = Array.from(e.target.selectedOptions, (option) =>
              Number(option.value)
            );

            setMovie({
              ...movie,
              actorIds: selectedIds,
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
