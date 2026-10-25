# 00 — Intent

## Goal

Fournir une plateforme ouverte où toute personne, sans connaissances techniques, peut comprendre, explorer et expérimenter les algorithmes de recommandation à partir de données réelles, ouvertes et vérifiables (Tournesol, puis Bluesky), avec une explication honnête des mécanismes, des limites et des incertitudes.

## Non-goals

- Ne pas servir de moteur de recommandation en production pour des plateformes tierces.
- Ne pas collecter de données personnelles des utilisateurs.
- Ne jamais présenter une simulation ou une donnée d'exemple comme un comportement réellement observé sur une plateforme.
- Ne pas revendiquer de partenariat non confirmé (Tournesol, Data for Good, etc.).

## User-visible outcome

L'utilisateur arrive sur une page d'accueil qui explique la démarche, choisit un jeu de données (avec provenance et licence affichées), sélectionne plusieurs stratégies de recommandation (popularité, score collectif, diversité, hybride), ajuste des paramètres, observe les résultats côte à côte et lit une explication de pourquoi certains contenus sont favorisés.

## Constraints

- Stack : React 19, TypeScript strict, Vite, Vitest, Tailwind CSS.
- Open source, indépendant, facile à installer et à enrichir par des contributeurs.
- Qualité professionnelle : accessible, performant, responsive, documenté, testé.
- Vérité des données : chaque donnée affichée porte sa provenance, sa licence, sa fraîcheur ; les données d'exemple sont explicitement marquées simulation.

## Completion sentence

Ce projet est complet lorsque un utilisateur non technique peut comparer plusieurs algorithmes de recommandation sur un jeu de données publiques réelles avec provenance et licence vérifiables, que les parcours principaux sont testés de bout en bout, et qu'une association comme Tournesol ou Data for Good peut raisonnablement réutiliser ou contribuer au projet sans le reconstruire.
