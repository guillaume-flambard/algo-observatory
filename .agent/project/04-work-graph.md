# 04 — Work graph

TODO-P1-01 — Structure des données et provenance
Priority: P1
Status: DONE
Requirements: REQ-002, REQ-006, REQ-007
Dependencies: none
Description: Créer le modèle de données (Dataset, Item, Strategy), un jeu de données d'exemple marqué simulation, et l'affichage de la provenance/licence/fraîcheur.
Files/Systems: src/core/data/types.ts, src/core/data/example-dataset.ts, src/features/data/dataset-provenance.tsx
Acceptance: AC-002, AC-006, AC-007
Verification: pnpm run test, pnpm run build
Evidence: 8 tests pass, build OK, types OK

TODO-P1-02 — Page d'accueil
Priority: P1
Status: DONE
Requirements: REQ-001
Dependencies: none
Description: Page d'accueil présentant le projet, les principes et l'entrée vers le laboratoire.
Files/Systems: src/features/home/Home.tsx, src/App.tsx
Acceptance: AC-001
Verification: pnpm run test
Evidence: test passe (data-testid app-title)

TODO-P1-03 — Laboratoire de comparaison d'algorithmes
Priority: P1
Status: DONE
Requirements: REQ-003, REQ-004, REQ-005
Dependencies: TODO-P1-01
Description: Sélecteur de stratégies, paramètres ajustables, comparaison côte à côte, explications par résultat.
Files/Systems: src/core/data/strategies.ts, src/features/lab/Lab.tsx
Acceptance: AC-003, AC-004, AC-005
Verification: 7 tests strategies + build OK
Evidence: 4 stratégies (popularité, collectif, diversité, hybride), computeResults trié, explications

TODO-P1-04 — États de chargement, vide et erreur
Priority: P1
Status: TODO
Requirements: (loading/empty/error states)
Dependencies: TODO-P1-03
Description: État vide déjà géré ("Aucun résultat"). Ajouter états loading et error dans le laboratoire.
Files/Systems: src/features/lab/, src/core/ui/
Acceptance: (loading/empty/error states)
Verification: pnpm run test
Evidence: pending

TODO-P1-05 — Accessibilité et performance
Priority: P1
Status: TODO
Requirements: (accessibility, performance)
Dependencies: TODO-P1-03
Description: Navigation clavier, focus visible, contraste, mesure des temps de recompute.
Files/Systems: tous
Acceptance: AC-008, AC-009
Verification: pnpm run test + inspection
Evidence: pending

TODO-P1-06 — Documentation et README contributeur
Priority: P2
Status: TODO
Requirements: (documentation, developer experience)
Dependencies: TODO-P1-03
Description: README du projet, guide d'installation, conventions de contribution, spécification des données.
Files/Systems: README.md, docs/
Acceptance: (documentation)
Verification: inspection
Evidence: pending
