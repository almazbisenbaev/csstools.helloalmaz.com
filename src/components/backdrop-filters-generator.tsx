"use client"

import React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Copy, RotateCcw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { FilterConfig, BackdropFiltersState } from "@/types/filters"

interface BackdropFiltersGeneratorProps {
  state: BackdropFiltersState
  onStateChange: (state: BackdropFiltersState) => void
}

export default function BackdropFiltersGenerator({ state, onStateChange }: BackdropFiltersGeneratorProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [dragPosition, setDragPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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
    return `backdrop-filter: ${filterString};
-webkit-backdrop-filter: ${filterString};`
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
    newX = Math.max(0, Math.min(containerRect.width - 320, newX))
    newY = Math.max(0, Math.min(containerRect.height - 220, newY))
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

  const filterString = generateFilterString()

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-8 sticky top-24">
        <div 
          ref={containerRef}
          className="relative bg-white overflow-hidden aspect-[4/3] flex items-center justify-center cursor-crosshair select-none rounded-2xl shadow-xl"
        >
          <img
            src={state.backgroundImage}
            alt="Preview Background"
            className="w-full h-full object-cover pointer-events-none"
          />
          
          <div
            className="absolute border border-white/40 shadow-2xl overflow-hidden cursor-move transition-shadow active:shadow-sm rounded-xl"
            style={{
              width: "300px",
              height: "200px",
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              backdropFilter: filterString,
              WebkitBackdropFilter: filterString,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md">
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
                    id={`backdrop-filter-${index}`}
                    checked={filter.enabled}
                    onCheckedChange={(checked) => updateFilter(index, { enabled: !!checked })}
                  />
                  <Label htmlFor={`backdrop-filter-${index}`} className="cursor-pointer">
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
        </div>
      </div>
    </div>
  )
}
