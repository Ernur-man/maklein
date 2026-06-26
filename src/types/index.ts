export interface SiteConfig {
  logoUrl: string
  brandName: string
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  heroImageUrl: string
}

export interface HowItWorksStep {
  id: string
  step: number
  title: string
  description: string
  icon: string
}

export interface Teacher {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  experience: string
}

export interface Review {
  id: string
  author: string
  text: string
  rating: number
  avatarUrl: string
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  ctaText: string
}

export interface SiteData {
  config: SiteConfig
  howItWorks: HowItWorksStep[]
  teachers: Teacher[]
  reviews: Review[]
  pricing: PricingPlan[]
}

export type DataLoadState = 'idle' | 'loading' | 'success' | 'error'

export interface DataLoadResult<T> {
  data: T | null
  state: DataLoadState
  error: string | null
}
