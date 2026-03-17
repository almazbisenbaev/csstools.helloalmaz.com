 "use client"
 
 import { useState } from "react"
 import { useRouter } from "next/navigation"
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 import CSSFiltersGenerator from "@/components/css-filters-generator"
 import BackdropFiltersGenerator from "@/components/backdrop-filters-generator"
 import BoxShadowGenerator from "@/components/box-shadow-generator"
 import GlassmorphismGenerator from "@/components/glassmorphism-generator"
 import TransformGenerator from "@/components/transform-generator"
 import type { FiltersState, BackdropFiltersState, BoxShadowState, GlassState, TransformState } from "@/types/filters"
 
 export default function Page() {
   const router = useRouter()
 
   const [filtersState, setFiltersState] = useState<FiltersState>({
     filters: [
       { name: "Blur", property: "blur", min: 0, max: 10, default: 0, unit: "px", enabled: false, value: 0 },
       { name: "Brightness", property: "brightness", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Contrast", property: "contrast", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Grayscale", property: "grayscale", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
       { name: "Hue Rotate", property: "hue-rotate", min: 0, max: 360, default: 0, unit: "deg", enabled: false, value: 0 },
       { name: "Invert", property: "invert", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
       { name: "Opacity", property: "opacity", min: 0, max: 100, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Saturate", property: "saturate", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Sepia", property: "sepia", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
     ],
     dropShadow: { enabled: false, offsetX: 0, offsetY: 0, blurRadius: 0, color: "#000000" },
     previewImage: "/placeholder.jpg",
   })
 
   const [backdropFiltersState, setBackdropFiltersState] = useState<BackdropFiltersState>({
     filters: [
       { name: "Blur", property: "blur", min: 0, max: 20, default: 0, unit: "px", enabled: false, value: 0 },
       { name: "Brightness", property: "brightness", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Contrast", property: "contrast", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Grayscale", property: "grayscale", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
       { name: "Hue Rotate", property: "hue-rotate", min: 0, max: 360, default: 0, unit: "deg", enabled: false, value: 0 },
       { name: "Invert", property: "invert", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
       { name: "Opacity", property: "opacity", min: 0, max: 100, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Saturate", property: "saturate", min: 0, max: 200, default: 100, unit: "%", enabled: false, value: 100 },
       { name: "Sepia", property: "sepia", min: 0, max: 100, default: 0, unit: "%", enabled: false, value: 0 },
     ],
     backgroundImage: "/placeholder.jpg?height=600&width=800",
   })
 
   const [boxShadowState, setBoxShadowState] = useState<BoxShadowState>({
     shadows: [],
     previewImage: "/placeholder.jpg",
   })
 
   const [glassState, setGlassState] = useState<GlassState>({
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
 
   const [transformState, setTransformState] = useState<TransformState>({
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
 
   return (
     <div className="min-h-screen bg-background">
       <div className="container mx-auto py-8">
         <div className="text-center space-y-4 mb-8">
           <h1 className="text-4xl font-bold">CSS Playfround</h1>
           <p className="text-muted-foreground text-lg">Generate CSS filters, backdrop filters, box shadows, glassmorphism, and transforms</p>
         </div>
 
         <Tabs
           value="transform"
           onValueChange={(v) => {
             if (v === "filters") router.push("/filters")
             else if (v === "backdrop") router.push("/backdrop")
             else if (v === "shadows") router.push("/shadows")
             else if (v === "glass") router.push("/glass")
             else router.push("/transform")
           }}
           className="w-full"
         >
           <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8">
             <TabsTrigger value="filters">CSS Filters</TabsTrigger>
             <TabsTrigger value="backdrop">Backdrop Filters</TabsTrigger>
             <TabsTrigger value="shadows">Box Shadows</TabsTrigger>
             <TabsTrigger value="glass">Glassmorphism</TabsTrigger>
             <TabsTrigger value="transform">Transform</TabsTrigger>
           </TabsList>
 
 
           <TabsContent value="filters">
             <CSSFiltersGenerator state={filtersState} onStateChange={setFiltersState} />
           </TabsContent>
 
           <TabsContent value="backdrop">
             <BackdropFiltersGenerator state={backdropFiltersState} onStateChange={setBackdropFiltersState} />
           </TabsContent>
 
           <TabsContent value="shadows">
             <BoxShadowGenerator state={boxShadowState} onStateChange={setBoxShadowState} />
           </TabsContent>
 
           <TabsContent value="glass">
             <GlassmorphismGenerator state={glassState} onStateChange={setGlassState} />
           </TabsContent>
 
           <TabsContent value="transform">
             <TransformGenerator state={transformState} onStateChange={setTransformState} />
           </TabsContent>
         </Tabs>
 
         <div className="px-2 text-center text-sm pt-5 pb-5 mt-10 text-gray-500 border-t">
           Author: <a className="text-black hover:underline" href="//helloalmaz.com" target="_blank">Almaz Bissenbayev</a>
         </div>
       </div>
     </div>
   )
 }
