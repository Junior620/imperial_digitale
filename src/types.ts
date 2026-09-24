export type Language = 'fr' | 'en'
export type PageId = 'home' | 'about' | 'services' | 'industries' | 'approach' | 'projects' | 'contact'
export interface TextBlock { title: string; body: string }
export interface PageIntro { eyebrow: string; title: string; description: string }
export interface Service extends TextBlock { id: string; items: string[] }
export interface Industry extends TextBlock { id: string; serviceIds: string[] }
export interface Project { id: string; title: string; sector: string; context: string; support: string; deliverables: string[]; image: string; imageAlt: string }
export interface SiteContent {
  brand: string
  location: string
  availability: string
  nav: Record<PageId, string>
  meta: string
  hero: { eyebrow: string; title: string; description: string; slides: { label: string; alt: string }[] }
  home: { introLabel: string; introTitle: string; introBody: string; context: string[]; benefitsTitle: string; benefits: string[]; whyTitle: string; why: TextBlock[]; closingTitle: string; closingBody: string }
  about: { eyebrow: string; title: string; intro: string[]; teamTitle: string; teamBody: string[]; founderName: string; founderRole: string; founderBio: string[]; valuesTitle: string; values: string[] }
  servicesIntro: PageIntro
  services: Service[]
  industriesIntro: PageIntro
  industries: Industry[]
  approachIntro: PageIntro
  steps: TextBlock[]
  projectsIntro: PageIntro
  projects: Project[]
  contactIntro: PageIntro
  footer: { description: string; expertise: string }
}
