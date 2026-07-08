"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getMovie, updateMovie } from "@/services/movieService";
import { getActors } from "@/services/actorService";
import { getDirectors } from "@/services/directorService";

export default function EditMovie() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

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
      try {
        const movieData = await getMovie(id);
        const directorsData = await getDirectors();
        const actorsData = await getActors();

        setDirectors(directorsData);
        setActors(actorsData);

        setMovie({
          title: movieData.title,
          release_year: movieData.release_year,
          duration: movieData.duration,
          genre: movieData.genre,
          rating: movieData.rating,
          directorId: movieData.director.id,
          actorIds: movieData.actors.map((actor: any) => actor.id),
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await updateMovie(id, movie);

      alert("Movie Updated Successfully!");

      router.push("/movies");
    } catch (error) {
      console.error(error);
      alert("Update Failed!");
    }
  }

  return (
    <div>
      <h1>Edit Movie</h1>

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
          value={movie.actorIds.map(String)}
          onChange={(e) => {
            const selectedActors = Array.from(
              e.target.selectedOptions,
              (option) => Number(option.value)
            );

            setMovie({
              ...movie,
              actorIds: selectedActors,
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

        <button type="submit">Update Movie</button>
      </form>
    </div>
  );
}
