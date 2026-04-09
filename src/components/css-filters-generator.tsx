"use client"

import type React from "react"
import { useRef } from "react"
import { Copy, RotateCcw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { FilterConfig, DropShadowConfig, FiltersState } from "@/types/filters"

interface CSSFiltersGeneratorProps {
  state: FiltersState
  onStateChange: (state: FiltersState) => void
}

export default function CSSFiltersGenerator({ state, onStateChange }: CSSFiltersGeneratorProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
    const newFilters = state.filters.map((filter, i) => (i === index ? { ...filter, ...updates } : filter))
    onStateChange({ ...state, filters: newFilters })
  }

  const updateDropShadow = (updates: Partial<DropShadowConfig>) => {
    onStateChange({ ...state, dropShadow: { ...state.dropShadow, ...updates } })
  }

  const resetFilters = () => {
    const resetFilters = state.filters.map((filter) => ({
      ...filter,
      enabled: false,
      value: filter.default,
    }))
    const resetDropShadow = {
      enabled: false,
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      color: "#000000",
    }
    onStateChange({ ...state, filters: resetFilters, dropShadow: resetDropShadow })
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

  const generateFilterString = () => {
    const activeFilters = state.filters.filter((filter) => filter.enabled)
    const filterStrings = activeFilters.map((filter) => `${filter.property}(${filter.value}${filter.unit})`)

    if (state.dropShadow.enabled) {
      const shadowColor = state.dropShadow.color + "80"
      filterStrings.push(
        `drop-shadow(${state.dropShadow.offsetX}px ${state.dropShadow.offsetY}px ${state.dropShadow.blurRadius}px ${shadowColor})`,
      )
    }

    return filterStrings.length > 0 ? filterStrings.join(" ") : "none"
  }

  const generateCSS = () => {
    const filterString = generateFilterString()
    return `filter: ${filterString};`
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

  const filterString = generateFilterString()

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-8 sticky top-24">
        <div className="group relative bg-[#f5f5f5] overflow-hidden aspect-[4/3] flex items-center justify-center rounded-2xl shadow-xl">
          <div className="w-1/2 h-1/2 relative">
            <img
              src={state.previewImage}
              alt="Preview"
              className="w-full h-full object-cover transition-all"
              style={{ filter: filterString }}
            />
          </div>
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all pointer-events-none" />
          
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Adjustments</h2>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>

        <div className="space-y-6">
          {state.filters.map((filter, index) => (
            <div key={filter.property} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`filter-${index}`}
                    checked={filter.enabled}
                    onCheckedChange={(checked) => updateFilter(index, { enabled: !!checked })}
                  />
                  <Label htmlFor={`filter-${index}`} className="cursor-pointer">
                    {filter.name}
                  </Label>
                </div>
                <span className="font-mono text-sm font-bold">
                  {filter.value}{filter.unit}
                </span>
              </div>

              {filter.enabled && (
                <div className="pl-10">
                  <Slider
                    value={[filter.value]}
                    onValueChange={(value) => updateFilter(index, { value: value[0] })}
                    min={filter.min}
                    max={filter.max}
                    step={filter.property === "blur" ? 0.1 : 1}
                  />
                </div>
              )}
              <Separator className="opacity-50" />
            </div>
          ))}

          {/* Drop Shadow Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
              <Checkbox
                id="drop-shadow"
                checked={state.dropShadow.enabled}
                onCheckedChange={(checked) => updateDropShadow({ enabled: !!checked })}
              />
              <Label htmlFor="drop-shadow" className="text-xl">Drop Shadow</Label>
            </div>

            {state.dropShadow.enabled && (
              <div className="pl-10 space-y-8 border-l border-primary/10">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label className="text-[10px]">Offset X</Label>
                    <span className="font-mono text-xs font-bold">{state.dropShadow.offsetX}px</span>
                  </div>
                  <Slider
                    value={[state.dropShadow.offsetX]}
                    onValueChange={(value) => updateDropShadow({ offsetX: value[0] })}
                    min={-50}
                    max={50}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label className="text-[10px]">Offset Y</Label>
                    <span className="font-mono text-xs font-bold">{state.dropShadow.offsetY}px</span>
                  </div>
                  <Slider
                    value={[state.dropShadow.offsetY]}
                    onValueChange={(value) => updateDropShadow({ offsetY: value[0] })}
                    min={-50}
                    max={50}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label className="text-[10px]">Blur</Label>
                    <span className="font-mono text-xs font-bold">{state.dropShadow.blurRadius}px</span>
                  </div>
                  <Slider
                    value={[state.dropShadow.blurRadius]}
                    onValueChange={(value) => updateDropShadow({ blurRadius: value[0] })}
                    min={0}
                    max={100}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px]">Color</Label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={state.dropShadow.color}
                      onChange={(e) => updateDropShadow({ color: e.target.value })}
                      className="w-12 h-12 border border-primary/10 cursor-pointer bg-transparent rounded-lg"
                    />
                    <span className="font-mono text-xs font-bold uppercase">{state.dropShadow.color}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
