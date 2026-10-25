# 03 — Acceptance criteria

AC-001 — Requirement: REQ-001
Given: l'utilisateur arrive sur la page d'accueil
When: il consulte la page
Then: le nom du projet, les principes (vérité des données, transparence) et un lien vers le laboratoire sont visibles
Verification: automated
Evidence: App.test.tsx passe (data-testid app-title)

AC-002 — Requirement: REQ-002
Given: l'utilisateur est dans le laboratoire
When: il ouvre le sélecteur de jeu de données
Then: chaque jeu affiche son nom, sa provenance, sa licence et sa fraîcheur
Verification: automated
Evidence: DatasetProvenance affiché sur App (exemple + provenance)

AC-003 — Requirement: REQ-003
Given: deux stratégies sélectionnées
When: les résultats sont calculés
Then: les deux listes de résultats s'affichent côte à côte avec les mêmes items d'entrée
Verification: automated
Evidence: Lab affiche deux colonnes côte à côte, mêmes items

AC-004 — Requirement: REQ-004
Given: un paramètre de stratégie modifié
When: la valeur change
Then: les résultats de cette stratégie se recomputent et s'affichent immédiatement
Verification: automated
Evidence: Lab avec sliders + recompute via params

AC-005 — Requirement: REQ-005
Given: un résultat affiché
When: l'utilisateur consulte l'explication
Then: un texte explique pourquoi ce contenu est favorisé par la stratégie
Verification: automated
Evidence: strategies.test.ts vérifie les explications

AC-006 — Requirement: REQ-006
Given: des données d'exemple sont affichées
When: l'utilisateur consulte la mention de provenance
Then: la mention « Données d'exemple / simulation » est visible et aucune présentation comme donnée réelle n'apparaît
Verification: automated
Evidence: DatasetProvenance badge amber + texte d'avertissement

AC-007 — Requirement: REQ-007
Given: une donnée réelle intégrée
When: elle est affichée
Then: provenance, licence et fraîcheur sont affichées
Verification: inspection
Evidence: pending (aucune donnée réelle intégrée encore — voir TODO)

AC-008 — Performance
Given: un jeu de < 1000 items
When: les stratégies sont recomputées
Then: chaque recompute < 300ms
Verification: automated
Evidence: pending (à mesurer)

AC-009 — Accessibilité
Given: la page du laboratoire
When: naviguée au clavier
Then: tous les contrôles sont atteignables et le focus est visible
Verification: inspection
Evidence: pending
