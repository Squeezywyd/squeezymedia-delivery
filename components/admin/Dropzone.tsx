"use client";

import { useRef, useState, type DragEvent } from "react";

interface DropzoneProps {
  label: string;
  accept: string;
  multiple?: boolean;
  required?: boolean;
  /** Filename(s) already selected/uploaded, shown as a status line. */
  currentLabel?: string;
  onFiles: (files: File[]) => void;
}

export default function Dropzone({
  label,
  accept,
  multiple,
  required,
  currentLabel,
  onFiles,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setSelectedNames(files.map((f) => f.name));
    onFiles(files);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  const status = selectedNames.length > 0 ? selectedNames.join(", ") : currentLabel;

  return (
    <div>
      <label className="mb-2 block text-xs tracking-[0.2em] text-white/50 uppercase">
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`cursor-pointer border border-dashed px-4 py-6 text-center text-sm transition ${
          dragOver
            ? "border-brand bg-brand/5 text-white"
            : "border-white/20 text-white/50 hover:border-white/40"
        }`}
      >
        {status ? (
          <span className="break-all text-white/80">{status}</span>
        ) : (
          <span>Drop file{multiple ? "s" : ""} here or click to browse</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
