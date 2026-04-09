export interface FilterConfig {
  name: string
  property: string
  min: number
  max: number
  default: number
  unit: string
  enabled: boolean
  value: number
}

export interface DropShadowConfig {
  enabled: boolean
  offsetX: number
  offsetY: number
  blurRadius: number
  color: string
}

export interface BoxShadowConfig {
  id: string
  enabled: boolean
  inset: boolean
  offsetX: number
  offsetY: number
  blurRadius: number
  spreadRadius: number
  color: string
}

export interface FiltersState {
  filters: FilterConfig[]
  dropShadow: DropShadowConfig
  previewImage: string
}

export interface BackdropFiltersState {
  filters: FilterConfig[]
  backgroundImage: string
}

export interface BoxShadowState {
  shadows: BoxShadowConfig[]
  previewImage: string
}

export interface GlassState {
  backgroundColor: string
  opacity: number
  blur: number
  saturation: number
  borderRadius: number
  borderWidth: number
  borderColor: string
  shadowEnabled: boolean
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowSpread: number
  shadowColor: string
  previewBackground: string
}

export interface TransformState {
  rotate: number
  rotateX: number
  rotateY: number
  rotateZ: number
  translateX: number
  translateY: number
  translateZ: number
  scale: number
  scaleX: number
  scaleY: number
  scaleZ: number
  skewX: number
  skewY: number
  perspective: number
  originX: number
  originY: number
  preserve3d: boolean
  previewBackground: string
}

export interface LiquidGlassState {
  // SVG Filter - Turbulence
  baseFrequencyX: number
  baseFrequencyY: number
  numOctaves: number
  seed: number

  // SVG Filter - Gaussian Blur
  blurStdDeviation: number

  // SVG Filter - Specular Lighting
  surfaceScale: number
  specularConstant: number
  specularExponent: number
  lightingColor: string
  lightX: number
  lightY: number
  lightZ: number

  // SVG Filter - Displacement Map
  displacementScale: number

  // CSS Styles
  backdropBlur: number
  tintColor: string
  tintOpacity: number
  borderRadius: number

  // Preview
  previewBackground: string
}
