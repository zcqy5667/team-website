import { withBase } from "./paths";
import imageWidths from "../generated-image-widths.json";

export type ImageFormat = "avif" | "webp";

const fallbackWidths = [320, 480, 640, 800, 1200, 1600, 1920];

function availableWidths(path: string) {
  return (imageWidths as Record<string, number[]>)[path] ?? fallbackWidths;
}

function closestWidth(path: string, requestedWidth: number) {
  const widths = availableWidths(path);
  return widths.filter((width) => width <= requestedWidth).at(-1) ?? widths[0];
}

export function imageVariant(path: string, width: number, format: ImageFormat) {
  const cleanPath = path.split(/[?#]/, 1)[0];
  const extension = cleanPath.match(/\.[^.\/]+$/)?.[0] ?? "";
  const actualWidth = closestWidth(cleanPath, width);
  return `${cleanPath.slice(0, -extension.length)}-${actualWidth}.${format}`.replace(
    "/assets/images/",
    "/assets/images/generated/"
  );
}

export function imageSrcSet(path: string, format: ImageFormat) {
  return availableWidths(path).map((width) => `${withBase(imageVariant(path, width, format))} ${width}w`).join(", ");
}

export function responsiveImageSet(path: string, width = 1600) {
  const cleanPath = path.split(/[?#]/, 1)[0];
  const extension = cleanPath.match(/\.[^.\/]+$/)?.[0].toLowerCase();
  const fallbackType = extension === ".png" ? "image/png" : "image/jpeg";
  return `image-set(url("${withBase(imageVariant(path, width, "avif"))}") type("image/avif"), url("${withBase(imageVariant(path, width, "webp"))}") type("image/webp"), url("${withBase(path)}") type("${fallbackType}"))`;
}
