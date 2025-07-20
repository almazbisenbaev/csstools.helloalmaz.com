"use client"

import type React from "react"

import { useRef } from "react"
import { Copy, RotateCcw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
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
      const shadowColor = state.dropShadow.color + "80" // Add some transparency
      filterStrings.push(
        `drop-shadow(${state.dropShadow.offsetX}px ${state.dropShadow.offsetY}px ${state.dropShadow.blurRadius}px ${shadowColor})`,
      )
    }

    return filterStrings.length > 0 ? filterStrings.join(" ") : "none"
  }

  const generateCSS = () => {
    const filterString = generateFilterString()
    return `.filtered-element {
  filter: ${filterString};
}`
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Controls Section - Left Side */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Filter Controls
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {state.filters.map((filter, index) => (
                  <div key={filter.property} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${index}`}
                        checked={filter.enabled}
                        onCheckedChange={(checked) => updateFilter(index, { enabled: !!checked })}
                      />
                      <Label htmlFor={`filter-${index}`} className="text-sm font-medium cursor-pointer">
                        {filter.name}
                      </Label>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {filter.value}
                        {filter.unit}
                      </span>
                    </div>

                    <Slider
                      value={[filter.value]}
                      onValueChange={(value) => updateFilter(index, { value: value[0] })}
                      min={filter.min}
                      max={filter.max}
                      step={filter.property === "blur" ? 0.1 : 1}
                      disabled={!filter.enabled}
                      className="w-full"
                    />

                    <Separator />
                  </div>
                ))}

                {/* Drop Shadow Controls */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="drop-shadow"
                      checked={state.dropShadow.enabled}
                      onCheckedChange={(checked) => updateDropShadow({ enabled: !!checked })}
                    />
                    <Label htmlFor="drop-shadow" className="text-sm font-medium cursor-pointer">
                      Drop Shadow
                    </Label>
                  </div>

                  {state.dropShadow.enabled && (
                    <div className="space-y-4 pl-6 border-l-2 border-muted">
                      <div className="space-y-2">
                        <Label className="text-xs">Offset X: {state.dropShadow.offsetX}px</Label>
                        <Slider
                          value={[state.dropShadow.offsetX]}
                          onValueChange={(value) => updateDropShadow({ offsetX: value[0] })}
                          min={-20}
                          max={20}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Offset Y: {state.dropShadow.offsetY}px</Label>
                        <Slider
                          value={[state.dropShadow.offsetY]}
                          onValueChange={(value) => updateDropShadow({ offsetY: value[0] })}
                          min={-20}
                          max={20}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Blur Radius: {state.dropShadow.blurRadius}px</Label>
                        <Slider
                          value={[state.dropShadow.blurRadius]}
                          onValueChange={(value) => updateDropShadow({ blurRadius: value[0] })}
                          min={0}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Shadow Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={state.dropShadow.color}
                            onChange={(e) => updateDropShadow({ color: e.target.value })}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={state.dropShadow.color}
                            onChange={(e) => updateDropShadow({ color: e.target.value })}
                            className="flex-1 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section - Right Side */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">Choose your own image for preview</span>
                </div>

                {/* Preview Image */}
                <div className="relative overflow-hidden rounded-lg border bg-checkered">
                  <img
                    src={state.previewImage || "/placeholder.svg"}
                    alt="Filter preview"
                    className="w-full object-cover transition-all duration-200"
                    style={{ filter: generateFilterString() }}
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Generated CSS */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Generated CSS:</Label>
                  <div className="relative">
                    <Textarea value={generateCSS()} readOnly className="font-mono text-sm resize-none" rows={4} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-background"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
