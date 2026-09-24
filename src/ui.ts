import type { Language } from './types'

const fr = {
  skip: 'Aller au contenu', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', mainNav: 'Navigation principale', mobileNav: 'Navigation mobile', language: 'Choisir la langue',
  discoverServices: 'Découvrir nos services', consultation: 'Réserver une consultation', contact: 'Nous contacter', proposal: 'Demander une proposition',
  allServices: 'Toutes nos expertises', allIndustries: 'Explorer les secteurs', about: 'Découvrir le cabinet', approach: 'Notre méthode', projects: 'Explorer les missions',
  expertise: 'Nos pôles d’expertise', expertiseIntro: 'Des expertises complémentaires. Une même ambition.', industries: 'À chaque secteur, les bonnes solutions.',
  discover: 'Explorer', scroll: 'Défiler pour découvrir', previous: 'Image précédente', next: 'Image suivante', scene: 'Photographie', of: 'sur',
  purpose: 'Stratégie. Technologie. Exécution.', difference: 'Notre différence', outcomes: 'L’impact recherché', more: 'En savoir plus',
  mission: 'Mission illustrative', projectContext: 'Le contexte', projectSupport: 'L’accompagnement', deliverables: 'Livrables possibles', related: 'Expertises associées',
  discuss: 'Parlons de cette mission', servicesDetails: 'Voir les prestations', quickLinks: 'Explorer', getInTouch: 'Parlons de votre projet',
  email: 'Écrivez-nous', location: 'Notre ancrage', availability: 'Rencontrons-nous', allRights: 'Tous droits réservés.',
  contactNote: 'Un premier échange pour comprendre vos besoins et dessiner la suite, ensemble.',
  emailNote: 'Ces liens ouvrent votre messagerie avec un message prérempli. Vous pourrez le compléter avant de l’envoyer.',
  consultDescription: 'Échangeons sur vos enjeux et vos priorités.', proposalDescription: 'Décrivez-nous votre projet et vos objectifs.', generalDescription: 'Une question, une idée ou un partenariat ?',
  general: 'Échanger avec notre équipe', approachLink: 'Découvrir notre approche', founderLabel: 'Direction', teamImageLabel: 'Photographie d’illustration',
  errorEyebrow: 'Erreur 404', errorTitle: 'Cette page reste à imaginer.', errorBody: 'La page que vous recherchez n’existe pas ou a changé d’adresse.', backHome: 'Retour à l’accueil',
  companyTagline: 'Conseil en transformation digitale', footerSignature: 'Une vision claire. Un impact durable.',
  imageAlt: {
    architecture: 'Architecture contemporaine d’un immeuble de bureaux',
    collaboration: 'Professionnels réunis autour d’une table de travail, photographie d’illustration',
    infrastructure: 'Infrastructure informatique et serveurs',
    team: 'Une équipe échange autour d’un projet, photographie d’illustration',
    city: 'Architecture urbaine contemporaine',
    workspace: 'Espace de travail contemporain',
  },
}
type UI = { [K in keyof typeof fr]: typeof fr[K] extends string ? string : { [P in keyof typeof fr[K]]: string } }
const en: UI = {
  skip: 'Skip to content', openMenu: 'Open menu', closeMenu: 'Close menu', mainNav: 'Main navigation', mobileNav: 'Mobile navigation', language: 'Choose language',
  discoverServices: 'Explore our services', consultation: 'Book a consultation', contact: 'Contact us', proposal: 'Request a proposal',
  allServices: 'All our expertise', allIndustries: 'Explore our industries', about: 'Discover the firm', approach: 'Our method', projects: 'Explore the engagements',
  expertise: 'Our areas of expertise', expertiseIntro: 'Complementary expertise. One shared ambition.', industries: 'The right solutions for every sector.',
  discover: 'Explore', scroll: 'Scroll to discover', previous: 'Previous image', next: 'Next image', scene: 'Photograph', of: 'of',
  purpose: 'Strategy. Technology. Execution.', difference: 'Our difference', outcomes: 'The impact we seek', more: 'Learn more',
  mission: 'Illustrative engagement', projectContext: 'The context', projectSupport: 'Our support', deliverables: 'Possible deliverables', related: 'Related expertise',
  discuss: 'Let’s discuss this engagement', servicesDetails: 'View services', quickLinks: 'Explore', getInTouch: 'Let’s talk about your project',
  email: 'Write to us', location: 'Where we are', availability: 'Let’s meet', allRights: 'All rights reserved.',
  contactNote: 'A first conversation to understand your needs and shape what comes next, together.',
  emailNote: 'These links open your email app with a prepared message. You can complete it before sending.',
  consultDescription: 'Let’s discuss your challenges and priorities.', proposalDescription: 'Tell us about your project and objectives.', generalDescription: 'A question, an idea, or a partnership?',
  general: 'Talk to our team', approachLink: 'Discover our approach', founderLabel: 'Leadership', teamImageLabel: 'Illustrative photograph',
  errorEyebrow: 'Error 404', errorTitle: 'This page is yet to be imagined.', errorBody: 'The page you are looking for does not exist or has moved.', backHome: 'Back to home',
  companyTagline: 'Digital transformation consulting', footerSignature: 'A clear vision. A lasting impact.',
  imageAlt: {
    architecture: 'Contemporary architecture of an office building',
    collaboration: 'Professionals gathered around a meeting table, illustrative photograph',
    infrastructure: 'IT infrastructure and servers',
    team: 'A team discussing a project, illustrative photograph',
    city: 'Contemporary urban architecture',
    workspace: 'Contemporary workspace',
  },
}
export const ui: Record<Language, UI> = { fr, en }
