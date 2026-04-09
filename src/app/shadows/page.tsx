"use client"

import { useState } from "react"
import BoxShadowGenerator from "@/components/box-shadow-generator"
import type { BoxShadowState } from "@/types/filters"

export default function Page() {
  const [boxShadowState, setBoxShadowState] = useState<BoxShadowState>({
    shadows: [],
    previewImage: "/placeholder.jpg",
  })

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Shadows</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          Layer multiple box shadows to create depth and realistic elevation.
        </p>
      </header>
      <BoxShadowGenerator state={boxShadowState} onStateChange={setBoxShadowState} />
    </div>
  )
}
