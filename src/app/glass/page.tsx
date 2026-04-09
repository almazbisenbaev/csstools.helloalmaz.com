"use client"

import { useState } from "react"
import GlassmorphismGenerator from "@/components/glassmorphism-generator"
import type { GlassState } from "@/types/filters"

export default function Page() {
  const [glassState, setGlassState] = useState<GlassState>({
    backgroundColor: "#ffffff",
    opacity: 30,
    blur: 12,
    saturation: 150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowEnabled: true,
    shadowX: 0,
    shadowY: 8,
    shadowBlur: 32,
    shadowSpread: 0,
    shadowColor: "rgba(31, 38, 135, 0.2)",
    previewBackground: "/placeholder.jpg?height=600&width=800",
  })

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Matte Glass</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          Generate elegant frosted glass effects with customizable properties.
        </p>
      </header>
      <GlassmorphismGenerator state={glassState} onStateChange={setGlassState} />
    </div>
  )
}
