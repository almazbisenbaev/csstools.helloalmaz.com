"use client"

import type React from "react"

import { useRef } from "react"
import { Copy, RotateCcw, Upload, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { BoxShadowConfig, BoxShadowState } from "@/types/filters"

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
    return `.shadow-element {
  box-shadow: ${boxShadowString};
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
                Box Shadow Controls
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addShadow}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetShadows}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {state.shadows.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No shadows added yet.</p>
                    <Button variant="outline" onClick={addShadow} className="mt-2 bg-transparent">
                      Add your first shadow
                    </Button>
                  </div>
                ) : (
                  state.shadows.map((shadow, index) => (
                    <div key={shadow.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`shadow-${shadow.id}`}
                            checked={shadow.enabled}
                            onCheckedChange={(checked) => updateShadow(shadow.id, { enabled: !!checked })}
                          />
                          <Label htmlFor={`shadow-${shadow.id}`} className="text-sm font-medium cursor-pointer">
                            Shadow {index + 1}
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeShadow(shadow.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {shadow.enabled && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`inset-${shadow.id}`}
                              checked={shadow.inset}
                              onCheckedChange={(checked) => updateShadow(shadow.id, { inset: !!checked })}
                            />
                            <Label htmlFor={`inset-${shadow.id}`} className="text-xs cursor-pointer">
                              Inset
                            </Label>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Offset X: {shadow.offsetX}px</Label>
                              <Slider
                                value={[shadow.offsetX]}
                                onValueChange={(value) => updateShadow(shadow.id, { offsetX: value[0] })}
                                min={-50}
                                max={50}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Offset Y: {shadow.offsetY}px</Label>
                              <Slider
                                value={[shadow.offsetY]}
                                onValueChange={(value) => updateShadow(shadow.id, { offsetY: value[0] })}
                                min={-50}
                                max={50}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Blur Radius: {shadow.blurRadius}px</Label>
                              <Slider
                                value={[shadow.blurRadius]}
                                onValueChange={(value) => updateShadow(shadow.id, { blurRadius: value[0] })}
                                min={0}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Spread Radius: {shadow.spreadRadius}px</Label>
                              <Slider
                                value={[shadow.spreadRadius]}
                                onValueChange={(value) => updateShadow(shadow.id, { spreadRadius: value[0] })}
                                min={-50}
                                max={50}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Shadow Color</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="color"
                                  value={shadow.color}
                                  onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                                  className="w-12 h-8 p-1 border rounded"
                                />
                                <Input
                                  type="text"
                                  value={shadow.color}
                                  onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                                  className="flex-1 text-xs font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {index < state.shadows.length - 1 && <Separator />}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section - Right Side */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Box Shadow Preview</CardTitle>
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

                {/* Preview with Box Shadow */}
                <div className="bg-gray-100 p-8 rounded-lg border min-h-80 flex items-center justify-center">
                  <div
                    className="bg-white rounded-lg p-6 transition-all duration-200 max-w-sm"
                    style={{ boxShadow: generateBoxShadowString() }}
                  >
                    <img
                      src={state.previewImage || "/placeholder.svg"}
                      alt="Box shadow preview"
                      className="w-full object-cover rounded"
                      crossOrigin="anonymous"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold">Box Shadow Demo</h3>
                      <p className="text-sm text-muted-foreground">This element has box shadows applied</p>
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
