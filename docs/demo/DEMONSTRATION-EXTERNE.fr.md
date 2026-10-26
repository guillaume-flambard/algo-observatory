# Algo Observatory — démonstration externe en 5 minutes

*Mis à jour le 26 octobre 2026. Prototype pédagogique indépendant de Tournesol, Data for Good et YouTube.*

**Site actuel** : https://guillaume-flambard.github.io/algo-observatory/  
**Laboratoire** : https://guillaume-flambard.github.io/algo-observatory/#/lab  
**Méthode** : https://guillaume-flambard.github.io/algo-observatory/#/methodology  
**Code** : https://github.com/guillaume-flambard/algo-observatory

## Une promesse simple

Sur un même catalogue public, plusieurs règles de classement peuvent produire des ordres différents. Le laboratoire rend les entrées, les pondérations, les mouvements de rang et leurs limites visibles. Il ne prétend pas reconstituer les décisions internes d'une plateforme.

## Parcours à l'écran

| Minute | Action | Résultat à commenter |
| --- | --- | --- |
| 00:00 | Accueil : « Qui décide de ce que vous voyez ? » | Problème d'explicabilité, pas promesse de reverse-engineering |
| 00:45 | Données : choisir l'instantané public Tournesol | Même catalogue de 24 recommandations, daté du 25 octobre 2026 |
| 01:30 | Laboratoire : modifier une stratégie ou un poids | Un paramètre contrôlé, une hypothèse explicite |
| 02:30 | Comparer les classements et les déplacements de rang | Montrer **pourquoi** une vidéo monte ou descend |
| 03:45 | Ouvrir la méthodologie | Faire la différence entre mesures observées et indicateurs dérivés |
| 04:30 | Demander un avis | « Est-ce que ce geste pédagogique correspond à vos objectifs ? » |

## Traçabilité et réserves

- Données : instantané public Tournesol, 24 recommandations, licence ODC-BY 1.0 avec attribution.
- Données versionnées : `src/core/data/tournesol-public-snapshot.json`.
- Normalisation et règles : `src/core/data/tournesol-public.ts`.
- Les indicateurs à l'échelle 0–1 et les classements calculés sont **des transformations pédagogiques**, pas des mesures du classement réel de YouTube.
- L'instantané est limité dans le temps et dans la taille ; il n'est pas représentatif de toute la plateforme.

## Accès

**Aucun identifiant requis** pour le laboratoire public. Il serait contre-productif d'inventer des comptes de démonstration pour un parcours qui se teste librement.

## Cohérence Memo Labs — changement planifié

Le dépôt est aujourd'hui sur `guillaume-flambard/algo-observatory` et publié via GitHub Pages. La cible proposée est `memolabs-dev/algo-observatory` et `algo.memolabs.dev`. **Ne pas présenter les liens cibles comme déjà actifs**. Avant la migration : examiner permissions, CI, PR ouvertes, source de publication, URL de base Vite, DNS, certificat HTTPS et redirections.

## Questions utiles pour l'équipe Tournesol

- Quel apprentissage doit rester après une interaction de deux minutes ?
- Quels effets sociaux et biais doit-on expliquer en priorité ?
- Les scénarios doivent-ils être plus accessibles ou plus exploratoires ?
- Quelle forme de contribution ne duplique pas le travail déjà mené ?
- Quelles contraintes de visualisation, de licence et d'accessibilité appliquer ?

## Avant de partager

- [ ] Vérifier accueil, laboratoire, méthodologie, mobile et clavier sur la version publique
- [ ] La démonstration se termine en moins de 5 minutes
- [ ] Les limites « simulé » et « observé » sont visibles et dites à voix haute
- [ ] Le propriétaire de domaine et du dépôt est cohérent ou la transition est explicitée
- [ ] Aucun partenariat ou endorsement présenté comme acquis
