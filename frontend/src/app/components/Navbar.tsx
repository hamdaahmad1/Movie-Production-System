"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const GOLD = "#F4C430";
const CRIMSON = "#C1121F";
const INK = "#05070F";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  const navLinks = user
    ? user.role === "ADMIN"
      ? [
          { href: "/admin", label: "Admin Dashboard" },
          { href: "/admin/users", label: "Users" },
          { href: "/movies", label: "Movies" },
          { href: "/actors", label: "Actors" },
          { href: "/directors", label: "Directors" },
        ]
      : user.role === "EDITOR"
      ? [
          { href: "/editor", label: "Editor Dashboard" },
          { href: "/movies", label: "Movies" },
          { href: "/actors", label: "Actors" },
          { href: "/directors", label: "Directors" },
        ]
      : [
          { href: "/viewer", label: "Viewer Dashboard" },
          { href: "/movies", label: "Movies" },
          { href: "/actors", label: "Actors" },
          { href: "/directors", label: "Directors" },
        ]
    : [
        { href: "/movies", label: "Movies" },
        { href: "/actors", label: "Actors" },
        { href: "/directors", label: "Directors" },
      ];

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

        {/* Desktop Navigation */}
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-lg lg:flex">
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
        </div>

        {/* Right Side */}
        {/* Right Side */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-4">
            {user && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
                {user.role}
              </span>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                  color: INK,
                }}
              >
                Logout
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-navy-950/95 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col space-y-3 px-6 py-5">
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
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${CRIMSON})`,
                    color: INK,
                  }}
                >
                  Logout
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
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
