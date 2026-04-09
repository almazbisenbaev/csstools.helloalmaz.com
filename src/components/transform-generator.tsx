"use client"

import { useMemo, useRef } from "react"
import { Copy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { TransformState } from "@/types/filters"

interface TransformProps {
  state: TransformState
  onStateChange: (s: TransformState) => void
}

export default function TransformGenerator({ state, onStateChange }: TransformProps) {
  const { toast } = useToast()

  const transformString = useMemo(() => {
    const parts: string[] = []
    if (state.perspective > 0) parts.push(`perspective(${state.perspective}px)`)
    if (state.translateX !== 0 || state.translateY !== 0) parts.push(`translate(${state.translateX}px, ${state.translateY}px)`)
    if (state.translateZ !== 0) parts.push(`translateZ(${state.translateZ}px)`)
    if (state.rotate !== 0) parts.push(`rotate(${state.rotate}deg)`)
    if (state.rotateX !== 0) parts.push(`rotateX(${state.rotateX}deg)`)
    if (state.rotateY !== 0) parts.push(`rotateY(${state.rotateY}deg)`)
    if (state.rotateZ !== 0) parts.push(`rotateZ(${state.rotateZ}deg)`)
    if (state.skewX !== 0) parts.push(`skewX(${state.skewX}deg)`)
    if (state.skewY !== 0) parts.push(`skewY(${state.skewY}deg)`)
    if (state.scale !== 1) parts.push(`scale(${state.scale})`)
    if (state.scaleX !== 1 || state.scaleY !== 1) parts.push(`scale(${state.scaleX}, ${state.scaleY})`)
    if (state.scaleZ !== 1) parts.push(`scaleZ(${state.scaleZ})`)
    return parts.length ? parts.join(" ") : "none"
  }, [state])

  const cssCode = useMemo(() => {
    return `transform: ${transformString};
transform-origin: ${state.originX}% ${state.originY}%;
${state.preserve3d ? `transform-style: preserve-3d;` : ``}`
  }, [transformString, state.originX, state.originY, state.preserve3d])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssCode)
      toast({ title: "Copied!", description: "CSS code has been copied to clipboard." })
    } catch {
      toast({ title: "Error", description: "Failed to copy to clipboard.", variant: "destructive" })
    }
  }

  const reset = () => {
    onStateChange({
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
  }

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-8 sticky top-24">
        <div 
          className="relative bg-white overflow-hidden aspect-[4/3] flex items-center justify-center bg-cover bg-center rounded-2xl shadow-xl"
          style={{ backgroundImage: `url('${state.previewBackground}')` }}
        >
          <div
            className="size-48 bg-primary text-primary-foreground flex items-center justify-center text-center p-4 border-4 border-white shadow-2xl rounded-xl"
            style={{
              transform: transformString,
              transformOrigin: `${state.originX}% ${state.originY}%`,
              transformStyle: state.preserve3d ? "preserve-3d" : undefined,
            }}
          >
            <span className="text-2xl font-black uppercase tracking-tighter">
              Transform
            </span>
          </div>

          <div className="absolute top-6 left-6">
            <span className="bg-primary/90 backdrop-blur-md text-primary-foreground px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              3D Space Preview
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg">Generated CSS</Label>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy CSS
              </Button>
            </div>
            <Textarea
              value={cssCode}
              readOnly
              className="bg-primary/5 border-primary/20 h-32"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-5 space-y-8 h-[calc(100vh-12rem)] overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Adjustments</h2>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>

        <div className="space-y-12 pb-12">
          {/* Rotation */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Rotation</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Z Axis</Label>
                  <span className="font-mono text-xs font-bold">{state.rotate}°</span>
                </div>
                <Slider value={[state.rotate]} max={360} min={-360} onValueChange={([v]) => onStateChange({ ...state, rotate: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">X Axis</Label>
                  <span className="font-mono text-xs font-bold">{state.rotateX}°</span>
                </div>
                <Slider value={[state.rotateX]} max={360} min={-360} onValueChange={([v]) => onStateChange({ ...state, rotateX: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Y Axis</Label>
                  <span className="font-mono text-xs font-bold">{state.rotateY}°</span>
                </div>
                <Slider value={[state.rotateY]} max={360} min={-360} onValueChange={([v]) => onStateChange({ ...state, rotateY: v })} />
              </div>
            </div>
          </div>

          {/* Translation */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Translation</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">X Axis</Label>
                  <span className="font-mono text-xs font-bold">{state.translateX}px</span>
                </div>
                <Slider value={[state.translateX]} max={200} min={-200} onValueChange={([v]) => onStateChange({ ...state, translateX: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Y Axis</Label>
                  <span className="font-mono text-xs font-bold">{state.translateY}px</span>
                </div>
                <Slider value={[state.translateY]} max={200} min={-200} onValueChange={([v]) => onStateChange({ ...state, translateY: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Z Axis</Label>
                  <span className="font-mono text-xs font-bold">{state.translateZ}px</span>
                </div>
                <Slider value={[state.translateZ]} max={200} min={-200} onValueChange={([v]) => onStateChange({ ...state, translateZ: v })} />
              </div>
            </div>
          </div>

          {/* Scale */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Scale</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Uniform</Label>
                  <span className="font-mono text-xs font-bold">{state.scale}</span>
                </div>
                <Slider value={[state.scale]} max={3} min={0.1} step={0.01} onValueChange={([v]) => onStateChange({ ...state, scale: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Scale X</Label>
                  <span className="font-mono text-xs font-bold">{state.scaleX}</span>
                </div>
                <Slider value={[state.scaleX]} max={3} min={0.1} step={0.01} onValueChange={([v]) => onStateChange({ ...state, scaleX: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Scale Y</Label>
                  <span className="font-mono text-xs font-bold">{state.scaleY}</span>
                </div>
                <Slider value={[state.scaleY]} max={3} min={0.1} step={0.01} onValueChange={([v]) => onStateChange({ ...state, scaleY: v })} />
              </div>
            </div>
          </div>

          {/* Perspective & Origin */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Space & Origin</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Perspective</Label>
                <span className="font-mono text-xs font-bold">{state.perspective}px</span>
              </div>
              <Slider value={[state.perspective]} max={1000} min={0} onValueChange={([v]) => onStateChange({ ...state, perspective: v })} />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Origin X</Label>
                  <span className="font-mono text-xs font-bold">{state.originX}%</span>
                </div>
                <Slider value={[state.originX]} max={100} min={0} onValueChange={([v]) => onStateChange({ ...state, originX: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Origin Y</Label>
                  <span className="font-mono text-xs font-bold">{state.originY}%</span>
                </div>
                <Slider value={[state.originY]} max={100} min={0} onValueChange={([v]) => onStateChange({ ...state, originY: v })} />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Checkbox id="preserve-3d" checked={state.preserve3d} onCheckedChange={(c) => onStateChange({ ...state, preserve3d: !!c })} />
              <Label htmlFor="preserve-3d" className="text-xs">Preserve 3D</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
