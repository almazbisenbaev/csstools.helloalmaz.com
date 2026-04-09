"use client"

import { useState } from "react"
import LiquidGlassGenerator from "@/components/liquid-glass-generator"
import type { LiquidGlassState } from "@/types/filters"

export default function Page() {
  const [liquidGlassState, setLiquidGlassState] = useState<LiquidGlassState>({
    baseFrequencyX: 0.01,
    baseFrequencyY: 0.01,
    numOctaves: 1,
    seed: 5,
    blurStdDeviation: 3,
    surfaceScale: 5,
    specularConstant: 1,
    specularExponent: 100,
    lightingColor: "#ffffff",
    lightX: -200,
    lightY: -200,
    lightZ: 300,
    displacementScale: 150,
    backdropBlur: 3,
    tintColor: "#ffffff",
    tintOpacity: 25,
    borderRadius: 32,
    previewBackground: "/placeholder.jpg?height=600&width=800",
  })

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Liquid Glass</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          Create complex SVG-based liquid and organic glass effects.
        </p>
      </header>
      <LiquidGlassGenerator state={liquidGlassState} onStateChange={setLiquidGlassState} />
    </div>
  )
}
