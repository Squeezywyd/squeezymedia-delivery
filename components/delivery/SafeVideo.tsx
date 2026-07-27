"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type VideoHTMLAttributes,
} from "react";

interface SafeVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  fallbackLabel?: string;
  fallbackClassName?: string;
  /** Ms to wait for metadata before treating a silently-stalled source as
   * failed. Some browsers only fire `error` for network failures (404s,
   * CORS) — a URL that returns 200 but isn't actually playable video can
   * just hang forever with no error event, so a timeout backstop is needed
   * too. */
  stallTimeoutMs?: number;
}

/** A <video> that shows a graceful fallback instead of a broken/stuck player when the source is missing, fails, or isn't actually playable. */
const SafeVideo = forwardRef<HTMLVideoElement, SafeVideoProps>(
  (
    {
      fallbackLabel = "This clip is unavailable right now.",
      fallbackClassName,
      className,
      stallTimeoutMs = 10000,
      onError,
      onLoadedMetadata,
      src,
      ...props
    },
    forwardedRef
  ) => {
    const [failed, setFailed] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      setFailed(false);
      timerRef.current = setTimeout(() => setFailed(true), stallTimeoutMs);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [src, stallTimeoutMs]);

    if (failed) {
      return (
        <div
          className={
            fallbackClassName ??
            `flex h-full w-full items-center justify-center bg-black/60 px-6 text-center text-sm tracking-wide text-white/50 ${className ?? ""}`
          }
        >
          {fallbackLabel}
        </div>
      );
    }

    return (
      <video
        ref={forwardedRef}
        src={src}
        className={className}
        onError={(e) => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setFailed(true);
          onError?.(e);
        }}
        onLoadedMetadata={(e) => {
          if (timerRef.current) clearTimeout(timerRef.current);
          onLoadedMetadata?.(e);
        }}
        {...props}
      />
    );
  }
);

SafeVideo.displayName = "SafeVideo";

export default SafeVideo;
