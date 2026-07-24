import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, unlinkSync } from "fs"
import { join, extname } from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const IMAGES_DIR = join(__dirname, "..", "public", "images")

// Color IDs
const COLORS = {
  Red: "4fd5f79f-86c1-4261-9bda-adf400385aa8",
  Ivory: "557edf97-e9cd-4b69-bf77-ea7c77b4c25e",
  Beige: "05bd9107-ca2c-45dc-87f7-1ba2cf0cfe3a",
  Brown: "a2b83299-0bd3-4ebd-a4d6-13240bbdff25",
  Multicolor: "9f1ed1ed-4b5a-4120-808d-73755235cee1",
  Navy: "bda183d9-5a92-462f-a977-50f5d9709aed",
  Gold: "5790737f-756f-43d6-9346-84ddda2c7c92",
  Green: "6e1b053e-a656-4f1a-a0a2-dddf1f850425",
  Rust: "f2faf16a-03aa-4658-8e79-c92a79feb9a5",
  Cream: "281cbd26-225c-4613-8270-0df4b02ef5c8",
  Blue: "b70b4496-2f13-4090-901e-01a5b560f471",
  Orange: "1d8a4bda-934b-48d7-8b77-56fb07d32d6d",
}

const SIZE_LARGE = "6886e7f5-8fd6-4bbc-8e44-815253331ae5" // 200 x 250 cm

const updates = [
  {
    sku: "SB-001",
    folder: "Sultani Bakhtiari Folder",
    data: {
      price: 1990,
      italian_name: "Tappeto Sultani Bakhtiari",
      english_name: "Sultani Bakhtiari Heritage Rug",
      description: "Handwoven in Afghanistan using premium wool, the Sultani Bakhtiari Heritage Rug combines timeless geometric artistry with exceptional craftsmanship. Designed to complement both classic and contemporary interiors, every rug is individually handcrafted, making each piece unique.",
      description_it: "Tappeto artigianale annodato a mano in Afghanistan con lana di alta qualità. Il design Bakhtiari unisce tradizione, eleganza e resistenza, rendendolo ideale per qualsiasi ambiente.",
      description_en: "Handwoven in Afghanistan using premium wool, the Sultani Bakhtiari Heritage Rug combines timeless geometric artistry with exceptional craftsmanship.",
      seo_title: "Sultani Bakhtiari Heritage Rug | Handmade Afghan Wool Rug",
      seo_description: "Discover the handmade Sultani Bakhtiari Heritage Rug crafted from premium Afghan wool with timeless traditional designs.",
      alt_text: "Handmade Sultani Bakhtiari Heritage Afghan wool rug",
      short_description: "Hand-knotted Bakhtiari rug from the Sultani tradition",
      primary_color_id: COLORS.Red,
      secondary_color_id: COLORS.Ivory,
      size_id: SIZE_LARGE,
      is_best_seller: false,
      is_featured: true,
    },
  },
  {
    sku: "SFZ-001",
    folder: "Sultani Farhan Ziegler",
    data: {
      price: 2390,
      italian_name: "Tappeto Sultani Farhan Ziegler",
      english_name: "Sultani Farhan Ziegler Rug",
      description: "Inspired by traditional Ziegler patterns, the Sultani Farhan Ziegler Rug features elegant floral motifs and refined colours. Carefully hand-knotted from premium Afghan wool, it offers durability, luxury and timeless appeal.",
      description_it: "Elegante tappeto Sultani Farhan Ziegler realizzato a mano in Afghanistan. I motivi floreali classici e la lana pregiata offrono uno stile raffinato e senza tempo.",
      description_en: "Inspired by traditional Ziegler patterns, the Sultani Farhan Ziegler Rug features elegant floral motifs and refined colours.",
      seo_title: "Sultani Farhan Ziegler Rug | Luxury Handmade Afghan Rug",
      seo_description: "Luxury handmade Afghan Ziegler rug featuring elegant patterns and premium wool craftsmanship.",
      alt_text: "Luxury handmade Sultani Farhan Ziegler Afghan rug",
      short_description: "Hand-knotted Farhan Ziegler rug with elegant floral motifs",
      primary_color_id: COLORS.Beige,
      secondary_color_id: COLORS.Brown,
      size_id: SIZE_LARGE,
      is_best_seller: true,
      is_featured: true,
    },
  },
  {
    sku: "SG-001",
    folder: "Sultani Gabbah",
    data: {
      price: 1790,
      italian_name: "Tappeto Sultani Gabbah",
      english_name: "Sultani Gabbah Rug",
      description: "The Sultani Gabbah Rug showcases bold tribal character with a soft luxurious pile and authentic Afghan craftsmanship. Its distinctive design makes it a striking addition to modern, rustic and minimalist interiors.",
      description_it: "Il tappeto Sultani Gabbah è realizzato a mano con lana afghana di alta qualità. Il suo stile tribale e i colori autentici lo rendono perfetto sia per ambienti moderni che tradizionali.",
      description_en: "The Sultani Gabbah Rug showcases bold tribal character with a soft luxurious pile and authentic Afghan craftsmanship.",
      seo_title: "Sultani Gabbah Rug | Authentic Afghan Handmade Rug",
      seo_description: "Authentic handmade Afghan Gabbah rug with bold tribal design and exceptional wool quality.",
      alt_text: "Traditional handmade Sultani Gabbah Afghan wool rug",
      short_description: "Hand-knotted Gabbah rug with bold tribal designs",
      primary_color_id: COLORS.Multicolor,
      secondary_color_id: COLORS.Red,
      size_id: SIZE_LARGE,
      is_best_seller: true,
      is_featured: true,
    },
  },
]

async function convertToWebp(inputPath, outputPath) {
  await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath)
}

async function uploadWebp(filePath, fileName) {
  const content = readFileSync(filePath)
  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, content, { upsert: true, contentType: "image/webp" })
  if (error) {
    console.error(`  Upload fail ${fileName}: ${error.message}`)
    return false
  }
  console.log(`  Uploaded ${fileName}`)
  return true
}

async function deleteStorageFile(fileName) {
  const { data } = await supabase.storage.from("product-images").remove([fileName])
  return data
}

async function main() {
  for (const u of updates) {
    console.log(`\n=== ${u.sku} ===`)
    const folderPath = join(IMAGES_DIR, u.folder)
    const jpegFiles = readdirSync(folderPath)
      .filter(f => f.startsWith(u.sku) && extname(f) === ".jpeg")
      .sort()

    // 1. Convert to .webp locally
    console.log(`Converting ${jpegFiles.length} images to webp...`)
    for (const jpeg of jpegFiles) {
      const webpName = jpeg.replace(".jpeg", ".webp")
      const jpegPath = join(folderPath, jpeg)
      const webpPath = join(folderPath, webpName)
      await convertToWebp(jpegPath, webpPath)
      console.log(`  ${jpeg} → ${webpName}`)
    }

    // 2. Upload .webp files
    const webpFiles = readdirSync(folderPath)
      .filter(f => f.startsWith(u.sku) && extname(f) === ".webp")
      .sort()

    console.log(`Uploading ${webpFiles.length} webp images...`)
    for (const w of webpFiles) {
      await uploadWebp(join(folderPath, w), w)
    }

    // 3. Get product ID
    const { data: prod } = await supabase.from("products").select("id").eq("sku", u.sku).single()
    if (!prod) { console.log(`Product ${u.sku} not found`); continue }

    // 4. Update product_images to use .webp
    const { data: oldImages } = await supabase.from("product_images").select("id, image_url, is_primary, display_order, alt_text").eq("product_id", prod.id)
    for (const old of oldImages || []) {
      const webpName = old.image_url.replace(".jpeg", ".webp")
      await supabase.from("product_images").update({
        image_url: webpName,
        alt_text: u.data.alt_text,
      }).eq("id", old.id)
      console.log(`  Image: ${old.image_url} → ${webpName}`)
    }

    // 5. Update product record
    await supabase.from("products").update(u.data).eq("id", prod.id)
    console.log(`  Product updated: €${u.data.price}, colors set, SEO set`)
  }

  // 6. Clean up old .jpeg files from storage
  console.log(`\nCleaning up old .jpeg files from storage...`)
  for (const u of updates) {
    const folderPath = join(IMAGES_DIR, u.folder)
    const jpegFiles = readdirSync(folderPath).filter(f => f.startsWith(u.sku) && extname(f) === ".jpeg")
    for (const j of jpegFiles) {
      await deleteStorageFile(j)
      console.log(`  Deleted ${j} from storage`)
    }
  }

  console.log(`\nDone! All images converted, uploaded, and products updated.`)
}

main().catch(console.error)
