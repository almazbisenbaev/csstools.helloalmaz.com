 "use client"
 
 import { useMemo, useRef } from "react"
import { Copy, RotateCcw } from "lucide-react"
 import { Button } from "@/components/ui/button"
 import { Checkbox } from "@/components/ui/checkbox"
 import { Label } from "@/components/ui/label"
 import { Slider } from "@/components/ui/slider"
 import { Textarea } from "@/components/ui/textarea"
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { Separator } from "@/components/ui/separator"
 import { useToast } from "@/hooks/use-toast"
 import type { TransformState } from "@/types/filters"
 
 interface TransformProps {
   state: TransformState
   onStateChange: (s: TransformState) => void
 }
 
 export default function TransformGenerator({ state, onStateChange }: TransformProps) {
   const { toast } = useToast()
   const cssRef = useRef<HTMLTextAreaElement>(null)
 
 
   const transformString = useMemo(() => {
     const parts: string[] = []
     if (state.perspective > 0) parts.push(`perspective(${state.perspective}px)`)
     if (state.translateX !== 0 || state.translateY !== 0) parts.push(`translate(${state.translateX}px, ${state.translateY}px)`)
     if (state.translateZ !== 0) parts.push(`translateZ(${state.translateZ}px)`)
     if (state.rotate !== 0) parts.push(`rotate(${state.rotate}deg)`)
     if (state.rotateX !== 0) parts.push(`rotateX(${state.rotateX}deg)`)
     if (state.rotateY !== 0) parts.push(`rotateY(${state.rotateY}deg)`)
     if (state.rotateZ !== 0) parts.push(`rotateZ(${state.rotateZ}deg)`)
     if (state.skewX !== 0) parts.push(`skewX(${state.skewX}deg)`)
     if (state.skewY !== 0) parts.push(`skewY(${state.skewY}deg)`)
     if (state.scale !== 1) parts.push(`scale(${state.scale})`)
     if (state.scaleX !== 1 || state.scaleY !== 1) parts.push(`scale(${state.scaleX}, ${state.scaleY})`)
     if (state.scaleZ !== 1) parts.push(`scaleZ(${state.scaleZ})`)
     return parts.length ? parts.join(" ") : "none"
   }, [state])
 
   const cssCode = useMemo(() => {
     const rules = [
       `transform: ${transformString};`,
       `transform-origin: ${state.originX}% ${state.originY}%;`,
       state.preserve3d ? `transform-style: preserve-3d;` : ``,
     ].filter(Boolean)
     return `.transform-demo{\n  ${rules.join("\n  ")}\n}`
   }, [transformString, state.originX, state.originY, state.preserve3d])
 
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
       rotate: 0,
       rotateX: 0,
       rotateY: 0,
       rotateZ: 0,
       translateX: 0,
       translateY: 0,
       translateZ: 0,
       scale: 1,
       scaleX: 1,
       scaleY: 1,
       scaleZ: 1,
       skewX: 0,
       skewY: 0,
       perspective: 0,
       originX: 50,
       originY: 50,
       preserve3d: false,
       previewBackground: "/placeholder.jpg?height=600&width=800",
     })
   }
 
   return (
     <div className="max-w-7xl mx-auto p-6">
       <div className="grid lg:grid-cols-5 gap-6">
         <div className="lg:col-span-2">
           <Card className="h-fit">
             <CardHeader>
               <CardTitle className="flex items-center justify-between">
                 Transform Controls
                 <Button variant="outline" size="sm" onClick={reset} className="bg-transparent">
                   <RotateCcw className="w-4 h-4" />
                   Reset
                 </Button>
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Rotate</Label><span className="text-sm text-muted-foreground">{state.rotate}deg</span></div>
                     <Slider value={[state.rotate]} max={360} min={-360} step={1} onValueChange={([v]) => onStateChange({ ...state, rotate: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Rotate X</Label><span className="text-sm text-muted-foreground">{state.rotateX}deg</span></div>
                     <Slider value={[state.rotateX]} max={360} min={-360} step={1} onValueChange={([v]) => onStateChange({ ...state, rotateX: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Rotate Y</Label><span className="text-sm text-muted-foreground">{state.rotateY}deg</span></div>
                     <Slider value={[state.rotateY]} max={360} min={-360} step={1} onValueChange={([v]) => onStateChange({ ...state, rotateY: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Rotate Z</Label><span className="text-sm text-muted-foreground">{state.rotateZ}deg</span></div>
                     <Slider value={[state.rotateZ]} max={360} min={-360} step={1} onValueChange={([v]) => onStateChange({ ...state, rotateZ: v })} />
                   </div>
                 </div>
 
                 <Separator />
 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Translate X</Label><span className="text-sm text-muted-foreground">{state.translateX}px</span></div>
                     <Slider value={[state.translateX]} max={200} min={-200} step={1} onValueChange={([v]) => onStateChange({ ...state, translateX: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Translate Y</Label><span className="text-sm text-muted-foreground">{state.translateY}px</span></div>
                     <Slider value={[state.translateY]} max={200} min={-200} step={1} onValueChange={([v]) => onStateChange({ ...state, translateY: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Translate Z</Label><span className="text-sm text-muted-foreground">{state.translateZ}px</span></div>
                     <Slider value={[state.translateZ]} max={200} min={-200} step={1} onValueChange={([v]) => onStateChange({ ...state, translateZ: v })} />
                   </div>
                 </div>
 
                 <Separator />
 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Scale</Label><span className="text-sm text-muted-foreground">{state.scale}</span></div>
                     <Slider value={[state.scale]} max={3} min={0.1} step={0.01} onValueChange={([v]) => onStateChange({ ...state, scale: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Scale X</Label><span className="text-sm text-muted-foreground">{state.scaleX}</span></div>
                     <Slider value={[state.scaleX]} max={3} min={0.1} step={0.01} onValueChange={([v]) => onStateChange({ ...state, scaleX: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Scale Y</Label><span className="text-sm text-muted-foreground">{state.scaleY}</span></div>
                     <Slider value={[state.scaleY]} max={3} min={0.1} step={0.01} onValueChange={([v]) => onStateChange({ ...state, scaleY: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Scale Z</Label><span className="text-sm text-muted-foreground">{state.scaleZ}</span></div>
                     <Slider value={[state.scaleZ]} max={3} min={0.1} step={0.01} onValueChange={([v]) => onStateChange({ ...state, scaleZ: v })} />
                   </div>
                 </div>
 
                 <Separator />
 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Skew X</Label><span className="text-sm text-muted-foreground">{state.skewX}deg</span></div>
                     <Slider value={[state.skewX]} max={60} min={-60} step={1} onValueChange={([v]) => onStateChange({ ...state, skewX: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Skew Y</Label><span className="text-sm text-muted-foreground">{state.skewY}deg</span></div>
                     <Slider value={[state.skewY]} max={60} min={-60} step={1} onValueChange={([v]) => onStateChange({ ...state, skewY: v })} />
                   </div>
                 </div>
 
                 <Separator />
 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Perspective</Label><span className="text-sm text-muted-foreground">{state.perspective}px</span></div>
                     <Slider value={[state.perspective]} max={1000} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, perspective: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Transform Origin X</Label><span className="text-sm text-muted-foreground">{state.originX}%</span></div>
                     <Slider value={[state.originX]} max={100} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, originX: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><Label>Transform Origin Y</Label><span className="text-sm text-muted-foreground">{state.originY}%</span></div>
                     <Slider value={[state.originY]} max={100} min={0} step={1} onValueChange={([v]) => onStateChange({ ...state, originY: v })} />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <Checkbox id="preserve-3d" checked={state.preserve3d} onCheckedChange={(c) => onStateChange({ ...state, preserve3d: !!c })} />
                       <Label htmlFor="preserve-3d">Preserve 3D</Label>
                     </div>
                   </div>
                 </div>
 
                 <Separator />
 
               </div>
             </CardContent>
           </Card>
         </div>
 
         <div className="lg:col-span-3">
           <div className="relative rounded-xl overflow-hidden border bg-cover bg-center p-10 min-h-[360px]" style={{ backgroundImage: `url('${state.previewBackground}')` }}>
             <div
               className="size-40 mx-auto bg-white/20 border border-white/30 rounded-lg flex items-center justify-center text-center text-foreground"
               style={{
                 transform: transformString,
                 transformOrigin: `${state.originX}% ${state.originY}%`,
                 transformStyle: state.preserve3d ? "preserve-3d" : undefined,
               }}
             >
               Transform
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
