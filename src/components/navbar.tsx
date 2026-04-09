"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Filters", href: "/filters" },
  { name: "Backdrop filters", href: "/backdrop" },
  { name: "Shadows", href: "/shadows" },
  { name: "Glass", href: "/glass" },
  { name: "Liquid Glass", href: "/liquid-glass" },
  { name: "Transform", href: "/transform" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-primary/10 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
              CSS_PG
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary hover:translate-y-[-1px]",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
