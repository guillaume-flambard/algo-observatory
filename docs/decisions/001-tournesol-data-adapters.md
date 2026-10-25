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
