"use client";

import FallbackImage from "@/app/components/FallbackImage";
import { useId, useState } from "react";

interface AdminImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the selected image."));
    };

    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function AdminImageField({
  label,
  value,
  onChange,
  helperText = "Choose an image file. It will be stored in base64 so you can manage it directly from admin.",
}: AdminImageFieldProps) {
  const inputId = useId();
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Please choose an image smaller than 4 MB.");
      event.target.value = "";
      return;
    }

    try {
      const nextValue = await readFileAsDataUrl(file);
      onChange(nextValue);
      setFileName(file.name);
      setError("");
    } catch (readError) {
      setError(
        readError instanceof Error
          ? readError.message
          : "Unable to process the selected image.",
      );
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block font-bold text-gray-700">{label}</label>
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <FallbackImage
              src={value || "/logo.jpeg"}
              alt={label}
              fill
              className="object-cover"
              fallbackSrc="/logo.jpeg"
            />
          </div>

          <div className="flex-1">
            <input
              id={inputId}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              <label
                htmlFor={inputId}
                className="inline-flex cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Select image
              </label>
              {value ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setFileName("");
                    setError("");
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                >
                  Remove image
                </button>
              ) : null}
            </div>

            <p className="mt-3 text-sm text-gray-500">{helperText}</p>
            {fileName ? (
              <p className="mt-2 text-sm text-gray-600">Selected: {fileName}</p>
            ) : null}
            {error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
