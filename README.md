# Algo Observatory

Plateforme ouverte de référence pour comprendre, explorer et expérimenter les algorithmes de recommandation à partir de données réelles, ouvertes et vérifiables.

## Vision

Un laboratoire public de transparence algorithmique, pédagogique, scientifique et interactif, réutilisable par des associations, des chercheurs, des enseignants et des organisations engagées pour la transparence numérique.

## Principes non négociables

- **Vérité des données** : aucune donnée inventée, aucune conclusion non démontrée, aucune confusion entre observation et simulation.
- **Validation réelle** : aucun développement déclaré terminé sans tests appropriés, vérification fonctionnelle et validation des parcours utilisateurs.
- **Transparence** : méthodologies, hypothèses, limites et incertudes explicites.

## Stack

React 19, TypeScript strict, Vite, Vitest, Tailwind CSS.

## Installation

```bash
pnpm install
pnpm dev        # serveur de développement
pnpm build      # build de production (typecheck + vite build)
pnpm test       # tests unitaires
pnpm lint       # lint + format
```

## Répertoire

```
src/
  app/          orchestration (routes, providers)
  features/     domaines fonctionnels (laboratoire, données, comparateur)
  core/         primitives partagés (ui, utils, data)
  test/         configuration globale des tests
```

## Licence

À définir — open source, indépendante, sans partenariat non confirmé.
