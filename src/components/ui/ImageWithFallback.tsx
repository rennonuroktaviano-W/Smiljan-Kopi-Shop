"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/images/menu/coffee-beans.svg";

/**
 * next/image dengan fallback jika gambar gagal dimuat: tangani gambar
 * hilang dengan pengganti yang masuk akal.
 */
export default function ImageWithFallback({
  src,
  alt,
  ...props
}: React.ComponentProps<typeof Image>) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc(FALLBACK_IMAGE)}
    />
  );
}