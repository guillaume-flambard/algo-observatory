# 02 — Spécification (delta-spec)

## Functional behavior

REQ-001 : La page d'accueil présente le projet, ses principes (vérité des données, transparence) et un point d'entrée vers le laboratoire.
REQ-002 : Le laboratoire permet de choisir un jeu de données parmi ceux disponibles, chaque jeu affichant provenance, licence et fraîcheur.
REQ-003 : Le laboratoire permet de sélectionner plusieurs stratégies de recommandation simultanément (popularité, score collectif, diversité, hybride) et d'en comparer les résultats côte à côte.
REQ-004 : Chaque stratégie expose des paramètres ajustables (ex. poids de popularité, seuil de diversité) dont la modification met à jour les résultats en temps réel.
REQ-005 : Pour chaque résultat affiché, une explication indique pourquoi ce contenu est favorisé par la stratégie choisie (explainability).
REQ-006 : Les données d'exemple utilisées en l'absence de vraie donnée Tournesol sont explicitement marquées « Données d'exemple / simulation » et ne sont jamais présentées comme réelles.
REQ-007 : Chaque donnée réelle intégrée porte sa provenance, sa licence et sa date de fraîcheur, affichées à l'écran.

## User flows

Accueil → choix du jeu de données → laboratoire → comparaison des stratégies → ajustement des paramètres → lecture des explications.

## Data model

Dataset { id, title, source, license, freshness, itemCount, items: Item[] }
Item { id, title, author, category, metrics: { popularity, collectiveScore, ... } }
StrategyResult { strategyId, items: Item[], explanation: string }
Strategy { id, name, description, parameters: Parameter[] }

## State transitions

Idle → datasetLoaded → strategiesSelected → resultsComputed → parametersChanged (recompute)

## Error behavior

- Dataset indisponible : message d'erreur avec suggestion de réessayer.
- Stratégie en erreur : isolée, les autres stratégies continuent d'afficher leurs résultats.

## Edge cases

- Jeu de données vide : état vide explicite.
- Paramètres hors borne : clamp + message.

## Recovery

Rechargement de la page restaure l'état par défaut (aucun état persistant côté client pour l'instant).

## Concurrency

Aucune écriture côté client ; les recomputes sont séquencés par stratégie.

## Compatibility

Aucune donnée existante (premier jalon).

## Security

Aucune authentification, aucune donnée personnelle collectée.

## Privacy

Aucune donnée personnelle. Les métriques affichées sont agrégées/publiques.

## Performance

Chargement des données < 2s ; recompute des stratégies < 300ms sur jeu de < 1000 items.

## Accessibility

Clavier, lecteurs d'écran, contraste, focus visible, réduction de mouvement.

## Observability

Logs de console structurés pour le chargement des données et le recompute des stratégies.

## Deployment

Build statique Vite, déployable n'importe où (Vercel, GitHub Pages, etc.).

## Coverage matrix

- core behavior : APPLICABLE
- UX : APPLICABLE
- loading states : APPLICABLE
- empty states : APPLICABLE
- error states : APPLICABLE
- persistence : NOT APPLICABLE (premier jalon, aucun état persistant)
- authentication : NOT APPLICABLE
- authorization : NOT APPLICABLE
- privacy : APPLICABLE
- security : APPLICABLE
- accessibility : APPLICABLE
- performance : APPLICABLE
- offline behavior : NOT APPLICABLE
- build : APPLICABLE
- documentation : APPLICABLE
- developer experience : APPLICABLE
