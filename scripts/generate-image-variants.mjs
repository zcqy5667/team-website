import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, "public", "assets", "images");
const outputDir = path.join(sourceDir, "generated");
const manifestPath = path.join(projectRoot, "src", "generated-image-widths.json");
const widths = [320, 480, 640, 800, 1200, 1600, 1920];
const sourceExtensions = new Set([".png", ".jpg", ".jpeg"]);

await mkdir(outputDir, { recursive: true });
const existingFiles = await readdir(outputDir);
await Promise.all(existingFiles.map((file) => rm(path.join(outputDir, file), { force: true })));

const sourceFiles = (await readdir(sourceDir)).filter((file) => sourceExtensions.has(path.extname(file).toLowerCase()));
const manifest = {};

for (const file of sourceFiles) {
  const sourcePath = path.join(sourceDir, file);
  const sourceName = path.basename(file, path.extname(file));
  const metadata = await sharp(sourcePath).metadata();
  const sourceWidth = metadata.width ?? 0;
  const targetWidths = widths.filter((width) => width < sourceWidth);
  if (sourceWidth && !targetWidths.includes(sourceWidth)) targetWidths.push(sourceWidth);
  manifest[`/assets/images/${file}`] = targetWidths;

  await Promise.all(
    targetWidths.flatMap((width) => [
      sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(outputDir, `${sourceName}-${width}.webp`)),
      sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 55, effort: 4 })
        .toFile(path.join(outputDir, `${sourceName}-${width}.avif`))
    ])
  );
}

console.log(`Generated responsive variants for ${sourceFiles.length} source images.`);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
