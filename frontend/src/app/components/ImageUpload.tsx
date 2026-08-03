"use client";

import { useRef } from "react";

interface ImageUploadProps {
  label: string;
  file: File | null;
  preview: string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPreview: React.Dispatch<React.SetStateAction<string>>;
  alt: string;
  accept?: string;
  helperText?: string;
  removeButtonText?: string;
  width?: number;
  height?: number;
}

export default function ImageUpload({
  label,
  file,
  preview,
  setFile,
  setPreview,
  alt,
  accept = "image/png,image/jpeg,image/webp",
  helperText = "Optional. JPG, PNG, WEBP only. Max size 5MB.",
  removeButtonText = "Remove Image",
  width = 160,
  height = 220,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleRemove = () => {
    setFile(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-200">{label}</label>

      <div className="flex items-start gap-4">
        {preview ? (
          <img
            src={preview}
            alt={alt}
            width={width}
            height={height}
            className="h-[130px] w-[100px] flex-shrink-0 rounded-xl border border-navy-600 object-cover"
          />
        ) : (
          <div className="flex h-[130px] w-[100px] flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-navy-600 text-center text-[11px] text-ink-400">
            No image
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-fit rounded-full bg-navy-700 px-4 py-2 text-xs font-medium text-white hover:bg-navy-600"
          >
            {preview ? "Change Image" : "Upload Image"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {helperText && <p className="text-[11px] text-ink-400">{helperText}</p>}

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="w-fit rounded-full bg-rose-500/20 px-4 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/30"
            >
              {removeButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}