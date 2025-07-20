"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CSSFiltersGenerator from "@/components/css-filters-generator"
import BackdropFiltersGenerator from "@/components/backdrop-filters-generator"
import BoxShadowGenerator from "@/components/box-shadow-generator"
import type { FiltersState, BackdropFiltersState, BoxShadowState } from "@/types/filters"

export default function Page() {
  // CSS Filters State
  const [filtersState, setFiltersState] = useState<FiltersState>({
    filters: [
      { name: "Blur", property: "blur", min: 0, max: 10, default: 0, unit: "px", enabled: false, value: 0 },
      {
        name: "Brightness",
        property: "brightness",
        min: 0,
        max: 200,
        default: 100,
        unit: "%",
        enabled: false,
        value: 100,
      },
      { name: "Contrast", property: "contrast", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Grayscale", property: "grayscale", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
      {
        name: "Hue Rotate",
        property: "hue-rotate",
        min: 0,
        max: 360,
        default: 0,
        unit: "deg",
        enabled: false,
        value: 0,
      },
      { name: "Invert", property: "invert", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
      { name: "Opacity", property: "opacity", min: 0, max: 100, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Saturate", property: "saturate", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Sepia", property: "sepia", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
    ],
    dropShadow: {
      enabled: false,
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      color: "#000000",
    },
    previewImage: "/placeholder.svg?height=400&width=600",
  })

  // Backdrop Filters State
  const [backdropFiltersState, setBackdropFiltersState] = useState<BackdropFiltersState>({
    filters: [
      { name: "Blur", property: "blur", min: 0, max: 20, default: 0, unit: "px", enabled: false, value: 0 },
      {
        name: "Brightness",
        property: "brightness",
        min: 0,
        max: 200,
        default: 100,
        unit: "%",
        enabled: false,
        value: 100,
      },
      { name: "Contrast", property: "contrast", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Grayscale", property: "grayscale", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
      {
        name: "Hue Rotate",
        property: "hue-rotate",
        min: 0,
        max: 360,
        default: 0,
        unit: "deg",
        enabled: false,
        value: 0,
      },
      { name: "Invert", property: "invert", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
      { name: "Opacity", property: "opacity", min: 0, max: 100, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Saturate", property: "saturate", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Sepia", property: "sepia", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
    ],
    backgroundImage: "/placeholder.svg?height=600&width=800",
  })

  // Box Shadow State
  const [boxShadowState, setBoxShadowState] = useState<BoxShadowState>({
    shadows: [],
    previewImage: "/placeholder.svg?height=400&width=600",
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">CSS Effects Generator</h1>
          <p className="text-muted-foreground text-lg">
            Generate CSS filters, backdrop filters, and box shadows with real-time preview
          </p>
        </div>

        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="filters">CSS Filters</TabsTrigger>
            <TabsTrigger value="backdrop">Backdrop Filters</TabsTrigger>
            <TabsTrigger value="shadows">Box Shadows</TabsTrigger>
          </TabsList>

          <TabsContent value="filters">
            <CSSFiltersGenerator state={filtersState} onStateChange={setFiltersState} />
          </TabsContent>

          <TabsContent value="backdrop">
            <BackdropFiltersGenerator state={backdropFiltersState} onStateChange={setBackdropFiltersState} />
          </TabsContent>

          <TabsContent value="shadows">
            <BoxShadowGenerator state={boxShadowState} onStateChange={setBoxShadowState} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
