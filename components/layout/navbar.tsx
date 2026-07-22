"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, ShoppingBag, Menu, X, Globe } from "lucide-react"
import { useWishlist } from "@/lib/wishlist"
import { useCart } from "@/lib/cart"
import en from "@/messages/en.json"
import it from "@/messages/it.json"

const dictionaries = { en, it } as const
const locales = ["en", "it"] as const

export function Navbar({ lang }: { lang?: string }) {
  const locale = (lang === "it" ? "it" : "en") as keyof typeof dictionaries
  const t = dictionaries[locale].nav
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { count: wishlistCount } = useWishlist()
  const { totalItems } = useCart()

  const navLinks = [
    { label: t.shop, href: `/${locale}/shop` },
    { label: t.collections, href: `/${locale}/collections` },
    { label: t.styles, href: `/${locale}/styles` },
    { label: t.rooms, href: `/${locale}/rooms` },
    { label: t.about, href: `/${locale}/about` },
    { label: t.contact, href: `/${locale}/contact` },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 100)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav
      className={`flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-6 z-50 fixed top-0 left-0 right-0 transition-all duration-300 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-md shadow-sm text-on-surface"
          : "bg-transparent text-white"
      }`}
    >
      <Link
        href={`/${locale}`}
        className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tight no-underline"
      >
        Afghan Tappeti
      </Link>

      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-label-md text-label-md hover:text-secondary transition-colors no-underline"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative">
          <button onClick={() => setLangOpen(!langOpen)} className="hover:text-secondary transition-colors flex items-center gap-1">
            <Globe size={16} />
            <span className="font-label-sm text-label-sm hidden md:inline">{locale.toUpperCase()}</span>
          </button>
          {langOpen && (
            <div className="absolute top-full right-0 mt-2 bg-surface shadow-lg border border-outline-variant rounded-lg py-1 min-w-[100px] z-50">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}${typeof window !== "undefined" ? window.location.pathname.replace(/^\/(en|it)/, "") : ""}`}
                  className={`block px-4 py-2 font-body-md no-underline hover:bg-surface-variant transition-colors ${l === locale ? "text-secondary" : "text-on-surface-variant"}`}
                  onClick={() => setLangOpen(false)}
                >
                  {l === "en" ? "English" : "Italiano"}
                </Link>
              ))}
            </div>
          )}
        </div>
        <button className="hover:text-secondary transition-colors">
          <Search size={20} />
        </button>
        <Link href={`/${locale}/wishlist`} className="hover:text-secondary transition-colors hidden md:block relative no-underline">
          <Heart size={20} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>
        <Link href={`/${locale}/cart`} className="hover:text-secondary transition-colors relative no-underline">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
        <button
          className="md:hidden hover:text-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface shadow-lg border-t border-outline-variant p-6 flex flex-col gap-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors no-underline"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
