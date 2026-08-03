"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/actors", label: "Actors" },
  { href: "/directors", label: "Directors" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="flex items-center gap-3">
          {/* Desktop */}

          <div className="hidden md:flex items-center gap-4">
            {user && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
                {user.role}
              </span>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-red-500/30"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-ink-200 hover:border-accent hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 hover:-translate-y-0.5 hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}

          <button
            className="md:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy-950/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-5 space-y-3">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-accent to-accent-2 text-white"
                      : "text-ink-200 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-ink-200 hover:bg-white/10"
              >
                Admin Dashboard
              </Link>
            )}

            {user?.role === "EDITOR" && (
              <Link
                href="/editor"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-ink-200 hover:bg-white/10"
              >
                Editor Dashboard
              </Link>
            )}

            {user?.role === "VIEWER" && (
              <Link
                href="/viewer"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-ink-200 hover:bg-white/10"
              >
                Viewer Dashboard
              </Link>
            )}

            {user && (
              <div className="pt-2">
                <div className="mb-3 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-accent">
                  {user.role}
                </div>

                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await handleLogout();
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            )}

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-center text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-4 py-3 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
