"use client";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 30,
}: StarRatingProps) {
  const displayRating = Math.round(value);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`transition-transform ${
            readOnly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110"
          }`}
        >
          <span
            style={{ fontSize: `${size}px` }}
            className={
              star <= displayRating
                ? "text-yellow-400"
                : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}