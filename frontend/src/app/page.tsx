"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
});

// Palette — same as the rest of the product.
const INK = "#0B1120"; // page background / overlay base
const GOLD = "#E8B84B"; // marquee accent
const PAPER = "#F3EFE7"; // primary text
const MUTED = "#8B90A0"; // secondary text

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: INK }}
      >
        <p
          className={`${montserrat.className} text-xs tracking-[0.3em]`}
          style={{ color: MUTED }}
        >
          LOADING...
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: INK }}
    >
      {/* Poster wall background image — tiled at native size instead of stretched */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/hero-posters.jpg')",
          backgroundSize: "620px auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          filter: "saturate(1.15) contrast(1.08) brightness(0.85)",
        }}
      />

      {/* Very light overall wash, just to unify tone — posters stay clearly visible */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `${INK}33` }}
      />

      {/* Focused vignette behind the text block only, like the reference */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 900px 500px at 50% 55%, ${INK}CC 0%, ${INK}88 40%, transparent 70%)`,
        }}
      />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* marquee lights */}
        <div className="mb-8 flex justify-center gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: GOLD,
                animation: `marquee-pulse 2.4s ease-in-out ${
                  i * 0.08
                }s infinite`,
              }}
            />
          ))}
        </div>

        <span
          className={`${montserrat.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.2em]`}
          style={{
            borderColor: `${GOLD}4D`,
            backgroundColor: `${GOLD}1A`,
            color: GOLD,
          }}
        >
          MOVIEVERSE
        </span>

        <h1
          className={`${montserrat.className} mt-6 max-w-4xl text-4xl uppercase leading-[1.05] tracking-tight sm:text-6xl`}
          style={{ color: PAPER, fontWeight: 600 }}
        >
          Discover <span style={{ fontWeight: 900 }}>Movies</span>, Actors{" "}
          <span style={{ color: GOLD, fontWeight: 700 }}>&</span>{" "}
          <span style={{ fontWeight: 900 }}>Directors</span>
        </h1>

        <p
          className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed"
          style={{ color: MUTED }}
        >
          The ultimate destination for movie lovers. Register or log in to
          explore the full universe.
        </p>

        <div className="mt-9 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full px-7 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{ backgroundColor: PAPER, color: INK }}
          >
            Register
          </Link>
          <Link
            href="/login"
            className="rounded-full border px-7 py-3 text-sm font-semibold transition hover:opacity-80"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: PAPER }}
          >
            Login
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee-pulse {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
