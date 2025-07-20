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
