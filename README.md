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

La réécriture SPA vers `index.html` permet l’accès direct et le rechargement des quatorze pages, notamment `/fr/a-propos` et `/en/our-approach`. Vercel sert les fichiers existants en priorité : les photographies, le logo, les favicons et les fichiers JavaScript/CSS restent accessibles normalement. Les chemins inconnus affichent la page d’erreur du site via React Router ; cette erreur est rendue côté navigateur après une réponse HTTP 200 du document SPA.

Après le premier déploiement, vérifier les liens directs français et anglais, le changement de langue, le logo, les favicons et une URL inconnue. La configuration de ce dépôt prépare l’hébergement ; elle ne crée pas elle-même de projet Vercel.

Références : [Vite et les routes SPA sur Vercel](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas), [configuration et priorité des fichiers](https://vercel.com/docs/project-configuration/vercel-json#rewrites), [versions Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [intégration GitHub](https://vercel.com/docs/git/vercel-for-github).

## Contenu et personnalisation

- `src/content.ts` : textes français/anglais, prestations complètes, biographie, secteurs, méthode et six exemples de missions.
- `src/ui.ts` : libellés d’interface et descriptions d’images traduits.
- `src/navigation.ts` : routes, préférence de langue et liens email préremplis.
- `src/index.css` : identité visuelle, effet verre, flou inférieur du hero et styles responsive.

Les consultations, propositions et demandes relatives à une mission ouvrent la messagerie du visiteur vers `contact@imperialdigitale.com`. Aucun email n’est envoyé automatiquement. Aucun compte, formulaire serveur ou système de réservation n’est présent.

Les projets sont explicitement illustratifs ; ils ne constituent pas des références clients. Le numéro provisoire fourni n’est pas affiché. La présentation de Lara Loe utilise un monogramme, aucun portrait inventé.

## Logo et favicon

Le logo officiel fourni est conservé sans modification dans `public/brand/logo.png`. Le menu et le pied de page utilisent `public/brand/logo.svg`, qui cadre le logo dans une fenêtre SVG sans altérer ses pixels. Le favicon `public/favicon.svg` cadre uniquement le symbole coloré pour rester lisible à petite taille.

Pour régénérer ces deux fichiers à partir du PNG : `node scripts/prepare-brand.mjs`.

## Photographies

Les photographies sont stockées dans `public/images/`. Les auteurs, pages sources et conditions d’usage sont documentés dans `public/image-credits.json`. Elles illustrent les activités du cabinet et ne représentent pas ses locaux, ses employés, ses clients ou ses réalisations.

## Accessibilité

Navigation au clavier, lien d’évitement, menu mobile avec fermeture par Échap, accordéons natifs, états actifs, libellés bilingues et prise en charge de `prefers-reduced-motion`. Le carrousel photographique est manuel. La page défile normalement et le hero peut s’étendre sur les écrans très courts pour conserver son contenu.
