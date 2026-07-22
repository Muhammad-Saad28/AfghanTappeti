import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { organizationStructuredData } from "@/lib/seo"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Afghan Tappeti | From Colorful to Timeless",
  description:
    "Over 95,000 Hand-Knotted Rugs with Character, curated for the modern connoisseur of ancient artistry.",
}

const orgJsonLd = organizationStructuredData()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://wywzczlhauqbkjzuqnqa.supabase.co" />
        <link rel="dns-prefetch" href="https://wywzczlhauqbkjzuqnqa.supabase.co" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-on-background font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        {children}
      </body>
    </html>
  )
}
