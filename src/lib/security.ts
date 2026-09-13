import mongoose from "mongoose";

/**
 * Sanitizes input text to prevent Cross-Site Scripting (XSS) attacks.
 * Escapes HTML entities and strips hazardous tags/script protocols.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/onload=/gi, "")
    .replace(/onerror=/gi, "");
}

/**
 * Validates whether a given string is a safe MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sanitizes file names to prevent Directory Traversal attacks (../)
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return "file";
  // Remove paths, null bytes, and dangerous characters
  return filename
    .replace(/^.*[\\\/]/, "") // get basename
    .replace(/[^a-zA-Z0-9._-]/g, "_"); // replace special characters
}
