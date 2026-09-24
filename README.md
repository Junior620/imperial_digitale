# Impérial Digitale

Site vitrine bilingue français/anglais réalisé avec React, TypeScript, React Router, Vite, Tailwind CSS et Lucide. Sept pages par langue : accueil, à propos, services, secteurs, approche, projets et contact.

## Développement

Node.js **24.x** est utilisé en développement et sur Vercel, notamment pour les tests TypeScript natifs.

```sh
npm install
npm run dev
```

Ouvrir `http://127.0.0.1:5173/`. Le français est utilisé au premier accès. Le sélecteur FR/EN conserve la page équivalente ; la préférence de langue est mémorisée sur l’appareil. Une langue explicite dans l’URL est prioritaire.

## Vérifications et production

```sh
npm test
npm run build
npm run test:build
npm run preview
```

Le dossier `dist/` contient le build de production.

## Déploiement sur Vercel

Le fichier `vercel.json` prépare le déploiement du site statique : framework **Vite**, installation avec `npm ci`, build avec `npm run build` et sortie dans `dist`.

1. Dans [Vercel](https://vercel.com/new), importer le dépôt GitHub [`Junior620/imperial_digitale`](https://github.com/Junior620/imperial_digitale).
2. Garder la racine du dépôt comme **Root Directory** et le preset **Vite**. Les commandes et le dossier de sortie sont déjà définis dans `vercel.json`.
3. Choisir **Node.js 24.x** dans **Settings → Build and Deployment → Node.js Version** si nécessaire ; cette version est compatible avec la contrainte `engines.node` du projet.
4. Lancer **Deploy**. Une fois le dépôt connecté, les nouveaux commits sur la branche de production déclenchent un déploiement et les autres branches peuvent bénéficier de prévisualisations.

Aucune variable d’environnement, base de données ou fonction serveur n’est nécessaire. Les boutons de contact ouvrent volontairement un email prérempli dans la messagerie du visiteur.

Le build génère un document HTML pour chacune des quatorze pages, notamment `/fr/a-propos` et `/en/our-approach`. Les réécritures Vercel servent ces documents avec leurs métadonnées localisées. Vercel sert les fichiers existants en priorité : les photographies, le logo, les favicons et les fichiers JavaScript/CSS restent accessibles normalement. Les chemins inconnus utilisent un document de repli français ou anglais avec `noindex`, puis affichent la page d’erreur via React Router ; cette erreur est rendue côté navigateur après une réponse HTTP 200 du document SPA.

Après le premier déploiement, vérifier les liens directs français et anglais, le changement de langue, le logo, les favicons et une URL inconnue. La configuration de ce dépôt prépare l’hébergement ; elle ne crée pas elle-même de projet Vercel.

Références : [Vite et les routes SPA sur Vercel](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas), [configuration et priorité des fichiers](https://vercel.com/docs/project-configuration/vercel-json#rewrites), [versions Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [intégration GitHub](https://vercel.com/docs/git/vercel-for-github).

## Contenu et personnalisation

- `src/content.ts` : textes français/anglais, prestations complètes, biographie, secteurs, méthode et six exemples de missions.
- `src/ui.ts` : libellés d’interface et descriptions d’images traduits.
- `src/navigation.ts` : routes, préférence de langue et liens email préremplis.
- `src/index.css` : identité visuelle, effet verre, flou inférieur du hero et styles responsive.

## Aperçus de partage

Le domaine de référence est **https://imperialdigitale.vercel.app**, défini dans `src/seo.ts`. Les titres, descriptions, URL canoniques, langues et balises Open Graph / Twitter Card sont adaptés aux quatorze routes. `scripts/metadata.ts` les injecte dans les documents HTML pendant le build afin que les robots de partage puissent les lire sans exécuter JavaScript. La navigation React garde ces mêmes métadonnées à jour.

Les visuels français et anglais `public/social/og-fr.png` et `og-en.png` mesurent **1200 × 630 px**. Ils utilisent le logo officiel et la police Inter sous licence SIL, conservée dans `assets/fonts/`. Pour les régénérer : `npm run social:generate`, puis `npm run build`. Les sources SVG sont conservées à côté des PNG.

`npm run test:build` vérifie les documents réellement produits, leurs balises, leurs images et les réécritures Vercel. Les fichiers PNG et les balises sont publics ; les services de partage peuvent conserver en cache un ancien aperçu après un déploiement.

Les consultations, propositions et demandes relatives à une mission ouvrent la messagerie du visiteur vers `contact@imperialdigitale.com`. Aucun email n’est envoyé automatiquement. Aucun compte, formulaire serveur ou système de réservation n’est présent.

Les projets sont explicitement illustratifs ; ils ne constituent pas des références clients. Le numéro provisoire fourni n’est pas affiché. La présentation de Lara Loe utilise un monogramme, aucun portrait inventé.

## Logo et favicon

Le logo officiel fourni est conservé sans modification dans `public/brand/logo.png`. Le menu et le pied de page utilisent `public/brand/logo.svg`, qui cadre le logo dans une fenêtre SVG sans altérer ses pixels. Le favicon `public/favicon.svg` cadre uniquement le symbole coloré pour rester lisible à petite taille.

Pour régénérer ces deux fichiers à partir du PNG : `node scripts/prepare-brand.mjs`.

## Photographies

Les photographies sont stockées dans `public/images/`. Les auteurs, pages sources et conditions d’usage sont documentés dans `public/image-credits.json`. Elles illustrent les activités du cabinet et ne représentent pas ses locaux, ses employés, ses clients ou ses réalisations.

## Accessibilité

Navigation au clavier, lien d’évitement, menu mobile avec fermeture par Échap, accordéons natifs, états actifs, libellés bilingues et prise en charge de `prefers-reduced-motion`. Les paragraphes sont justifiés avec césure automatique selon la langue. Le carrousel photographique avance toutes les six secondes, avec des flèches manuelles et un bouton pause/reprise. Il s’arrête lorsque le hero est hors écran ou l’onglet masqué. La réduction des animations et la navigation au clavier désactivent le démarrage automatique ; le visiteur peut le relancer avec le bouton de lecture. La page défile normalement et le hero peut s’étendre sur les écrans très courts pour conserver son contenu.
