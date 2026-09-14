"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Music, Sparkles, Volume2, ShieldAlert } from "lucide-react";

interface ProductImageProps {
  src?: string | string[];
  alt: string;
  className?: string;
  containerClassName?: string;
  category?: string;
  priority?: boolean;
}

/**
 * Clean and normalize image URLs to prevent mixed-content blocks,
 * missing leading slashes, unencoded characters, or invalid protocols.
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";

  let cleaned = url.trim();
  if (!cleaned) return "";

  // Handle Base64 Data URIs directly
  if (cleaned.startsWith("data:image/") || cleaned.startsWith("data:")) {
    return cleaned;
  }

  // Handle Protocol-relative URLs (//example.com/image.jpg)
  if (cleaned.startsWith("//")) {
    cleaned = `https:${cleaned}`;
  }

  // Convert http:// to https:// to fix Mixed Content blocking on HTTPS sites (iOS Safari / Mobile Chrome)
  if (cleaned.startsWith("http://")) {
    cleaned = cleaned.replace(/^http:\/\//i, "https://");
  }

  // Handle relative paths missing leading slash (e.g., "uploads/my-pic.jpg" or "media/bg.jpg")
  if (
    !cleaned.startsWith("http://") &&
    !cleaned.startsWith("https://") &&
    !cleaned.startsWith("/") &&
    !cleaned.startsWith("data:")
  ) {
    cleaned = `/${cleaned}`;
  }

  // Fix unencoded spaces or special characters in URL
  try {
    // If it's a full URL
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      const parsed = new URL(cleaned);
      // Encode path part if not already encoded
      parsed.pathname = parsed.pathname.split("/").map((segment) => {
        try {
          return decodeURIComponent(segment) === segment ? encodeURIComponent(segment) : segment;
        } catch {
          return encodeURIComponent(segment);
        }
      }).join("/");
      return parsed.toString();
    } else if (cleaned.startsWith("/")) {
      return cleaned.split("/").map((segment) => {
        try {
          return decodeURIComponent(segment) === segment ? encodeURIComponent(segment) : segment;
        } catch {
          return encodeURIComponent(segment);
        }
      }).join("/");
    }
  } catch (e) {
    // Fallback to simple encodeURI if URL constructor fails
    return encodeURI(cleaned);
  }

  return cleaned;
}

export default function ProductImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-850",
  category = "Presets Vocales",
}: ProductImageProps) {
  // Extract candidate URLs from string or array
  const rawUrls: string[] = Array.isArray(src)
    ? src.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : typeof src === "string" && src.trim().length > 0
    ? [src]
    : [];

  const normalizedUrls = rawUrls.map(normalizeImageUrl).filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when src changes
  const srcKey = Array.isArray(src) ? src.join(",") : src || "";
  useEffect(() => {
    setCurrentIndex(0);
    setHasError(false);
    setIsLoading(true);
  }, [srcKey]);

  const currentUrl = normalizedUrls[currentIndex];

  const handleImageError = () => {
    // If there are more alternative images in the array, try the next one
    if (currentIndex + 1 < normalizedUrls.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All candidate URLs failed -> render fallback SVG artwork
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Determine icon & gradient theme based on product category
  const getCategoryStyles = () => {
    const catLower = (category || "").toLowerCase();
    if (catLower.includes("preset") || catLower.includes("vocal")) {
      return {
        bg: "from-sky-950 via-slate-900 to-blue-950",
        accent: "text-sky-400",
        border: "border-sky-500/20",
        badgeBg: "bg-sky-500/10 text-sky-300 border-sky-500/30",
        Icon: Sliders,
        label: "PRESET VOCAL STUDIO",
      };
    } else if (catLower.includes("servicio") || catLower.includes("chat")) {
      return {
        bg: "from-amber-950 via-slate-900 to-orange-950",
        accent: "text-amber-400",
        border: "border-amber-500/20",
        badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        Icon: Sparkles,
        label: "SERVICIO PERSONALIZADO",
      };
    } else if (catLower.includes("canción") || catLower.includes("medida") || catLower.includes("produccion")) {
      return {
        bg: "from-indigo-950 via-slate-900 to-purple-950",
        accent: "text-purple-400",
        border: "border-purple-500/20",
        badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
        Icon: Music,
        label: "PRODUCCIÓN MUSICAL",
      };
    }

    return {
      bg: "from-slate-900 via-slate-950 to-slate-900",
      accent: "text-cyan-400",
      border: "border-cyan-500/20",
      badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      Icon: Volume2,
      label: category || "AUDIO PRO",
    };
  };

  const styleConfig = getCategoryStyles();
  const CategoryIcon = styleConfig.Icon;

  // Render SVG fallback artwork if URL missing or failed to load on device
  if (!currentUrl || hasError) {
    return (
      <div
        className={`${containerClassName} bg-gradient-to-br ${styleConfig.bg} select-none border-b ${styleConfig.border} flex flex-col items-center justify-center p-4 group`}
      >
        {/* Ambient decorative glowing grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Central Icon badge */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
            <CategoryIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${styleConfig.accent}`} />
          </div>

          <span className="text-[11px] sm:text-xs font-bold text-slate-200 line-clamp-1 max-w-[90%] tracking-wide">
            {alt}
          </span>

          <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${styleConfig.badgeBg}`}>
            {styleConfig.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <CategoryIcon className="w-8 h-8 text-slate-600 animate-spin" />
        </div>
      )}

      {/* Image tag with multi-device cross-origin & protocol error handling */}
      <img
        src={currentUrl}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      />
    </div>
  );
}
