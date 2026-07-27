"use client";

function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Reads a video file's duration + aspect ratio in-browser, without uploading it. */
export function probeVideoFile(
  file: File
): Promise<{ duration: string; aspectRatio: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);
    video.src = url;
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        duration: formatDuration(video.duration),
        aspectRatio: video.videoWidth / video.videoHeight || 16 / 9,
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read metadata from ${file.name}.`));
    };
  });
}
