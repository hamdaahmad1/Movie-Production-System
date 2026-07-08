"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getDirector, updateDirector } from "@/services/directorService";

export default function EditDirector() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [director, setDirector] = useState({
    name: "",
    dob: "",
  });

  useEffect(() => {
    async function loadDirector() {
      const data = await getDirector(id);

      setDirector({
        name: data.name,
        dob: data.dob.split("T")[0],
      });
    }

    if (id) {
      loadDirector();
    }
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await updateDirector(id, director);

      alert("Director updated successfully!");

      router.push("/directors");
    } catch (error) {
      console.error(error);
      alert("Failed to update director.");
    }
  }

  return (
    <div>
      <h1>Edit Director</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br />
        <input
          type="text"
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
          onChange={(e) =>
            setDirector({
              ...director,
              dob: e.target.value,
            })
          }
        />

        <br />
        <br />

        <button type="submit">Update Director</button>
      </form>
    </div>
  );
}
