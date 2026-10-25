# Audit de la démo publiée — 25 octobre 2026

## Périmètre

URL : https://guillaume-flambard.github.io/algo-observatory/

Lighthouse CLI **12.8.2**, exécution réelle sur le Mac avec Chrome headless 155 et émulation de conditions **mobiles** par défaut. Ce résultat provient d'un **audit synthétique unique** ; il ne représente pas les Core Web Vitals d'une population réelle.

| Catégorie Lighthouse | Score |
| --- | ---: |
| Performance | **100 / 100** |
| Accessibilité | **100 / 100** |
| Bonnes pratiques | **100 / 100** |
| SEO | **100 / 100** |

| Indicateur de laboratoire | Résultat |
| --- | ---: |
| First Contentful Paint | **1,3 s** |
| Largest Contentful Paint | **1,3 s** |
| Total Blocking Time | **0 ms** |
| Cumulative Layout Shift | **0** |
| Speed Index | **1,3 s** |
| Réponse serveur document initial | **151 ms** |

Mesuré sur GitHub Pages après fusion des PR #6, #7 et #8. Les valeurs sont arrondies comme dans le rapport Lighthouse. Les résultats pourront évoluer avec le CDN, le réseau, le système et les versions des outils.

## Points de vigilance

- Le cache des ressources statiques dépend de la configuration de **GitHub Pages** ; Lighthouse signale un gain possible sur la durée de cache.
- Le signal de JavaScript inutilisé suggère un potentiel de réduction supplémentaire, mais le chargement différé des pages protège déjà le chemin critique.
- Aucun **INP réel**, aucune mesure RUM et aucun test manuel dans l'application Safari n'ont été déclarés concluants.
- Le site est indépendant et les classements Tournesol sont des simulations calculées sur un instantané de données publiques datées.

## Reproduire

```bash
pnpm dlx lighthouse@12.8.2 https://guillaume-flambard.github.io/algo-observatory/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new --no-first-run --no-default-browser-check" \
  --output=json --output-path=./lighthouse-mobile.json --quiet
```

Cette commande suppose qu'un binaire Chrome/Chromium compatible est présent sur la machine. Les parcours fonctionnels et les audits WCAG restent couverts séparément par Playwright/axe et la CI GitHub.
