"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createDirector } from "@/services/directorService";

export default function CreateDirector() {
  const router = useRouter();

  const [director, setDirector] = useState({
    name: "",
    dob: "",
    nationality: "",
    biography: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");

  function validateForm() {
    const name = director.name.trim();
    const nationality = director.nationality.trim();
    const biography = director.biography.trim();
    const imageUrl = director.imageUrl.trim();

    // Name
    if (!name) {
      return "Name is required";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (name.length > 100) {
      return "Name cannot exceed 100 characters";
    }

    if (!/^[A-Za-z\s'-]+$/.test(name)) {
      return "Name can only contain letters, spaces, apostrophes and hyphens";
    }

    if (/(.)\1{4,}/.test(name)) {
      return "Name contains too many repeated characters";
    }

    // Date of Birth
    if (!director.dob) {
      return "Date of birth is required";
    }

    const dob = new Date(director.dob);

    if (dob > new Date()) {
      return "Date of birth cannot be in the future";
    }

    // Nationality
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

    // Biography
    if (!biography) {
      return "Biography is required";
    }

    if (biography.length < 20) {
      return "Biography must be at least 20 characters long";
    }

    if (biography.length > 1000) {
      return "Biography cannot exceed 1000 characters";
    }

    // Image URL
    if (!imageUrl) {
      return "Image URL is required";
    }

    try {
      new URL(imageUrl);
    } catch {
      return "Image URL must be valid";
    }

    return "";
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    setError("");

    try {
      await createDirector({
        ...director,
        name: director.name.trim(),
        nationality: director.nationality.trim(),
        biography: director.biography.trim(),
        imageUrl: director.imageUrl.trim(),
      });

      alert("Director created successfully!");

      router.push("/directors");
    } catch (error) {
      console.error(error);

      alert("Failed to create director.");
    }
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

        <label>Image URL</label>

        <br />

        <input
          type="url"
          value={director.imageUrl}
          onChange={(e) =>
            setDirector({
              ...director,
              imageUrl: e.target.value,
            })
          }
        />

        <br />
        <br />

        <button type="submit">Create Director</button>
      </form>
    </div>
  );
}
