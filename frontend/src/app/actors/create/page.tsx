"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createActor } from "@/services/actorService";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import ImageUpload from "@/app/components/ImageUpload";
import CustomSelect from "@/app/components/CustomSelect";


const inputClass =
  "w-full rounded-lg bg-navy-700 border border-navy-600 px-3 py-2.5 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-200";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

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

export default function CreateActor() {
  const router = useRouter();
  const [fromMovie, setFromMovie] = useState(false);

  useEffect(() => {
    setFromMovie(sessionStorage.getItem("returnToMovie") === "true");
  }, []);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const { user, loading } = useAuth();

  const [actor, setActor] = useState({
    name: "",
    dob: "",
    gender: "",
    biography: "",
    nationality: "",
    awards: "",
  });

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

  function validateForm() {
    const name = actor.name.trim();
    const gender = actor.gender.trim();
    const biography = actor.biography.trim();
    const nationality = actor.nationality.trim();
    const awards = Number(actor.awards);

    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters long";
    if (name.length > 100) return "Name cannot exceed 100 characters";
    if (!/^[A-Za-z\s'-]+$/.test(name))
      return "Name can only contain letters, spaces, apostrophes and hyphens";
    if (/(.)\1{4,}/.test(name))
      return "Name contains too many repeated characters";

    if (!actor.dob) return "Date of birth is required";
    const dob = new Date(actor.dob);
    if (dob > new Date()) return "Date of birth cannot be in the future";

    if (!nationality) return "Nationality is required";
    if (nationality.length < 2)
      return "Nationality must be at least 2 characters long";
    if (nationality.length > 50)
      return "Nationality cannot exceed 50 characters";
    if (!/^[A-Za-z\s]+$/.test(nationality))
      return "Nationality can only contain letters and spaces";

    if (!gender) return "Gender is required";
    if (!["Male", "Female", "Other"].includes(gender))
      return "Please select a valid gender";

    if (!biography) return "Biography is required";
    if (biography.length < 20)
      return "Biography must be at least 20 characters long";
    if (biography.length > 1000)
      return "Biography cannot exceed 1000 characters";

    if (actor.awards === "") return "Awards field is required";
    if (isNaN(awards)) return "Awards must be a number";
    if (awards < 0) return "Awards cannot be negative";
    if (awards > 500) return "Awards cannot exceed 500";

    if (image) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(image.type))
        return "Only JPG,JPEG, PNG and WEBP  images are allowed";
      if (image.size > 5 * 1024 * 1024) return "Image size cannot exceed 5MB";
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
    const toastId = toast.loading("Creating actor...");

    try {
      const formData = new FormData();
      formData.append("name", actor.name.trim());
      formData.append("dob", actor.dob);
      formData.append("gender", actor.gender.trim());
      formData.append("biography", actor.biography.trim());
      formData.append("nationality", actor.nationality.trim());
      formData.append("awards", String(Number(actor.awards)));
      if (image) formData.append("image", image);

      const createdActor = await createActor(formData);
      toast.dismiss(toastId);
      toast.success("Actor created successfully!");

      if (fromMovie) {
        sessionStorage.setItem("newActorId", String(createdActor.id));
        sessionStorage.removeItem("returnToMovie");
        router.push("/movies/create");
      } else {
        router.push("/actors");
      }
    } catch (error: any) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Failed to create actor.");
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

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/actors")}
            className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-700"
          >
            ← Actors List
          </button>
          {fromMovie && (
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("returnToMovie");
                router.push("/movies/create");
              }}
              className="rounded-full bg-navy-800 px-4 py-2 text-sm text-white hover:bg-navy-700"
            >
              ← Continue Creating Movie
            </button>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white">Create Actor</h1>
        <p className="mt-1 mb-6 text-sm text-ink-400">
          Add a new actor to the catalog.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-navy-700 bg-navy-800 p-6 shadow-xl shadow-black/20 md:p-8"
        >
          <SectionHeader title="Basic Details" />
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              maxLength={100}
              placeholder="e.g. Meryl Streep"
              value={actor.name}
              onChange={(e) => setActor({ ...actor, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Date of Birth</label>

              <input
                type="date"
                value={actor.dob}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) =>
                  setActor({
                    ...actor,
                    dob: e.target.value,
                  })
                }
                className={`${inputClass} date-input`}
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <CustomSelect
                value={actor.gender}
                onChange={(val) => setActor({ ...actor, gender: val })}
                options={genderOptions}
                placeholder="Select Gender"
              />
            </div>
          </div>

          <hr className="border-navy-700" />

          <SectionHeader title="Background" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nationality</label>
              <input
                type="text"
                maxLength={50}
                placeholder="e.g. American"
                value={actor.nationality}
                onChange={(e) =>
                  setActor({ ...actor, nationality: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Awards</label>
              <input
                type="number"
                min={0}
                max={500}
                value={actor.awards}
                onChange={(e) => setActor({ ...actor, awards: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Biography</label>
            <textarea
              maxLength={1000}
              rows={5}
              placeholder="A short biography..."
              value={actor.biography}
              onChange={(e) =>
                setActor({ ...actor, biography: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <hr className="border-navy-700" />

          <SectionHeader
            title="Photo"
            subtitle="Optional. JPG, PNG or WEBP, up to 5MB."
          />
          <ImageUpload
            label="Actor Image"
            file={image}
            preview={imagePreview}
            setFile={setImage}
            setPreview={setImagePreview}
            alt="Actor Image"
            removeButtonText="Remove Image"
          />

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/actors")}
              className="rounded-full border border-navy-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Create Actor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
