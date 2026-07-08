import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Movie Management System</h1>

      <Link href="/movies">Movies</Link>
      <br />
      <Link href="/actors">Actors</Link>
      <br />
      <Link href="/directors">Directors</Link>
    </div>
  );
}
