"use client"

import { useMemo, useRef, useState, useCallback, useEffect } from "react"
import { Copy, RotateCcw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import type { LiquidGlassState } from "@/types/filters"

interface LiquidGlassProps {
  state: LiquidGlassState
  onStateChange: (s: LiquidGlassState) => void
}

export default function LiquidGlassGenerator({ state, onStateChange }: LiquidGlassProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragPosition, setDragPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const reset = () => {
    onStateChange({
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
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onStateChange({ ...state, previewBackground: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const svgFilterCode = useMemo(() => {
    return `<svg style="display: none">
  <filter id="liquid-glass-distortion" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${state.baseFrequencyX} ${state.baseFrequencyY}" numOctaves="${state.numOctaves}" seed="${state.seed}" result="turbulence" />
    <feGaussianBlur in="turbulence" stdDeviation="${state.blurStdDeviation}" result="softMap" />
    <feSpecularLighting in="softMap" surfaceScale="${state.surfaceScale}" specularConstant="${state.specularConstant}" specularExponent="${state.specularExponent}" lighting-color="${state.lightingColor}" result="specLight">
      <fePointLight x="${state.lightX}" y="${state.lightY}" z="${state.lightZ}" />
    </feSpecularLighting>
    <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
    <feDisplacementMap in="SourceGraphic" in2="softMap" scale="${state.displacementScale}" xChannelSelector="R" yChannelSelector="G" />
  </filter>
</svg>`
  }, [state])

  const cssCode = useMemo(() => {
    return `backdrop-filter: blur(${state.backdropBlur}px);
filter: url(#liquid-glass-distortion);
background: ${state.tintColor}${Math.round((state.tintOpacity / 100) * 255).toString(16).padStart(2, '0')};
border-radius: ${state.borderRadius}px;`
  }, [state])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: "Copied!", description: `${label} has been copied to clipboard.` })
    } catch {
      toast({ title: "Error", description: `Failed to copy ${label}.`, variant: "destructive" })
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y,
    })
  }, [dragPosition])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    let newX = e.clientX - dragStart.x
    let newY = e.clientY - dragStart.y
    newX = Math.max(0, Math.min(containerRect.width - 270, newX))
    newY = Math.max(0, Math.min(containerRect.height - 270, newY))
    setDragPosition({ x: newX, y: newY })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-8 sticky top-24">
        <div 
          ref={containerRef}
          className="relative bg-white overflow-hidden aspect-[4/3] flex items-center justify-center cursor-crosshair select-none rounded-2xl shadow-xl"
        >
          <img
            src={state.previewBackground}
            alt="Preview Background"
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* SVG Filter for Live Preview */}
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <filter id="preview-liquid-distortion" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency={`${state.baseFrequencyX} ${state.baseFrequencyY}`} numOctaves={state.numOctaves} seed={state.seed} result="turbulence" />
              <feGaussianBlur in="turbulence" stdDeviation={state.blurStdDeviation} result="softMap" />
              <feSpecularLighting in="softMap" surfaceScale={state.surfaceScale} specularConstant={state.specularConstant} specularExponent={state.specularExponent} lightingColor={state.lightingColor} result="specLight">
                <fePointLight x={state.lightX} y={state.lightY} z={state.lightZ} />
              </feSpecularLighting>
              <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
              <feDisplacementMap in="SourceGraphic" in2="softMap" scale={state.displacementScale} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          
          <div
            className="absolute shadow-2xl overflow-hidden cursor-move border border-white/40 active:shadow-sm"
            style={{
              width: "250px",
              height: "250px",
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              borderRadius: `${state.borderRadius}px`,
              backdropFilter: `blur(${state.backdropBlur}px)`,
              filter: "url(#preview-liquid-distortion)",
              background: `${state.tintColor}${Math.round((state.tintOpacity / 100) * 255).toString(16).padStart(2, '0')}`,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <span className="text-2xl font-black uppercase tracking-tighter drop-shadow-lg">
                Liquid
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-80">
                Drag Me
              </span>
            </div>
          </div>

          <div className="absolute top-6 left-6">
            <span className="bg-primary/90 backdrop-blur-md text-primary-foreground px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              Live Preview
            </span>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-full shadow-lg"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Background
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">SVG Filter</Label>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(svgFilterCode, "SVG Filter")}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={svgFilterCode}
                readOnly
                className="bg-primary/5 border-primary/20 h-48 text-xs"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">CSS Code</Label>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(cssCode, "CSS Code")}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={cssCode}
                readOnly
                className="bg-primary/5 border-primary/20 h-48 text-xs"
              />
            </CardContent>
          </Card>
        </div>
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

        <div className="space-y-8 pb-12">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Core Distortion</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Displacement Scale</Label>
                <span className="font-mono text-xs font-bold">{state.displacementScale}</span>
              </div>
              <Slider value={[state.displacementScale]} max={500} min={0} onValueChange={([v]) => onStateChange({ ...state, displacementScale: v })} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Backdrop Blur</Label>
                <span className="font-mono text-xs font-bold">{state.backdropBlur}px</span>
              </div>
              <Slider value={[state.backdropBlur]} max={40} min={0} onValueChange={([v]) => onStateChange({ ...state, backdropBlur: v })} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Radius</Label>
                <span className="font-mono text-xs font-bold">{state.borderRadius}px</span>
              </div>
              <Slider value={[state.borderRadius]} max={125} min={0} onValueChange={([v]) => onStateChange({ ...state, borderRadius: v })} />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Turbulence</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Freq X</Label>
                  <span className="font-mono text-xs font-bold">{state.baseFrequencyX}</span>
                </div>
                <Slider value={[state.baseFrequencyX]} max={0.1} min={0.001} step={0.001} onValueChange={([v]) => onStateChange({ ...state, baseFrequencyX: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Freq Y</Label>
                  <span className="font-mono text-xs font-bold">{state.baseFrequencyY}</span>
                </div>
                <Slider value={[state.baseFrequencyY]} max={0.1} min={0.001} step={0.001} onValueChange={([v]) => onStateChange({ ...state, baseFrequencyY: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Octaves</Label>
                  <span className="font-mono text-xs font-bold">{state.numOctaves}</span>
                </div>
                <Slider value={[state.numOctaves]} max={5} min={1} step={1} onValueChange={([v]) => onStateChange({ ...state, numOctaves: v })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px]">Seed</Label>
                  <span className="font-mono text-xs font-bold">{state.seed}</span>
                </div>
                <Slider value={[state.seed]} max={100} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, seed: v })} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Lighting & Tint</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-[10px]">Lighting Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={state.lightingColor} onChange={(e) => onStateChange({ ...state, lightingColor: e.target.value })} className="w-10 h-10 border border-primary/10 cursor-pointer bg-transparent rounded-lg" />
                  <Input type="text" value={state.lightingColor} onChange={(e) => onStateChange({ ...state, lightingColor: e.target.value })} className="h-10 text-[10px] font-mono" />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px]">Tint Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={state.tintColor} onChange={(e) => onStateChange({ ...state, tintColor: e.target.value })} className="w-10 h-10 border border-primary/10 cursor-pointer bg-transparent rounded-lg" />
                  <Input type="text" value={state.tintColor} onChange={(e) => onStateChange({ ...state, tintColor: e.target.value })} className="h-10 text-[10px] font-mono" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Tint Opacity</Label>
                <span className="font-mono text-xs font-bold">{state.tintOpacity}%</span>
              </div>
              <Slider value={[state.tintOpacity]} max={100} min={0} onValueChange={([v]) => onStateChange({ ...state, tintOpacity: v })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
