"use client"

import { useMemo, useRef, useState, useCallback, useEffect } from "react"
import { Copy, RotateCcw, Upload, Settings2, Sparkles, Layers, Sun, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LiquidGlassState } from "@/types/filters"

interface LiquidGlassProps {
  state: LiquidGlassState
  onStateChange: (s: LiquidGlassState) => void
}

export default function LiquidGlassGenerator({ state, onStateChange }: LiquidGlassProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} has been copied to clipboard.`,
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

  const svgFilterId = "liquid-glass-distortion"
  const previewFilterId = "preview-liquid-distortion"

  const getSvgCode = (id: string) => `<svg style="display: none">
  <filter id="${id}" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
    <feTurbulence type="fractalNoise" baseFrequency="${state.baseFrequencyX} ${state.baseFrequencyY}" numOctaves="${state.numOctaves}" seed="${state.seed}" result="turbulence" />
    <feComponentTransfer in="turbulence" result="mapped">
      <feFuncR type="gamma" amplitude="${state.gammaAmplitude}" exponent="${state.gammaExponent}" offset="${state.gammaOffset}" />
      <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
      <feFuncB type="gamma" amplitude="0" exponent="1" offset="${state.gammaOffset}" />
    </feComponentTransfer>
    <feGaussianBlur in="mapped" stdDeviation="${state.blurStdDeviation}" result="softMap" />
    <feSpecularLighting in="softMap" surfaceScale="${state.surfaceScale}" specularConstant="${state.specularConstant}" specularExponent="${state.specularExponent}" lighting-color="${state.lightingColor}" result="specLight">
      <fePointLight x="${state.lightX}" y="${state.lightY}" z="${state.lightZ}" />
    </feSpecularLighting>
    <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
    <feDisplacementMap in="SourceGraphic" in2="softMap" scale="${state.displacementScale}" xChannelSelector="R" yChannelSelector="G" />
  </filter>
</svg>`

  const svgFilterCode = useMemo(() => getSvgCode(svgFilterId), [state])

  const cssCode = useMemo(() => {
    return `.liquidGlass-wrapper {
  position: relative;
  display: flex;
  overflow: hidden;
  isolation: isolate;
  border-radius: ${state.borderRadius}px;
  padding: ${state.padding}px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateZ(0);
}

.liquidGlass-effect {
  position: absolute;
  inset: 0;
  z-index: 0;
  backdrop-filter: blur(${state.backdropBlur}px);
  filter: url(#${svgFilterId});
  overflow: hidden;
  isolation: isolate;
}

.liquidGlass-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: ${state.tintColor}${Math.round((state.tintOpacity / 100) * 255).toString(16).padStart(2, '0')};
}

.liquidGlass-shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5),
              inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2);
}

.liquidGlass-content {
  position: relative;
  z-index: 3;
}`
  }, [state])

  const htmlCode = useMemo(() => {
    return `<div class="liquidGlass-wrapper">
  <div class="liquidGlass-effect"></div>
  <div class="liquidGlass-tint"></div>
  <div class="liquidGlass-shine"></div>
  <div class="liquidGlass-content">
    <!-- Your content here -->
    <h1>Liquid Glass</h1>
  </div>
</div>`
  }, [])

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
    
    // Bounds check (rough estimate based on 300px width/height)
    newX = Math.max(0, Math.min(containerRect.width - 200, newX))
    newY = Math.max(0, Math.min(containerRect.height - 150, newY))
    
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

  const resetState = () => {
    onStateChange({
      ...state,
      baseFrequencyX: 0.01,
      baseFrequencyY: 0.01,
      numOctaves: 1,
      seed: 5,
      gammaAmplitude: 1,
      gammaExponent: 10,
      gammaOffset: 0.5,
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
      padding: 40,
      previewBackground: "/placeholder.jpg?height=600&width=800",
    })
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-6 sticky top-24">
        <div 
          ref={containerRef}
          className="relative bg-slate-900 overflow-hidden aspect-video flex items-center justify-center cursor-crosshair select-none rounded-3xl shadow-2xl border border-white/5"
        >
          <img
            src={state.previewBackground}
            alt="Preview Background"
            className="w-full h-full object-cover pointer-events-none opacity-80"
          />

          {/* SVG Filter for Live Preview */}
          <div dangerouslySetInnerHTML={{ __html: getSvgCode(previewFilterId) }} />
          
          <div
            className="absolute cursor-move active:scale-95 transition-transform duration-200"
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              display: "flex",
              borderRadius: `${state.borderRadius}px`,
              padding: `${state.padding}px`,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              isolation: "isolate",
              transform: "translateZ(0)",
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Layers based on reference example */}
            <div 
              className="absolute inset-0 z-0" 
              style={{ 
                backdropFilter: `blur(${state.backdropBlur}px)`,
                filter: `url(#${previewFilterId})`,
                overflow: "hidden",
                isolation: "isolate",
              }} 
            />
            <div 
              className="absolute inset-0 z-[1]" 
              style={{ 
                background: `${state.tintColor}${Math.round((state.tintOpacity / 100) * 255).toString(16).padStart(2, '0')}` 
              }} 
            />
            <div 
              className="absolute inset-0 z-[2]" 
              style={{ 
                boxShadow: "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2)",
                overflow: "hidden",
              }} 
            />
            
            <div className="liquidGlass-content relative z-[3] flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-4xl font-bold uppercase tracking-tighter text-black">
                Glass
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-black/60">
                Liquid Effect
              </span>
            </div>
          </div>

          <div className="absolute top-6 left-6 flex items-center gap-3">
            <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">
              Live Preview
            </span>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={resetState}
              className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 rounded-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black hover:bg-white/90 rounded-full shadow-lg"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <Label className="text-sm font-bold uppercase tracking-wider">SVG Filter</Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(svgFilterCode, "SVG Filter")} className="hover:bg-white/5">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Textarea
                  value={svgFilterCode}
                  readOnly
                  className="bg-black/20 border-white/5 h-32 text-[10px] font-mono resize-none focus-visible:ring-0"
                />
                <p className="text-[10px] text-white/40 italic">
                  Note: Place this SVG anywhere in your HTML body.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <Label className="text-sm font-bold uppercase tracking-wider">CSS Styles</Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(cssCode, "CSS Code")} className="hover:bg-white/5">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={cssCode}
                readOnly
                className="bg-black/20 border-white/5 h-32 text-[10px] font-mono resize-none focus-visible:ring-0"
              />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <Label className="text-sm font-bold uppercase tracking-wider">HTML</Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(htmlCode, "HTML Code")} className="hover:bg-white/5">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={htmlCode}
                readOnly
                className="bg-black/20 border-white/5 h-32 text-[10px] font-mono resize-none focus-visible:ring-0"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-5">
        <Tabs defaultValue="distortion" className="w-full">
          <TabsList className="w-full bg-slate-900/50 border border-white/5 p-1 mb-6 rounded-xl h-12">
            <TabsTrigger value="distortion" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">
              <Settings2 className="w-4 h-4 mr-2" />
              Distortion
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black">
              <Sun className="w-4 h-4 mr-2" />
              Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="distortion" className="space-y-6 mt-0">
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    Turbulence <div className="h-px flex-1 bg-white/5" />
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Freq X</Label>
                        <span className="font-mono text-xs text-white/40">{state.baseFrequencyX}</span>
                      </div>
                      <Slider 
                        value={[state.baseFrequencyX]} 
                        max={0.1} min={0.001} step={0.001} 
                        onValueChange={([v]) => onStateChange({ ...state, baseFrequencyX: v })} 
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Freq Y</Label>
                        <span className="font-mono text-xs text-white/40">{state.baseFrequencyY}</span>
                      </div>
                      <Slider 
                        value={[state.baseFrequencyY]} 
                        max={0.1} min={0.001} step={0.001} 
                        onValueChange={([v]) => onStateChange({ ...state, baseFrequencyY: v })} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Octaves</Label>
                        <span className="font-mono text-xs text-white/40">{state.numOctaves}</span>
                      </div>
                      <Slider 
                        value={[state.numOctaves]} 
                        max={5} min={1} step={1} 
                        onValueChange={([v]) => onStateChange({ ...state, numOctaves: v })} 
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Seed</Label>
                        <span className="font-mono text-xs text-white/40">{state.seed}</span>
                      </div>
                      <Slider 
                        value={[state.seed]} 
                        max={100} min={0} step={1} 
                        onValueChange={([v]) => onStateChange({ ...state, seed: v })} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    Gamma (Transfer) <div className="h-px flex-1 bg-white/5" />
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Amplitude</Label>
                        <span className="font-mono text-xs text-white/40">{state.gammaAmplitude}</span>
                      </div>
                      <Slider 
                        value={[state.gammaAmplitude]} 
                        max={5} min={0} step={0.1} 
                        onValueChange={([v]) => onStateChange({ ...state, gammaAmplitude: v })} 
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Exponent</Label>
                        <span className="font-mono text-xs text-white/40">{state.gammaExponent}</span>
                      </div>
                      <Slider 
                        value={[state.gammaExponent]} 
                        max={20} min={1} step={1} 
                        onValueChange={([v]) => onStateChange({ ...state, gammaExponent: v })} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    Displacement <div className="h-px flex-1 bg-white/5" />
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-[10px] font-bold uppercase text-white/60">Scale</Label>
                      <span className="font-mono text-xs text-white/40">{state.displacementScale}</span>
                    </div>
                    <Slider 
                      value={[state.displacementScale]} 
                      max={500} min={0} step={1} 
                      onValueChange={([v]) => onStateChange({ ...state, displacementScale: v })} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-0">
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    Colors & Lighting <div className="h-px flex-1 bg-white/5" />
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase text-white/60">Lighting</Label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={state.lightingColor} 
                          onChange={(e) => onStateChange({ ...state, lightingColor: e.target.value })} 
                          className="w-full h-10 border border-white/5 cursor-pointer bg-black/20 rounded-lg p-1" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase text-white/60">Tint</Label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={state.tintColor} 
                          onChange={(e) => onStateChange({ ...state, tintColor: e.target.value })} 
                          className="w-full h-10 border border-white/5 cursor-pointer bg-black/20 rounded-lg p-1" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-[10px] font-bold uppercase text-white/60">Tint Opacity</Label>
                      <span className="font-mono text-xs text-white/40">{state.tintOpacity}%</span>
                    </div>
                    <Slider 
                      value={[state.tintOpacity]} 
                      max={100} min={0} 
                      onValueChange={([v]) => onStateChange({ ...state, tintOpacity: v })} 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    Dimensions <div className="h-px flex-1 bg-white/5" />
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Radius</Label>
                        <span className="font-mono text-xs text-white/40">{state.borderRadius}px</span>
                      </div>
                      <Slider 
                        value={[state.borderRadius]} 
                        max={100} min={0} step={1} 
                        onValueChange={([v]) => onStateChange({ ...state, borderRadius: v })} 
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label className="text-[10px] font-bold uppercase text-white/60">Padding</Label>
                        <span className="font-mono text-xs text-white/40">{state.padding}px</span>
                      </div>
                      <Slider 
                        value={[state.padding]} 
                        max={100} min={10} step={1} 
                        onValueChange={([v]) => onStateChange({ ...state, padding: v })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-[10px] font-bold uppercase text-white/60">Backdrop Blur</Label>
                      <span className="font-mono text-xs text-white/40">{state.backdropBlur}px</span>
                    </div>
                    <Slider 
                      value={[state.backdropBlur]} 
                      max={20} min={0} step={1} 
                      onValueChange={([v]) => onStateChange({ ...state, backdropBlur: v })} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
