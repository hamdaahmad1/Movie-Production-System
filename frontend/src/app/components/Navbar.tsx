"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/actors", label: "Actors" },
  { href: "/directors", label: "Directors" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-xl shadow-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-purple-500 to-accent-2 text-lg font-bold text-white shadow-lg shadow-accent/40 transition duration-300 group-hover:scale-110">
            🎬
          </div>

          <div>
            <p className="text-xl font-bold tracking-wide text-white">
              MovieVerse
            </p>
            <p className="text-xs text-ink-300">Movie Management System</p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-lg md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/30"
                    : "text-ink-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-full px-5 py-2 text-sm font-semibold text-ink-200 transition hover:bg-white/10 hover:text-white"
            >
              Admin
            </Link>
          )}

          {user?.role === "EDITOR" && (
            <Link
              href="/editor"
              className="rounded-full px-5 py-2 text-sm font-semibold text-ink-200 transition hover:bg-white/10 hover:text-white"
            >
              Editor
            </Link>
          )}

          {user?.role === "VIEWER" && (
            <Link
              href="/viewer"
              className="rounded-full px-5 py-2 text-sm font-semibold text-ink-200 transition hover:bg-white/10 hover:text-white"
            >
              Viewer
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent md:block">
              {user.role}
            </span>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-red-500/30"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-ink-200 transition hover:border-accent hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition duration-300 hover:-translate-y-0.5 hover:scale-105"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
