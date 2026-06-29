export const toSlug = (str?: string): string => {
  if (!str) return "";

  return str
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
