"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createActor } from "@/services/actorService";

export default function CreateActor() {
  const router = useRouter();

  const [actor, setActor] = useState({
    name: "",
    dob: "",
    nationality: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await createActor(actor);

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

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br />
        <input
          type="text"
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
          onChange={(e) =>
            setActor({
              ...actor,
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

        <button type="submit">Create Actor</button>
      </form>
    </div>
  );
}
