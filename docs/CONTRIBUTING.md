# Contribuer à Algo Observatory

Merci de votre intérêt pour Algo Observatory. Ce projet est un laboratoire public de transparence algorithmique, ouvert et indépendant.

## Principes à respecter

- **Vérité des données** : aucune donnée inventée. Aucune donnée d'exemple ne doit être présentée comme réelle. Chaque donnée réelle doit porter sa provenance, sa licence et sa fraîcheur.
- **Transparence** : documentez les méthodologies, hypothèses, limites et incertitudes.
- **Aucun partenariat non confirmé** : ne revendiquez aucun partenariat avec Tournesol, Data for Good ou toute autre organisation sans preuve.

## Stack

React 19, TypeScript strict, Vite, Vitest, Tailwind CSS, pnpm.

## Installation

```bash
pnpm install
pnpm dev        # serveur de développement
pnpm build      # build de production (typecheck + vite build)
pnpm test       # tests unitaires
pnpm lint       # lint + format
pnpm types:check
```

## Structure du dépôt

```
src/
  app/          orchestration (App, routes)
  core/         primitives partagés (data, ui, utils)
  features/     domaines fonctionnels (home, lab, data)
  test/         configuration globale des tests
.agent/project/ artefacts du protocole (intent, spec, acceptance, work-graph, ...)
```

## Ajouter une stratégie de recommandation

1. Déclarez-la dans `src/core/data/strategies.ts` (implémentez `score` et `explain`).
2. Ajoutez des tests unitaires dans `src/core/data/strategies.test.ts`.
3. Vérifiez que `pnpm run test` et `pnpm run build` passent.

## Ajouter un jeu de données

1. Déclarez-le dans `src/core/data/` avec le type `Dataset`.
2. Marquez explicitement son `kind` : `'real'` pour une donnée réelle, `'example'` pour une simulation.
3. Affichez provenance, licence et fraîcheur via `DatasetProvenance`.
4. Les données d'exemple doivent porter un avertissement « Données d'exemple / simulation ».

## Avant de proposer une PR

- `pnpm run types:check` — pas d'erreur TypeScript.
- `pnpm run test` — tous les tests passent.
- `pnpm run build` — build de production OK.
- Chaque nouveau comportement est couvert par un test.

## Licence

Le code est sous licence MIT (voir `LICENSE`). Les données Tournesol de l'instantané restent sous leur propre licence, Open Data Commons Attribution (ODC-BY 1.0), avec attribution à Tournesol. Les polices embarquées sont sous SIL Open Font License 1.1 (voir `src/design/fonts/`). Le projet reste indépendant, sans partenariat non confirmé.
