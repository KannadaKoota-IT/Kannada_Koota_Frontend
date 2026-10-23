export const DEFAULT_EVENT_IMAGE = "/mission.jpg";
export const DEFAULT_GALLERY_IMAGE = "/about.png";
export const DEFAULT_PERSON_IMAGE = "/default_img.jpg";
export const DEFAULT_ANNOUNCEMENT_IMAGE = "/bg_hero.png";
export const DEFAULT_BLOG_IMAGE = "/mission.jpg";

/**
 * Normalizes media URLs:
 * - If full http/https or data URI, returns as is.
 * - If relative /uploads, prepends the backend base URL.
 * - If empty/falsy, returns fallback.
 */
export function getMediaUrl(url, fallback = DEFAULT_EVENT_IMAGE) {
  if (!url || typeof url !== "string") return fallback;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/uploads") || url.startsWith("uploads/")) {
    const normalized = url.startsWith("/") ? url : `/${url}`;
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    return `${backend}${normalized}`;
  }
  return url;
}

/**
 * Handles image load errors gracefully by switching to a fallback asset
 * and detaching the error handler to avoid recursion.
 */
export function handleImageError(e, fallback = DEFAULT_EVENT_IMAGE) {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
}
