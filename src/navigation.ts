import type { Language, PageId } from './types'

export const pageIds: PageId[] = ['home', 'about', 'services', 'industries', 'approach', 'projects', 'contact']
export const routes: Record<Language, Record<PageId, string>> = {
  fr: { home: '/fr', about: '/fr/a-propos', services: '/fr/services', industries: '/fr/secteurs', approach: '/fr/notre-approche', projects: '/fr/projets', contact: '/fr/contact' },
  en: { home: '/en', about: '/en/about', services: '/en/services', industries: '/en/industries', approach: '/en/our-approach', projects: '/en/projects', contact: '/en/contact' },
}
export function storedLanguage(): Language {
  try { return localStorage.getItem('imperial-language') === 'en' ? 'en' : 'fr' } catch { return 'fr' }
}
export function rememberLanguage(language: Language) {
  try { localStorage.setItem('imperial-language', language) } catch { /* Navigation also works without browser storage. */ }
}
export type ContactIntent = 'consultation' | 'proposal' | 'project' | 'general'
export function contactHref(language: Language, intent: ContactIntent = 'general', context?: string) {
  const subjects: Record<Language, Record<ContactIntent, string>> = {
    fr: { consultation: 'Demande de consultation', proposal: 'Demande de proposition', project: 'Échange sur une mission', general: 'Prise de contact' },
    en: { consultation: 'Consultation request', proposal: 'Proposal request', project: 'Discuss an engagement', general: 'Getting in touch' },
  }
  const subject = `${subjects[language][intent]}${context ? ` — ${context}` : ''}`
  const body = language === 'fr'
    ? `Bonjour à l’équipe Impérial Digitale,\n\n${subject}.\n\nNom :\nOrganisation :\nBesoins et objectifs :\nDisponibilités :\n\nCordialement,`
    : `Hello Imperial Digitale team,\n\n${subject}.\n\nName:\nOrganization:\nNeeds and objectives:\nAvailability:\n\nKind regards,`
  return `mailto:contact@imperialdigitale.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
