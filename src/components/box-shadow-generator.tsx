"use client"

import type React from "react"
import { useRef } from "react"
import { Copy, RotateCcw, Upload, Plus, Trash2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { BoxShadowConfig, BoxShadowState } from "@/types/filters"

const PRESETS: Record<string, BoxShadowConfig[]> = {
  "Soft Modern": [
    { id: "soft-1", enabled: true, inset: false, offsetX: 0, offsetY: 4, blurRadius: 10, spreadRadius: 0, color: "rgba(0,0,0,0.1)" },
    { id: "soft-2", enabled: true, inset: false, offsetX: 0, offsetY: 2, blurRadius: 4, spreadRadius: -1, color: "rgba(0,0,0,0.06)" },
  ],
  "Deep Shadow": [
    { id: "deep-1", enabled: true, inset: false, offsetX: 0, offsetY: 20, blurRadius: 25, spreadRadius: -5, color: "rgba(0,0,0,0.1)" },
    { id: "deep-2", enabled: true, inset: false, offsetX: 0, offsetY: 10, blurRadius: 10, spreadRadius: -5, color: "rgba(0,0,0,0.04)" },
  ],
  "Shadow Border": [
    { id: "border-1", enabled: true, inset: false, offsetX: 0, offsetY: 0, blurRadius: 0, spreadRadius: 1, color: "rgba(0,0,0,0.1)" },
    { id: "border-2", enabled: true, inset: false, offsetX: 0, offsetY: 4, blurRadius: 6, spreadRadius: -1, color: "rgba(0,0,0,0.1)" },
  ],
  "Floating Glow": [
    { id: "glow-1", enabled: true, inset: false, offsetX: 0, offsetY: 0, blurRadius: 20, spreadRadius: 5, color: "rgba(0, 0, 0, 0.2)" },
  ],
}

interface BoxShadowGeneratorProps {
  state: BoxShadowState
  onStateChange: (state: BoxShadowState) => void
}

export default function BoxShadowGenerator({ state, onStateChange }: BoxShadowGeneratorProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addShadow = () => {
    const newShadow: BoxShadowConfig = {
      id: Date.now().toString(),
      enabled: true,
      inset: false,
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: "#000000",
    }
    onStateChange({ ...state, shadows: [...state.shadows, newShadow] })
  }

  const removeShadow = (id: string) => {
    onStateChange({ ...state, shadows: state.shadows.filter((shadow) => shadow.id !== id) })
  }

  const updateShadow = (id: string, updates: Partial<BoxShadowConfig>) => {
    const newShadows = state.shadows.map((shadow) => (shadow.id === id ? { ...shadow, ...updates } : shadow))
    onStateChange({ ...state, shadows: newShadows })
  }

  const applyPreset = (presetName: string) => {
    const presetShadows = PRESETS[presetName]
    if (presetShadows) {
      onStateChange({
        ...state,
        shadows: presetShadows.map((s) => ({ ...s, id: Math.random().toString(36).substr(2, 9) })),
      })
    }
  }

  const resetShadows = () => {
    onStateChange({ ...state, shadows: [] })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onStateChange({ ...state, previewImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const generateBoxShadowString = () => {
    const activeShadows = state.shadows.filter((shadow) => shadow.enabled)
    if (activeShadows.length === 0) return "none"
    return activeShadows
      .map((shadow) => {
        const insetStr = shadow.inset ? "inset " : ""
        return `${insetStr}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${shadow.color}`
      })
      .join(", ")
  }

  const generateCSS = () => {
    const boxShadowString = generateBoxShadowString()
    return `box-shadow: ${boxShadowString};`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS())
      toast({
        title: "Copied!",
        description: "CSS code has been copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const boxShadowString = generateBoxShadowString()

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-8 sticky top-24">
        <div className="relative bg-[#f5f5f5] overflow-hidden aspect-[4/3] flex items-center justify-center rounded-2xl shadow-xl">
          <img
            src={state.previewImage}
            alt="Preview"
            className="w-1/2 h-1/2 object-cover border border-primary/10 transition-all rounded-xl shadow-2xl"
            style={{ boxShadow: boxShadowString }}
          />
          
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
            Upload Image
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
              value={generateCSS()}
              readOnly
              className="bg-primary/5 border-primary/20 h-24"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Presets</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map((presetName) => (
              <Button
                key={presetName}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(presetName)}
                className="text-xs"
              >
                {presetName}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Shadows</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addShadow}>
              <Plus className="w-4 h-4 mr-2" />
              Add Shadow
            </Button>
            <Button variant="outline" size="sm" onClick={resetShadows}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {state.shadows.map((shadow, index) => (
            <Card key={shadow.id} className="relative">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id={`shadow-enabled-${shadow.id}`}
                      checked={shadow.enabled}
                      onCheckedChange={(checked) => updateShadow(shadow.id, { enabled: !!checked })}
                    />
                    <Label htmlFor={`shadow-enabled-${shadow.id}`}>
                      Layer #{index + 1}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeShadow(shadow.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {shadow.enabled && (
                  <div className="space-y-6 pl-10 border-l border-primary/10">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        id={`shadow-inset-${shadow.id}`}
                        checked={shadow.inset}
                        onCheckedChange={(checked) => updateShadow(shadow.id, { inset: !!checked })}
                      />
                      <Label htmlFor={`shadow-inset-${shadow.id}`}>Inset</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label className="text-[10px]">Offset X</Label>
                          <span className="font-mono text-xs font-bold">{shadow.offsetX}px</span>
                        </div>
                        <Slider
                          value={[shadow.offsetX]}
                          onValueChange={(val) => updateShadow(shadow.id, { offsetX: val[0] })}
                          min={-100}
                          max={100}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label className="text-[10px]">Offset Y</Label>
                          <span className="font-mono text-xs font-bold">{shadow.offsetY}px</span>
                        </div>
                        <Slider
                          value={[shadow.offsetY]}
                          onValueChange={(val) => updateShadow(shadow.id, { offsetY: val[0] })}
                          min={-100}
                          max={100}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label className="text-[10px]">Blur</Label>
                          <span className="font-mono text-xs font-bold">{shadow.blurRadius}px</span>
                        </div>
                        <Slider
                          value={[shadow.blurRadius]}
                          onValueChange={(val) => updateShadow(shadow.id, { blurRadius: val[0] })}
                          min={0}
                          max={100}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label className="text-[10px]">Spread</Label>
                          <span className="font-mono text-xs font-bold">{shadow.spreadRadius}px</span>
                        </div>
                        <Slider
                          value={[shadow.spreadRadius]}
                          onValueChange={(val) => updateShadow(shadow.id, { spreadRadius: val[0] })}
                          min={-50}
                          max={50}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px]">Color</Label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="color"
                          value={shadow.color.startsWith("rgba") ? "#000000" : shadow.color}
                          onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                          className="w-12 h-12 border border-primary/10 cursor-pointer bg-transparent rounded-lg"
                        />
                        <span className="font-mono text-xs font-bold uppercase">{shadow.color}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {state.shadows.length === 0 && (
            <div className="text-center py-12 border-4 border-dashed border-primary/20">
              <p className="text-muted-foreground font-bold uppercase tracking-widest">
                No shadow layers yet.
              </p>
              <Button variant="outline" className="mt-4" onClick={addShadow}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Layer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
