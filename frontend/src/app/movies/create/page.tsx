"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createMovie } from "@/services/movieService";
import { getDirectors } from "@/services/directorService";
import { getActors } from "@/services/actorService";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import ImageUpload from "@/app/components/ImageUpload";
import CustomSelect from "@/app/components/CustomSelect";
import StarRating from "@/app/components/StarRating";

const inputClass =
  "w-full rounded-lg bg-navy-700 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-200";
const secondaryBtn =
  "rounded-full bg-navy-700 px-4 py-2 text-xs font-medium text-white hover:bg-navy-600";

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 pt-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function CreateMovie() {
  const router = useRouter();
  const [poster, setPoster] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [selectedActorId, setSelectedActorId] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);

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

  useEffect(() => {
    if (!draftLoaded) return;
    sessionStorage.setItem("movieDraft", JSON.stringify(movie));
  }, [movie, draftLoaded]);

  const [directors, setDirectors] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);

  useEffect(() => {
    const draft = sessionStorage.getItem("movieDraft");
    if (draft) setMovie(JSON.parse(draft));
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    const newDirectorId = sessionStorage.getItem("newDirectorId");
    if (!newDirectorId) return;

    setMovie((prev) => ({ ...prev, directorId: newDirectorId }));
    sessionStorage.removeItem("newDirectorId");
    loadData();
  }, []);

  useEffect(() => {
    const newActorId = sessionStorage.getItem("newActorId");
    if (!newActorId) return;

    const id = Number(newActorId);
    setMovie((prev) => ({
      ...prev,
      actorIds: prev.actorIds.includes(id)
        ? prev.actorIds
        : [...prev.actorIds, id],
    }));
    sessionStorage.removeItem("newActorId");
    loadData();
  }, []);

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

  async function loadData() {
    try {
      const directorsData = await getDirectors();
      const actorsData = await getActors();
      setDirectors(directorsData.data || directorsData);
      setActors(actorsData.data || actorsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load directors and actors");
    }
  }

  useEffect(() => {
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

    if (!title) return "Movie title is required";
    if (title.length < 2)
      return "Movie title must be at least 2 characters long";
    if (title.length > 150) return "Movie title cannot exceed 150 characters";

    if (!description) return "Description is required";
    if (description.length < 20)
      return "Description must be at least 20 characters long";
    if (description.length > 2000)
      return "Description cannot exceed 2000 characters";

    if (!movie.releaseDate) return "Release date is required";
    const releaseDate = new Date(movie.releaseDate);
    if (releaseDate > new Date()) return "Release date cannot be in the future";

    if (!movie.duration) return "Duration is required";
    if (isNaN(duration)) return "Duration must be a number";
    if (duration < 30) return "Duration must be at least 30 minutes";
    if (duration > 500) return "Duration cannot exceed 500 minutes";

    if (!genre) return "Genre is required";
    if (genre.length < 3) return "Genre must be at least 3 characters long";
    if (genre.length > 50) return "Genre cannot exceed 50 characters";

    if (!language) return "Language is required";
    if (language.length < 2)
      return "Language must be at least 2 characters long";
    if (language.length > 30) return "Language cannot exceed 30 characters";

    if (!movie.rating) return "Rating is required";
    if (isNaN(rating)) return "Rating must be a number";
    if (rating < 1 || rating > 5) return "Rating must be between 1 and 5";

    if (!trailerId) return "Trailer URL is required";
    if (!movie.directorId) return "Director is required";
    if (movie.actorIds.length === 0)
      return "At least one actor must be selected";

    if (poster) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(poster.type))
        return "Only JPG, PNG and WEBP images are allowed";
      if (poster.size > 5 * 1024 * 1024) return "Image size cannot exceed 5MB";
    }
    if (banner) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(banner.type))
        return "Only JPG, PNG and WEBP banner images are allowed";

      if (banner.size > 5 * 1024 * 1024)
        return "Banner image size cannot exceed 5MB";
    }

    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const toastId = toast.loading("Creating movie...");
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
      movie.actorIds.forEach((id) => formData.append("actorIds", String(id)));
      if (poster) formData.append("poster", poster);

      if (banner) formData.append("banner", banner);

      await createMovie(formData);
      sessionStorage.removeItem("movieDraft");
      toast.dismiss(toastId);
      toast.success("Movie created successfully!");
      router.push("/movies");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create movie.");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-ink-200">
        Loading...
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return null;
  }

  const directorOptions = directors.map((d) => ({
    value: String(d.id),
    label: d.name,
  }));
  const actorOptions = actors
    .filter((actor) => !movie.actorIds.includes(actor.id))
    .map((a) => ({ value: String(a.id), label: a.name }));

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          onClick={() => router.push("/movies")}
          className="mb-6 rounded-full bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-700"
        >
          ← Movies List
        </button>

        <h1 className="text-2xl font-bold text-white">Create Movie</h1>
        <p className="mt-1 mb-6 text-sm text-ink-400">
          Fill in the details below to add a new title to the catalog.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-navy-700 bg-navy-800 p-6 shadow-xl shadow-black/20 md:p-8"
        >
          <SectionHeader title="Basic Details" />
          <div>
            <label className={labelClass}>Movie Title</label>
            <input
              type="text"
              maxLength={150}
              placeholder="e.g. Interstellar"
              value={movie.title}
              onChange={(e) => setMovie({ ...movie, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={5}
              maxLength={2000}
              placeholder="A short synopsis of the movie..."
              value={movie.description}
              onChange={(e) =>
                setMovie({ ...movie, description: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Genre</label>
              <input
                type="text"
                maxLength={50}
                placeholder="e.g. Sci-Fi"
                value={movie.genre}
                onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Language</label>
              <input
                type="text"
                maxLength={30}
                placeholder="e.g. English"
                value={movie.language}
                onChange={(e) =>
                  setMovie({ ...movie, language: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <hr className="border-navy-700" />

          <SectionHeader title="Release & Runtime" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Release Date</label>
              <input
                type="date"
                value={movie.releaseDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setMovie({ ...movie, releaseDate: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Duration (minutes)</label>
              <input
                type="number"
                min={30}
                max={500}
                placeholder="e.g. 148"
                value={movie.duration}
                onChange={(e) =>
                  setMovie({ ...movie, duration: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Rating</label>

              <div className="mt-2">
                <StarRating
                  value={Number(movie.rating)}
                  onChange={(rating) =>
                    setMovie({
                      ...movie,
                      rating: rating.toString(),
                    })
                  }
                />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Selected Rating: {movie.rating || "0"} / 5
              </p>
            </div>

            <div>
              <label className={labelClass}>YouTube Trailer URL</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={movie.trailerId}
                onChange={(e) =>
                  setMovie({ ...movie, trailerId: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <hr className="border-navy-700" />

          <SectionHeader
            title="Poster"
            subtitle="Optional. JPG, PNG or WEBP, up to 5MB."
          />
          <ImageUpload
            label="Movie Poster"
            file={poster}
            preview={imagePreview}
            setFile={setPoster}
            setPreview={setImagePreview}
            alt="Movie Poster"
            removeButtonText="Remove Poster"
          />

          <hr className="border-navy-700" />

          <SectionHeader
            title="Banner"
            subtitle="Optional. Used as the hero background on the movie details page."
          />

          <ImageUpload
            label="Movie Banner"
            file={banner}
            preview={bannerPreview}
            setFile={setBanner}
            setPreview={setBannerPreview}
            alt="Movie Banner"
            removeButtonText="Remove Banner"
          />

          <hr className="border-navy-700" />

          <SectionHeader title="Director" />
          <div>
            <CustomSelect
              value={movie.directorId}
              onChange={(val) => setMovie({ ...movie, directorId: val })}
              options={directorOptions}
              placeholder="Select Director"
            />

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-xs text-ink-400">
                Don't see the director you need?
              </p>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem("returnToMovie", "true");
                  router.push("/directors/create");
                }}
                className={secondaryBtn}
              >
                + Create New Director
              </button>
            </div>
          </div>

          <hr className="border-navy-700" />

          <SectionHeader title="Cast" subtitle="Add at least one actor." />
          <div>
            <div className="flex flex-wrap gap-2">
              <CustomSelect
                value={selectedActorId}
                onChange={(val) => setSelectedActorId(val)}
                options={actorOptions}
                placeholder="Select an actor"
                className="flex-1 min-w-[160px]"
              />

              <button
                type="button"
                onClick={() => {
                  if (!selectedActorId) return;
                  const actorId = Number(selectedActorId);
                  setMovie((prev) => ({
                    ...prev,
                    actorIds: prev.actorIds.includes(actorId)
                      ? prev.actorIds
                      : [...prev.actorIds, actorId],
                  }));
                  setSelectedActorId("");
                }}
                className={secondaryBtn}
              >
                Add Actor
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-xs text-ink-400">
                Don't see the actor you need?
              </p>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem("returnToMovie", "true");
                  router.push("/actors/create");
                }}
                className={secondaryBtn}
              >
                + Create New Actor
              </button>
            </div>

            {movie.actorIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.actorIds.map((actorId) => {
                  const actor = actors.find((a) => a.id === actorId);
                  if (!actor) return null;

                  return (
                    <span
                      key={actor.id}
                      className="flex items-center gap-2 rounded-full bg-navy-700 py-1.5 pl-3 pr-2 text-xs font-medium text-white"
                    >
                      {actor.name}
                      <button
                        type="button"
                        onClick={() =>
                          setMovie((prev) => ({
                            ...prev,
                            actorIds: prev.actorIds.filter(
                              (id) => id !== actor.id
                            ),
                          }))
                        }
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-navy-600 text-[10px] hover:bg-rose-500"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/movies")}
              className="rounded-full border border-navy-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Create Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
