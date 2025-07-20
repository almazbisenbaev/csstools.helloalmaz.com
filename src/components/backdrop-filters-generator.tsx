"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
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
import type { FilterConfig, BackdropFiltersState } from "@/types/filters"

interface BackdropFiltersGeneratorProps {
  state: BackdropFiltersState
  onStateChange: (state: BackdropFiltersState) => void
}

export default function BackdropFiltersGenerator({ state, onStateChange }: BackdropFiltersGeneratorProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
    const newFilters = state.filters.map((filter, i) => (i === index ? { ...filter, ...updates } : filter))
    onStateChange({ ...state, filters: newFilters })
  }

  const resetFilters = () => {
    const resetFilters = state.filters.map((filter) => ({
      ...filter,
      enabled: false,
      value: filter.default,
    }))
    onStateChange({ ...state, filters: resetFilters })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onStateChange({ ...state, backgroundImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const generateFilterString = () => {
    const activeFilters = state.filters.filter((filter) => filter.enabled)
    if (activeFilters.length === 0) return "none"

    return activeFilters.map((filter) => `${filter.property}(${filter.value}${filter.unit})`).join(" ")
  }

  const generateCSS = () => {
    const filterString = generateFilterString()
    return `.backdrop-element {
  backdrop-filter: ${filterString};
  -webkit-backdrop-filter: ${filterString};
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

  const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - dragPosition.x,
        y: e.clientY - dragPosition.y,
      })
    },
    [dragPosition],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const cardWidth = 300 // Approximate card width
      const cardHeight = 200 // Approximate card height

      let newX = e.clientX - dragStart.x
      let newY = e.clientY - dragStart.y

      // Keep within boundaries
      newX = Math.max(0, Math.min(containerRect.width - cardWidth, newX))
      newY = Math.max(0, Math.min(containerRect.height - cardHeight, newY))

      setDragPosition({ x: newX, y: newY })
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add event listeners
  React.useEffect(() => {
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Controls Section - Left Side */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Backdrop Filter Controls
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
                        id={`backdrop-filter-${index}`}
                        checked={filter.enabled}
                        onCheckedChange={(checked) => updateFilter(index, { enabled: !!checked })}
                      />
                      <Label htmlFor={`backdrop-filter-${index}`} className="text-sm font-medium cursor-pointer">
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

                    {index < state.filters.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section - Right Side */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Backdrop Filter Preview</CardTitle>
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
                    Upload Background
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">Choose background image</span>
                </div>

                {/* Preview with Backdrop Filter */}
                <div
                  ref={containerRef}
                  className="relative overflow-hidden rounded-lg border min-h-96 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${state.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className={`absolute bg-white/20 border border-white/30 rounded-lg p-6 text-center backdrop-blur-sm select-none ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{
                      backdropFilter: generateFilterString(),
                      WebkitBackdropFilter: generateFilterString(),
                      left: `${dragPosition.x}px`,
                      top: `${dragPosition.y}px`,
                      width: "300px",
                      height: "200px",
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">Backdrop Filter Demo</h3>
                    <p className="text-white/90 text-sm">This element has backdrop filters applied</p>
                    <p className="text-white/70 text-xs mt-2">Drag me around!</p>
                    <div className="mt-4 px-3 py-2 bg-white/10 rounded border border-white/20">
                      <span className="text-white text-xs">Sample content behind the filter</span>
                    </div>
                  </div>
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
