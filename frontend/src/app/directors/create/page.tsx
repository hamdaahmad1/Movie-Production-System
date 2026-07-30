"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createDirector } from "@/services/directorService";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import ImageUpload from "@/app/components/ImageUpload";
import { Director } from "@/types/director";

export default function CreateDirector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromMovie = searchParams.get("from") === "movie";
  const { user, loading } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [directors, setDirectors] = useState<Director[]>([]);

  const [director, setDirector] = useState({
    name: "",
    dob: "",
    nationality: "",
    biography: "",
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
    const name = director.name.trim();
    const nationality = director.nationality.trim();
    const biography = director.biography.trim();

    if (!name) {
      return "Name is required";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (name.length > 100) {
      return "Name cannot exceed 100 characters";
    }

    if (!/^[A-Za-z\s.'-]+$/.test(name)) {
      return "Name can only contain letters, spaces, apostrophes, hyphens and periods";
    }

    if (/(.)\1{4,}/.test(name)) {
      return "Name contains too many repeated characters";
    }

    const existingDirector = directors.find(
      (d) => d.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (existingDirector) {
      return "A director with this name already exists";
    }

    if (!director.dob) {
      return "Date of birth is required";
    }

    const dob = new Date(director.dob);

    if (dob > new Date()) {
      return "Date of birth cannot be in the future";
    }

    if (!nationality) {
      return "Nationality is required";
    }

    if (nationality.length < 2) {
      return "Nationality must be at least 2 characters long";
    }

    if (nationality.length > 50) {
      return "Nationality cannot exceed 50 characters";
    }

    if (!/^[A-Za-z\s]+$/.test(nationality)) {
      return "Nationality can only contain letters and spaces";
    }

    if (!biography) {
      return "Biography is required";
    }

    if (biography.length < 20) {
      return "Biography must be at least 20 characters long";
    }

    if (biography.length > 1000) {
      return "Biography cannot exceed 1000 characters";
    }

    if (image) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(image.type)) {
        return "Only JPG,JPEG, PNG and WEBP  images are allowed";
      }

      if (image.size > 5 * 1024 * 1024) {
        return "Image size cannot exceed 5MB";
      }
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

    const toastId = toast.loading("Creating Director...");

    try {
      const formData = new FormData();

      formData.append("name", director.name.trim());

      formData.append("dob", director.dob);

      formData.append("biography", director.biography.trim());

      formData.append("nationality", director.nationality.trim());

      if (image) {
        formData.append("image", image);
      }

      const createdDirector = await createDirector(formData);

      toast.dismiss(toastId);

      toast.success("Director created successfully!");

      if (fromMovie) {
        sessionStorage.setItem("newDirectorId", String(createdDirector.id));

        router.push("/movies/create");
      } else {
        router.push("/directors");
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to create director."
      );
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
      <h1>Create Director</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <button onClick={() => router.push("/directors")}>Directors List</button>
      {fromMovie && (
        <>
          <button type="button" onClick={() => router.push("/movies/create")}>
            ← Continue Creating Movie
          </button>

          <br />
          <br />
        </>
      )}

      <br />
      <br />

      <form onSubmit={handleSubmit}>
        <label>Name</label>

        <br />

        <input
          type="text"
          maxLength={100}
          value={director.name}
          onChange={(e) =>
            setDirector({
              ...director,
              name: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Date of Birth</label>

        <br />

        <input
          type="date"
          value={director.dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setDirector({
              ...director,
              dob: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Nationality</label>

        <br />

        <input
          type="text"
          maxLength={50}
          value={director.nationality}
          onChange={(e) =>
            setDirector({
              ...director,
              nationality: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Biography</label>

        <br />

        <textarea
          maxLength={1000}
          rows={5}
          value={director.biography}
          onChange={(e) =>
            setDirector({
              ...director,
              biography: e.target.value,
            })
          }
        />

        <br />
        <br />

        <ImageUpload
          label="Director Image"
          file={image}
          preview={imagePreview}
          setFile={setImage}
          setPreview={setImagePreview}
          alt="Director Image"
          removeButtonText="Remove Image"
        />
        <br />
        <br />

        <button type="submit">Create Director</button>
      </form>
    </div>
  );
}
