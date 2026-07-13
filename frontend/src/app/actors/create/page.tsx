"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createActor } from "@/services/actorService";

export default function CreateActor() {
  const router = useRouter();

  const [actor, setActor] = useState({
    name: "",
    dob: "",
    gender: "",
    biography: "",
    nationality: "",
    awards: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");

  function validateForm() {
    const name = actor.name.trim();
    const gender = actor.gender.trim();
    const biography = actor.biography.trim();
    const imageUrl = actor.imageUrl.trim();
    const awards = Number(actor.awards);
    const nationality = actor.nationality.trim();

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
    if (!actor.dob) {
      return "Date of birth is required";
    }

    const dob = new Date(actor.dob);
    const today = new Date();

    if (dob > today) {
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

    // Gender
    if (!gender) {
      return "Gender is required";
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      return "Please select a valid gender";
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

    // Awards
    if (actor.awards === "") {
      return "Awards field is required";
    }

    if (isNaN(awards)) {
      return "Awards must be a number";
    }

    if (awards < 0) {
      return "Awards cannot be negative";
    }

    if (awards > 500) {
      return "Awards cannot exceed 500";
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
      await createActor({
        ...actor,

        name: actor.name.trim(),

        gender: actor.gender.trim(),

        biography: actor.biography.trim(),

        awards: Number(actor.awards),

        imageUrl: actor.imageUrl.trim(),
        nationality: actor.nationality.trim(),
      });

      alert("Actor created successfully!");

      router.push("/actors");
    } catch (error) {
      console.error(error);

      alert("Failed to create actor.");
    }
  }

  return (
    <div>
      <h1>Create Actor</h1>

      <button onClick={() => router.push("/")}>Home</button>

      <button onClick={() => router.push("/actors")}>Actors List</button>

      <br />
      <br />

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>

        <br />

        <input
          type="text"
          maxLength={100}
          value={actor.name}
          onChange={(e) =>
            setActor({
              ...actor,
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
          value={actor.dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setActor({
              ...actor,

              dob: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Gender</label>

        <br />

        <select
          value={actor.gender}
          onChange={(e) =>
            setActor({
              ...actor,
              gender: e.target.value,
            })
          }
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <br />
        <br />

        <label>Nationality</label>

        <br />

        <input
          type="text"
          maxLength={50}
          value={actor.nationality}
          onChange={(e) =>
            setActor({
              ...actor,
              nationality: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Biography</label>

        <br />

        <textarea
          value={actor.biography}
          onChange={(e) =>
            setActor({
              ...actor,

              biography: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Awards</label>

        <br />

        <input
          type="number"
          min={0}
          max={500}
          value={actor.awards}
          onChange={(e) =>
            setActor({
              ...actor,
              awards: e.target.value,
            })
          }
        />

        <br />
        <br />

        <label>Image URL</label>

        <br />

        <input
          type="url"
          value={actor.imageUrl}
          onChange={(e) =>
            setActor({
              ...actor,
              imageUrl: e.target.value,
            })
          }
        />

        <br />
        <br />

        <button type="submit">Create Actor</button>
      </form>
    </div>
  );
}
