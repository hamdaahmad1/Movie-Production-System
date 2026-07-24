"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createDirector } from "@/services/directorService";
import { useAuth } from "@/context/AuthContext";

export default function CreateDirector() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [image, setImage] = useState<File | null>(null);

  const [director, setDirector] = useState({
    name: "",
    dob: "",
    nationality: "",
    biography: "",
  });

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
      setError(validationError);
      return;
    }

    setError("");

    try {
      const formData = new FormData();

      formData.append("name", director.name.trim());

      formData.append("dob", director.dob);

      formData.append("biography", director.biography.trim());

      formData.append("nationality", director.nationality.trim());

      if (image) {
        formData.append("image", image);
      }

      await createDirector(formData);
      alert("Director created successfully!");

      router.push("/directors");
    } catch (error: any) {
      console.error(error);

      setError(error.message || "Failed to create director.");
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

      <br />
      <br />

      {error && <p>{error}</p>}

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

        <label>Director Image</label>

        <br />

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setImage(file);
            }
          }}
        />

        <br />
        <br />

        {image && (
          <>
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              width={160}
              height={220}
              style={{
                objectFit: "cover",
              }}
            />

            <br />
            <br />

            <button
              type="button"
              onClick={() => {
                setImage(null);
              }}
            >
              Remove Image
            </button>
          </>
        )}

        <br />
        <br />

        <button type="submit">Create Director</button>
      </form>
    </div>
  );
}
