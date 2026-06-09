export function withBase(path: string) {
  const base = import.meta.env.BASE_URL;

  if (!path) return path;
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  if (path.startsWith("#")) return `${base}${path}`;
  if (path.startsWith("/#")) return `${base}${path.slice(1)}`;
  if (path.startsWith("/")) return `${base}${path.slice(1)}`;

  return `${base}${path}`;
}
