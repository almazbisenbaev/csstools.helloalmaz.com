"use client"

import { useState } from "react"
import TransformGenerator from "@/components/transform-generator"
import type { TransformState } from "@/types/filters"

export default function Page() {
  const [transformState, setTransformState] = useState<TransformState>({
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    skewX: 0,
    skewY: 0,
    perspective: 0,
    originX: 50,
    originY: 50,
    preserve3d: false,
    previewBackground: "/placeholder.jpg?height=600&width=800",
  })

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Transform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          Manipulate elements in 3D space with CSS transforms.
        </p>
      </header>
      <TransformGenerator state={transformState} onStateChange={setTransformState} />
    </div>
  )
}
