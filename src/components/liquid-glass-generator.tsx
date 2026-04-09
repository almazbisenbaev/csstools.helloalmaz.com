"use client"

import { useMemo, useRef, useState } from "react"
import { Copy, RotateCcw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { LiquidGlassState } from "@/types/filters"

interface LiquidGlassProps {
  state: LiquidGlassState
  onStateChange: (s: LiquidGlassState) => void
}

export default function LiquidGlassGenerator({ state, onStateChange }: LiquidGlassProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const drag = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 })

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ description: `${label} copied` })
    } catch {
      toast({ description: `Failed to copy ${label}` })
    }
  }

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
  <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
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
    return `.liquidGlass-wrapper {
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: 48px;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
}

.liquidGlass-effect {
  position: absolute;
  inset: 0;
  z-index: 0;
  backdrop-filter: blur(${state.backdropBlur}px);
  filter: url(#glass-distortion);
}

.liquidGlass-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: ${state.tintColor};
  opacity: ${state.tintOpacity / 100};
}

.liquidGlass-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}`
  }, [state])

  const htmlCode = `<div class="liquidGlass-wrapper">
  <div class="liquidGlass-effect"></div>
  <div class="liquidGlass-tint"></div>
  <div class="liquidGlass-content">
    <!-- Your content here -->
    <h2>Liquid Glass</h2>
  </div>
</div>`

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Liquid Glass Controls
                <Button variant="outline" size="sm" onClick={reset} className="bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium border-b pb-2">Core Controls</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Displacement</Label>
                      <span className="text-sm text-muted-foreground">{state.displacementScale}</span>
                    </div>
                    <Slider value={[state.displacementScale]} max={500} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, displacementScale: v })} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Backdrop Blur</Label>
                      <span className="text-sm text-muted-foreground">{state.backdropBlur}px</span>
                    </div>
                    <Slider value={[state.backdropBlur]} max={40} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, backdropBlur: v })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview Background</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div
            className="relative rounded-xl overflow-hidden border bg-cover bg-center p-10 min-h-[400px]"
            style={{ backgroundImage: `url('${state.previewBackground}')` }}
          >
            {/* Real-time SVG Filter for Preview */}
            <svg style={{ position: "absolute", width: 0, height: 0 }}>
              <filter id="preview-glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
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
              className="absolute w-64 h-64 flex items-center justify-center text-center overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                borderRadius: 48,
                boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
              }}
              onMouseDown={(e) => {
                drag.current = {
                  active: true,
                  startX: e.clientX,
                  startY: e.clientY,
                  origX: pos.x,
                  origY: pos.y,
                }
                const onMove = (ev: MouseEvent) => {
                  if (!drag.current.active) return
                  const dx = ev.clientX - drag.current.startX
                  const dy = ev.clientY - drag.current.startY
                  setPos({ x: drag.current.origX + dx, y: drag.current.origY + dy })
                }
                const onUp = () => {
                  drag.current.active = false
                  window.removeEventListener("mousemove", onMove)
                  window.removeEventListener("mouseup", onUp)
                }
                window.addEventListener("mousemove", onMove)
                window.addEventListener("mouseup", onUp)
              }}
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  backdropFilter: `blur(${state.backdropBlur}px)`,
                  filter: "url(#preview-glass-distortion)",
                  borderRadius: "inherit",
                }}
              />
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: state.tintColor,
                  opacity: state.tintOpacity / 100,
                  borderRadius: "inherit",
                }}
              />
              <div className="relative z-20 p-6">
                <div className="text-3xl font-bold">Liquid Glass</div>
                <div className="text-sm mt-2 opacity-80">Adjust parameters to see the effect</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">SVG Filter (Add once at the end of body)</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => copy(svgFilterCode, "SVG Filter")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea value={svgFilterCode} readOnly className="font-mono text-xs h-32" />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">CSS</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => copy(cssCode, "CSS")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea value={cssCode} readOnly className="font-mono text-xs h-48" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">HTML</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => copy(htmlCode, "HTML")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea value={htmlCode} readOnly className="font-mono text-xs h-48" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
