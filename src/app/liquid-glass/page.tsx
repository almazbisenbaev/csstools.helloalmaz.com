"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LiquidGlassGenerator from "@/components/liquid-glass-generator"
import type { LiquidGlassState } from "@/types/filters"

export default function Page() {
  const router = useRouter()

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">CSS Playground</h1>
          <p className="text-muted-foreground text-lg">
            Generate complex CSS and SVG effects with real-time preview
          </p>
        </div>

        <Tabs
          value="liquid-glass"
          onValueChange={(v) => {
            if (v === "filters") router.push("/filters")
            else if (v === "backdrop") router.push("/backdrop")
            else if (v === "shadows") router.push("/shadows")
            else if (v === "glass") router.push("/glass")
            else if (v === "liquid-glass") router.push("/liquid-glass")
            else router.push("/transform")
          }}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="backdrop">Backdrop</TabsTrigger>
            <TabsTrigger value="shadows">Shadows</TabsTrigger>
            <TabsTrigger value="glass">Matte Glass</TabsTrigger>
            <TabsTrigger value="liquid-glass">Liquid Glass</TabsTrigger>
            <TabsTrigger value="transform">Transform</TabsTrigger>
          </TabsList>

          <TabsContent value="liquid-glass">
            <LiquidGlassGenerator state={liquidGlassState} onStateChange={setLiquidGlassState} />
          </TabsContent>
        </Tabs>

        <div className="px-2 text-center text-sm pt-5 pb-5 mt-10 text-gray-500 border-t">
          Author: <a className="text-black hover:underline" href="//helloalmaz.com" target="_blank">Almaz Bissenbayev</a>
        </div>
      </div>
    </div>
  )
}
