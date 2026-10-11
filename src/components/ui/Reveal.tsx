"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Fade-up saat elemen masuk viewport. Menghormati prefers-reduced-motion
 * dan tetap menampilkan konten jika JavaScript gagal (SSR dalam keadaan
 * terlihat).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const hideFrame = requestAnimationFrame(() => setHidden(true));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHidden(false);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(hideFrame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${hidden ? "reveal-hidden" : ""} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}