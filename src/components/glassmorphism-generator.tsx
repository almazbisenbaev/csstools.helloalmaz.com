"use client"

import { useMemo, useRef } from "react"
import { Copy, RotateCcw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { GlassState } from "@/types/filters"

interface GlassProps {
  state: GlassState
  onStateChange: (s: GlassState) => void
}

function hexToRgb(hex: string) {
  let h = hex.replace("#", "")
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("")
  }
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

export default function GlassmorphismGenerator({ state, onStateChange }: GlassProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rgbaBg = useMemo(() => {
    const { r, g, b } = hexToRgb(state.backgroundColor || "#ffffff")
    const a = Math.max(0, Math.min(1, state.opacity / 100))
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }, [state.backgroundColor, state.opacity])

  const boxShadow = useMemo(() => {
    if (!state.shadowEnabled) return "none"
    return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`
  }, [state.shadowEnabled, state.shadowX, state.shadowY, state.shadowBlur, state.shadowSpread, state.shadowColor])

  const cssCode = useMemo(() => {
    return `background: ${rgbaBg};
backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);
-webkit-backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);
border-radius: ${state.borderRadius}px;
border: ${state.borderWidth}px solid ${state.borderColor};
box-shadow: ${boxShadow};`
  }, [rgbaBg, state.blur, state.saturation, state.borderRadius, state.borderWidth, state.borderColor, boxShadow])

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

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-8 sticky top-24">
        <div className="relative bg-white overflow-hidden aspect-[4/3] flex items-center justify-center rounded-2xl shadow-xl">
          <img
            src={state.previewBackground}
            alt="Preview Background"
            className="w-full h-full object-cover"
          />
          
          <div
            className="absolute transition-all"
            style={{
              width: "350px",
              height: "220px",
              background: rgbaBg,
              backdropFilter: `blur(${state.blur}px) saturate(${state.saturation}%)`,
              WebkitBackdropFilter: `blur(${state.blur}px) saturate(${state.saturation}%)`,
              borderRadius: `${state.borderRadius}px`,
              border: `${state.borderWidth}px solid ${state.borderColor}`,
              boxShadow: boxShadow,
            }}
          >
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-white/20 rounded border border-white/30" />
                <div className="h-4 w-24 bg-white/20 rounded border border-white/30" />
              </div>
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
              className="bg-primary/5 border-primary/20 h-40"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-5 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Adjustments</h2>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-[10px]">Background Color</Label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={state.backgroundColor}
                onChange={(e) => onStateChange({ ...state, backgroundColor: e.target.value })}
                className="w-12 h-12 border border-primary/10 cursor-pointer bg-transparent rounded-lg"
              />
              <Input
                type="text"
                value={state.backgroundColor}
                onChange={(e) => onStateChange({ ...state, backgroundColor: e.target.value })}
                className="font-mono uppercase h-12"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-[10px]">Opacity</Label>
              <span className="font-mono text-xs font-bold">{state.opacity}%</span>
            </div>
            <Slider
              value={[state.opacity]}
              onValueChange={([v]) => onStateChange({ ...state, opacity: v })}
              max={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Blur</Label>
                <span className="font-mono text-xs font-bold">{state.blur}px</span>
              </div>
              <Slider
                value={[state.blur]}
                onValueChange={([v]) => onStateChange({ ...state, blur: v })}
                max={40}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Saturation</Label>
                <span className="font-mono text-xs font-bold">{state.saturation}%</span>
              </div>
              <Slider
                value={[state.saturation]}
                onValueChange={([v]) => onStateChange({ ...state, saturation: v })}
                max={300}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Radius</Label>
                <span className="font-mono text-xs font-bold">{state.borderRadius}px</span>
              </div>
              <Slider
                value={[state.borderRadius]}
                onValueChange={([v]) => onStateChange({ ...state, borderRadius: v })}
                max={100}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-[10px]">Border</Label>
                <span className="font-mono text-xs font-bold">{state.borderWidth}px</span>
              </div>
              <Slider
                value={[state.borderWidth]}
                onValueChange={([v]) => onStateChange({ ...state, borderWidth: v })}
                max={20}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px]">Border Color</Label>
            <Input
              type="text"
              value={state.borderColor}
              onChange={(e) => onStateChange({ ...state, borderColor: e.target.value })}
              className="font-mono h-12"
            />
          </div>

          <Separator className="opacity-50" />

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Checkbox
                id="glass-shadow-enabled"
                checked={state.shadowEnabled}
                onCheckedChange={(c) => onStateChange({ ...state, shadowEnabled: !!c })}
              />
              <Label htmlFor="glass-shadow-enabled" className="text-xl">Shadow</Label>
            </div>

            {state.shadowEnabled && (
              <div className="pl-10 space-y-8 border-l border-primary/10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-[10px]">Offset X</Label>
                      <span className="font-mono text-xs font-bold">{state.shadowX}px</span>
                    </div>
                    <Slider
                      value={[state.shadowX]}
                      onValueChange={([v]) => onStateChange({ ...state, shadowX: v })}
                      min={-64}
                      max={64}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-[10px]">Offset Y</Label>
                      <span className="font-mono text-xs font-bold">{state.shadowY}px</span>
                    </div>
                    <Slider
                      value={[state.shadowY]}
                      onValueChange={([v]) => onStateChange({ ...state, shadowY: v })}
                      min={-64}
                      max={64}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-[10px]">Blur</Label>
                      <span className="font-mono text-xs font-bold">{state.shadowBlur}px</span>
                    </div>
                    <Slider
                      value={[state.shadowBlur]}
                      onValueChange={([v]) => onStateChange({ ...state, shadowBlur: v })}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-[10px]">Spread</Label>
                      <span className="font-mono text-xs font-bold">{state.shadowSpread}px</span>
                    </div>
                    <Slider
                      value={[state.shadowSpread]}
                      onValueChange={([v]) => onStateChange({ ...state, shadowSpread: v })}
                      min={-50}
                      max={50}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px]">Shadow Color</Label>
                  <Input
                    type="text"
                    value={state.shadowColor}
                    onChange={(e) => onStateChange({ ...state, shadowColor: e.target.value })}
                    className="font-mono h-12"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
