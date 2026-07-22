import sharp from "sharp"
import { readdirSync, mkdirSync, renameSync, existsSync, copyFileSync } from "fs"
import { join, parse } from "path"

const srcDir = join(import.meta.dirname, "..", "public", "images")
const destRoot = join(srcDir, "products")

const files = readdirSync(srcDir).filter(f => f.endsWith(".jpg"))

for (const file of files) {
  const sku = file.substring(0, file.lastIndexOf("-"))
  const destDir = join(destRoot, sku)
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })

  const srcPath = join(srcDir, file)
  const destPath = join(destDir, file)

  renameSync(srcPath, destPath)

  const webpPath = join(destDir, parse(file).name + ".webp")
  await sharp(destPath).webp({ quality: 80 }).toFile(webpPath)
}

console.log("Done — all images organized and WebP generated.")
