 "use client"
 
 import { useMemo, useRef } from "react"
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
 import type { GlassState } from "@/types/filters"
 
 interface GlassProps {
   state: GlassState
   onStateChange: (s: GlassState) => void
 }
 
 function hexToRgb(hex: string) {
   let h = hex.replace("#", "")
   if (h.length === 3) {
     h = h
       .split("")
       .map((c) => c + c)
       .join("")
   }
   const bigint = parseInt(h, 16)
   const r = (bigint >> 16) & 255
   const g = (bigint >> 8) & 255
   const b = bigint & 255
   return { r, g, b }
 }
 
 export default function GlassmorphismGenerator({ state, onStateChange }: GlassProps) {
   const { toast } = useToast()
   const cssRef = useRef<HTMLTextAreaElement>(null)
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
     const rules = [
       `background: ${rgbaBg};`,
       `backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);`,
       `-webkit-backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);`,
       `border-radius: ${state.borderRadius}px;`,
       `border: ${state.borderWidth}px solid ${state.borderColor};`,
       `box-shadow: ${boxShadow};`,
     ]
     return `.glass{\n  ${rules.join("\n  ")}\n}`
   }, [rgbaBg, state.blur, state.saturation, state.borderRadius, state.borderWidth, state.borderColor, boxShadow])
 
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
     <div className="max-w-7xl mx-auto p-6">
       <div className="grid lg:grid-cols-5 gap-6">
         <div className="lg:col-span-2">
           <Card className="h-fit">
             <CardHeader>
               <CardTitle className="flex items-center justify-between">
                Matte Glass Controls
                 <Button variant="outline" size="sm" onClick={reset} className="bg-transparent">
                   <RotateCcw className="w-4 h-4" />
                   Reset
                 </Button>
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-6">
                 <div className="space-y-2">
                   <Label>Background Color</Label>
                   <div className="flex items-center gap-3">
                     <Input
                       type="color"
                       value={state.backgroundColor}
                       onChange={(e) => onStateChange({ ...state, backgroundColor: e.target.value })}
                       className="w-16 h-10 p-1"
                     />
                     <Input
                       type="text"
                       value={state.backgroundColor}
                       onChange={(e) => onStateChange({ ...state, backgroundColor: e.target.value })}
                     />
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <Label>Opacity</Label>
                     <span className="text-sm text-muted-foreground">{state.opacity}%</span>
                   </div>
                   <Slider
                     value={[state.opacity]}
                     max={100}
                     min={0}
                     step={1}
                     onValueChange={([v]) => onStateChange({ ...state, opacity: v })}
                   />
                 </div>
 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between">
                       <Label>Blur</Label>
                       <span className="text-sm text-muted-foreground">{state.blur}px</span>
                     </div>
                     <Slider value={[state.blur]} max={40} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, blur: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between">
                       <Label>Saturation</Label>
                       <span className="text-sm text-muted-foreground">{state.saturation}%</span>
                     </div>
                     <Slider value={[state.saturation]} max={300} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, saturation: v })} />
                   </div>
                 </div>
 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between">
                       <Label>Border Radius</Label>
                       <span className="text-sm text-muted-foreground">{state.borderRadius}px</span>
                     </div>
                     <Slider value={[state.borderRadius]} max={64} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, borderRadius: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between">
                       <Label>Border Width</Label>
                       <span className="text-sm text-muted-foreground">{state.borderWidth}px</span>
                     </div>
                     <Slider value={[state.borderWidth]} max={10} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, borderWidth: v })} />
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <Label>Border Color</Label>
                   <Input
                     type="text"
                     value={state.borderColor}
                     onChange={(e) => onStateChange({ ...state, borderColor: e.target.value })}
                   />
                 </div>
 
                 <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <Checkbox
                       id="shadow-enabled"
                       checked={state.shadowEnabled}
                       onCheckedChange={(c) => onStateChange({ ...state, shadowEnabled: !!c })}
                     />
                     <Label htmlFor="shadow-enabled">Shadow</Label>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Shadow X</Label>
                         <span className="text-sm text-muted-foreground">{state.shadowX}px</span>
                       </div>
                       <Slider value={[state.shadowX]} max={64} min={-64} step={1} onValueChange={([v]) => onStateChange({ ...state, shadowX: v })} />
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Shadow Y</Label>
                         <span className="text-sm text-muted-foreground">{state.shadowY}px</span>
                       </div>
                       <Slider value={[state.shadowY]} max={64} min={-64} step={1} onValueChange={([v]) => onStateChange({ ...state, shadowY: v })} />
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Shadow Blur</Label>
                         <span className="text-sm text-muted-foreground">{state.shadowBlur}px</span>
                       </div>
                       <Slider value={[state.shadowBlur]} max={64} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, shadowBlur: v })} />
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Shadow Spread</Label>
                         <span className="text-sm text-muted-foreground">{state.shadowSpread}px</span>
                       </div>
                       <Slider value={[state.shadowSpread]} max={32} min={-32} step={1} onValueChange={([v]) => onStateChange({ ...state, shadowSpread: v })} />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label>Shadow Color</Label>
                     <Input
                       type="text"
                       value={state.shadowColor}
                       onChange={(e) => onStateChange({ ...state, shadowColor: e.target.value })}
                     />
                   </div>
                 </div>
 
                 <Separator />
 
                <div className="space-y-2">
                  <Label>Preview Background</Label>
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
                </div>
               </div>
             </CardContent>
           </Card>
         </div>
 
         <div className="lg:col-span-3">
           <div
             className="relative rounded-xl overflow-hidden border bg-cover bg-center p-10 min-h-[360px]"
             style={{ backgroundImage: `url('${state.previewBackground}')` }}
           >
             <div
               className="max-w-md mx-auto p-6 text-center text-foreground"
               style={{
                 background: rgbaBg,
                 backdropFilter: `blur(${state.blur}px) saturate(${state.saturation}%)`,
                 WebkitBackdropFilter: `blur(${state.blur}px) saturate(${state.saturation}%)`,
                 borderRadius: state.borderRadius,
                 border: `${state.borderWidth}px solid ${state.borderColor}`,
                 boxShadow,
               }}
             >
              <div className="text-2xl font-semibold">Matte glass</div>
               <div className="text-sm text-muted-foreground mt-2">
                 Drag sliders to tweak the effect
               </div>
             </div>
           </div>
 
           <div className="grid md:grid-cols-2 gap-6 mt-6">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between">
                 <CardTitle>CSS</CardTitle>
                 <Button size="sm" onClick={() => copy(cssCode, "CSS")}>
                   <Copy className="w-4 h-4" />
                   Copy
                 </Button>
               </CardHeader>
               <CardContent>
                 <Textarea ref={cssRef} value={cssCode} readOnly rows={10} />
               </CardContent>
             </Card>
           </div>
         </div>
       </div>
     </div>
   )
 }
