# Algo Observatory

**Qui décide ce que vous voyez ?** Un laboratoire interactif, indépendant et reproductible pour comprendre comment des algorithmes de recommandation transforment un catalogue en classement.

Algo Observatory est un outil **pédagogique** : il permet de manipuler des stratégies explicites, d’inspecter les scores et de suivre les changements de rang sans prétendre reconstituer les mécanismes internes d’une plateforme réelle.

## Ce que l’application permet de faire

| Espace | Fonction |
| --- | --- |
| Accueil | Comprendre le projet et comparer deux classements simulés |
| Découvrir | Parcours accessible sur les mécanismes de recommandation |
| Laboratoire | Choisir une source, activer des stratégies, modifier des poids, inspecter les déplacements de rang |
| Effets | Explorer visuellement les différences et les limites des interprétations |
| Données | Rechercher, filtrer, trier, consulter les métriques et exporter le catalogue en CSV |
| Méthodologie | Vérifier les règles, les sources, la licence et les limites du projet |

### Vérité des données

- **Simulation** : données construites pour l’apprentissage. Aucun classement ne doit être présenté comme une observation réelle.
- **Sources publiques** : chaque source affiche son statut, sa provenance, sa licence et sa fraîcheur lorsqu’elle est disponible.
- **Tournesol** : le laboratoire embarque 24 recommandations publiques collectées le 25 octobre 2026, sous licence ODC-BY 1.0. Cette sélection datée fonctionne hors ligne. Les données brutes et les règles de normalisation sont versionnées (`src/core/data/tournesol-public-snapshot.json`, `tournesol-public.ts`). Les valeurs de popularité, diversité-inclusion et fraîcheur sont dérivées de mesures sourcées ; elles ne constituent pas des observations des recommandations YouTube.
- **Inférences** : le laboratoire ne révèle pas les paramètres cachés d’une plateforme et ne démontre pas à lui seul des effets sociaux comme les bulles de filtre.

## Démarrage

Prérequis : Node.js 22 ou supérieur et pnpm 10.14.

~~~bash
pnpm install --frozen-lockfile
pnpm dev
~~~

Ouvrez l’URL locale fournie par Vite.

## Vérifications

~~~bash
pnpm lint:check
pnpm types:check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
~~~

Les tests Playwright couvrent les parcours sur Chromium desktop et mobile, y compris le passage simulation → instantané Tournesol, la navigation et l’absence de débordement horizontal global. Le workflow Frontend quality effectue ces vérifications à chaque changement soumis sur la branche de refonte.

## Stack

- React 19, TypeScript strict, Vite 6
- Tailwind CSS 3 et Lucide pour l’interface
- Vitest, Testing Library, Playwright
- Calculs déterministes de classement en TypeScript

Le code est organisé par fonctionnalités dans src/features/, avec les modèles et adaptateurs dans src/core/. La visualisation des trajectoires est dans src/features/lab/RankFlow.tsx.

## Contribuer

Les contributions sont bienvenues, en particulier sur l’accessibilité, l’explicabilité, les sources publiques vérifiables et la reproductibilité. Voir [CONTRIBUTING.md](docs/CONTRIBUTING.md).

**Principe de livraison** : des tests verts ne suffisent pas à déclarer le produit prêt. Les parcours doivent être validés dans un navigateur et sur un environnement proche de la production avant diffusion publique.
