# ADR 001 : Architecture des adaptateurs de données Tournesol

## Statut
Accepté

## Contexte
L'API publique de Tournesol (`api.tournesol.app`) requiert une authentification OAuth2 pour la plupart de ses endpoints, et les URLs d'export direct peuvent évoluer ou nécessiter des conditions spécifiques. 
La règle non négociable d'Algo Observatory est : « Aucune donnée inventée, aucune confusion entre observation et simulation ».

## Décision
Nous adoptons une architecture par adaptateurs (Pattern Adapter) pour la couche de données Tournesol :
1. **`ApiTournesolAdapter`** : Connexion directe à l'API officielle (nécessite des identifiants/token).
2. **`StaticExportAdapter`** : Chargement de snapshots / exports officiels de Tournesol (JSON/CSV) stockés ou téléchargés, garantissant la reproductibilité et l'indépendance réseau.
3. **`SimulationAdapter`** : Données d'exemple pédagogiques explicitement marquées comme « Simulation / exemple » dans l'interface, utilisées uniquement pour illustrer les concepts lorsque les données réelles ne sont pas chargées.

Chaque dataset retourné par un adaptateur transporte obligatoirement sa `provenance`, sa `license`, sa `freshness` et son `kind` (`'real'` ou `'example'`).

## Révision du 2026-10-26 : pas d'appel direct à l'API depuis le navigateur

Constat vérifié le 2026-10-26 :
- L'endpoint public `https://api.tournesol.app/polls/videos/recommendations/` répond sans authentification (HTTP 200). L'hypothèse « OAuth2 obligatoire » ne vaut pas pour cette lecture publique.
- Sa réponse ne contient aucun en-tête `Access-Control-Allow-Origin`, y compris pour l'origine `https://guillaume-flambard.github.io`. Un navigateur bloque donc l'appel depuis le site statique.

Décision :
- `ApiTournesolAdapter` est retiré. Il n'était utilisé par aucun écran et levait toujours une erreur fondée sur un motif inexact.
- Les données réelles proviennent uniquement de l'instantané versionné `src/core/data/tournesol-public-snapshot.json`, lu par `getTournesolPublicDataset()`. Il est produit par `scripts/refresh-tournesol.mjs`, lancé hors navigateur, puis relu avant fusion. Ce rôle est celui du `StaticExportAdapter` décrit plus haut.
- Un accès en direct demanderait un relais serveur ajoutant les en-têtes CORS. Le projet n'a pas de back-end et n'en a pas besoin : l'instantané daté rend l'expérience reproductible.

