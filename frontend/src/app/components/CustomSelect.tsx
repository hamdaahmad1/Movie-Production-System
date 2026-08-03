"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Option {
  value: string;
  label: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setMounted(true), []);

  function updatePosition() {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const clickedButton = buttonRef.current?.contains(target);
      const clickedList = listRef.current?.contains(target);
      if (!clickedButton && !clickedList) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-navy-600 bg-navy-700 px-3 py-2.5 text-left text-sm text-white transition focus:outline-none focus:border-accent"
      >
        <span className={selected ? "text-white" : "text-ink-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-ink-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {mounted &&
        open &&
        createPortal(
          <ul
            ref={listRef}
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              backgroundColor: "#ffffff",
              opacity: 1,
            }}
            className="fixed z-[999] max-h-56 overflow-auto rounded-lg border border-gray-300 py-1.5 shadow-2xl"
          >
            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">
                No options available
              </li>
            )}
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={{
                    backgroundColor:
                      option.value === value ? "#f3f4f6" : "#ffffff",
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                    option.value === value
                      ? "font-semibold text-black"
                      : "text-black"
                  }`}
                >
                  {option.label}
                  {option.value === value && (
                    <span className="text-accent">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}
