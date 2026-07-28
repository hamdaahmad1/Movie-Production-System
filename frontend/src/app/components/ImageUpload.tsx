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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <label>{label}</label>

      <br />

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />

      <br />
      <br />

      {helperText && <small>{helperText}</small>}

      {preview && (
        <>
          <br />
          <br />

          <img
            src={preview}
            alt={alt}
            width={width}
            height={height}
            style={{
              objectFit: "cover",
            }}
          />

          <br />
          <br />

          <button type="button" onClick={handleRemove}>
            {removeButtonText}
          </button>
        </>
      )}

      <br />
      <br />
    </>
  );
}
