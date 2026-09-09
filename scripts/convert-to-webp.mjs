import sharp from "sharp"
import { readdirSync, statSync } from "fs"
import { join, extname, parse } from "path"

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

function getAllImages(dir) {
  const results = []
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      results.push(...getAllImages(fullPath))
    } else {
      const ext = extname(entry).toLowerCase()
      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        results.push(fullPath)
      }
    }
  }
  return results
}

async function convertToWebp(inputPath) {
  const { dir, name } = parse(inputPath)
  const outputPath = join(dir, name + ".webp")

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)

    const inputSize = statSync(inputPath).size
    const outputSize = statSync(outputPath).size
    const savings = Math.round((1 - outputSize / inputSize) * 100)

    return { success: true, inputSize, outputSize, savings }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

async function main() {
  console.log("=== JPG → WebP Converter ===\n")

  const images = getAllImages(PRODUCTS_DIR)
  console.log(`Found ${images.length} JPG/PNG images\n`)

  let converted = 0
  let skipped = 0
  let failed = 0
  let totalInput = 0
  let totalOutput = 0

  for (const img of images) {
    const { dir, name } = parse(img)
    const webpPath = join(dir, name + ".webp")
    let webpExists = false
    try { webpExists = statSync(webpPath).size > 0 } catch {}

    if (webpExists) {
      skipped++
      continue
    }

    const result = await convertToWebp(img)
    if (result.success) {
      converted++
      totalInput += result.inputSize
      totalOutput += result.outputSize
      const rel = img.replace(PRODUCTS_DIR + "\\", "")
      console.log(`✓ ${rel} (${result.savings}% smaller)`)
    } else {
      failed++
      console.log(`✗ ${img}: ${result.error}`)
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`Converted: ${converted}`)
  console.log(`Already existed: ${images.length - converted - failed}`)
  console.log(`Failed: ${failed}`)
  if (converted > 0) {
    console.log(`Total saved: ${Math.round((totalInput - totalOutput) / 1024 / 1024)} MB`)
  }
}

main().catch(console.error)
