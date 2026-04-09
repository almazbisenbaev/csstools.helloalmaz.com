"use client"

import { useState } from "react"
import CSSFiltersGenerator from "@/components/css-filters-generator"
import type { FiltersState } from "@/types/filters"

export default function Page() {
  const [filtersState, setFiltersState] = useState<FiltersState>({
    filters: [
      { name: "Blur", property: "blur", min: 0, max: 10, default: 0, unit: "px", enabled: false, value: 0 },
      { name: "Brightness", property: "brightness", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Contrast", property: "contrast", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
      { name: "Grayscale", property: "grayscale", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
      { name: "Hue Rotate", property: "hue-rotate", min: 0, max: 360, default: 0, unit: "deg", enabled: false, value: 0 },
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
    previewImage: "/placeholder.jpg",
  })

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Filters</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          Apply professional-grade CSS filters to your images with precise control.
        </p>
      </header>
      <CSSFiltersGenerator state={filtersState} onStateChange={setFiltersState} />
    </div>
  )
}
