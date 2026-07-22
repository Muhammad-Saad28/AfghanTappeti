"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingCart,
  Users,
  Star,
  BarChart3,
  Newspaper,
  Home,
  Image,
  Mail,
  Search,
  Settings,
  UserCircle,
  type LucideIcon,
} from "lucide-react"

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Collections", href: "/admin/collections", icon: Layers },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-outline-variant flex flex-col h-dvh sticky top-0">
      <div className="px-6 py-5 border-b border-outline-variant">
        <Link href="/admin" className="font-headline-sm text-primary no-underline">
          AfghanTappeti
        </Link>
        <p className="text-label-sm text-on-surface-variant mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md transition-colors no-underline ${
                isActive
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
