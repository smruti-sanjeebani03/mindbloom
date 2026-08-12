/**
 * Utility functions for formatting and extracting user names universally for any user.
 */

export const extractFirstName = (name, email) => {
  // Determine primary raw source string
  let raw = "";
  if (name && typeof name === "string" && name.trim() && !name.includes("@")) {
    raw = name.trim();
  } else if (email && typeof email === "string" && email.trim()) {
    raw = email.trim().split("@")[0];
  } else if (name && typeof name === "string" && name.trim()) {
    raw = name.trim().split("@")[0];
  }

  if (!raw) return "Friend";

  // Split camelCase / PascalCase if present (e.g. JohnDoe -> John Doe)
  raw = raw.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Replace non-alphabetical characters (numbers, dots, underscores, hyphens) with spaces
  raw = raw.replace(/[^a-zA-Z\s]/g, " ");

  // Extract the first non-empty word
  const firstWord = raw.split(/\s+/).filter(Boolean)[0];

  if (!firstWord) return "Friend";

  // Return properly capitalized first name only
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
};

export const extractFullName = (name, email) => {
  let raw = "";
  if (name && typeof name === "string" && name.trim() && !name.includes("@")) {
    raw = name.trim();
  } else if (email && typeof email === "string" && email.trim()) {
    raw = email.trim().split("@")[0];
  } else if (name && typeof name === "string" && name.trim()) {
    raw = name.trim().split("@")[0];
  }

  if (!raw) return "MindBloom Member";

  raw = raw.replace(/([a-z])([A-Z])/g, "$1 $2");
  raw = raw.replace(/[^a-zA-Z\s]/g, " ");

  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "MindBloom Member";

  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};
