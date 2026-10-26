# Algo Observatory — Design direction / Studio of Ranking

**Decision: 2026-10-25 · status: adopted for the V3 redesign · owner: Memo Labs**

## Product thesis

Algo Observatory is not a landing page with charts and not a general-purpose BI dashboard. It is a hands-on **ranking experiment studio**. A visitor should be able to change a rule, inspect rank shifts, and trace data provenance without leaving the active experiment.

**North-star interaction:** *Same items. Different rule. Explain the displacement.*

## Evidence behind the decision

- NN/g: Data tables must support filtering, comparison, inspection and acting on individual records; these actions require discoverable toolbars, not empty decoration. https://www.nngroup.com/articles/data-tables/
- NN/g: Complex applications should keep contextual secondary details near the primary task and minimize unnecessary navigation. https://www.nngroup.com/articles/complex-application-design/
- Financial Times Visual Vocabulary: slope charts support changes in rank between categories; ordered bars support explicit rankings. https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md
- Observable Inputs and Framework: direct manipulation should update charts and data views together, with precise provenance and source control. https://observablehq.github.io/framework/inputs/
- Baymard: tables are valuable for technical comparison on desktop, but mobile should offer a readable list rather than force a miniature table. https://baymard.com/research-articles/b2b-electronic-components-machinery-launch
- Jiang et al. (2026): use meaningful transitions sparingly; tracking too many animated entities exceeds perceptual capacity. https://doi.org/10.1186/s41235-026-00724-y
- W3C WCAG 2.2 AA: focus, reflow, contrast and keyboard/touch activation are baseline quality gates. https://www.w3.org/TR/WCAG22/

## Three experience intentions, six routes

| Intent | Route | First action |
| --- | --- | --- |
| Comprendre | Accueil | Change the weighting on a live ranked comparison |
| Comprendre | Découvrir | Learn the difference between source, metrics and ranking rules |
| Expérimenter | Laboratoire | Compare two strategies; track one item and explain its rank |
| Expérimenter | Effets | Investigate hypotheses, separating observations from claims |
| Vérifier | Données | Select source, search, filter, compare and inspect a single item |
| Vérifier | Méthodologie | Validate source status, licence, date, transformation and limits |

**Do not remove existing routes:** external links and current e2e navigation must keep working. Group route labels visually instead of forcing a new route tree immediately.

## Visual system

- Type: system-first sans-serif (Inter when available), tabular mono for metrics and sample IDs. **No editorial serif** in application surfaces.
- Surface: cool off-white `#f3f6f7`, white `#ffffff`, ink `#172129`, subdued ink `#495b65`, borders `#cbd4d8`, cobalt `#2446d5`. Lime `#d9f36b` signals a direct experiment or next step and must have dark text. Do not turn statuses into decorative multicolored pills.
- Layout: 12-column desktop grid; explicit left controls, central results canvas and contextual right inspector when enough width. At narrow widths, restructure the interaction; never horizontally shrink a 920px table to a 390px screen.
- Typography: 40–64px major section titles, 22–28px primary tool titles, 14–16px body, 12px metadata; never use sub-10px labels for interactive content.
- Shape: rectangular / radius 0–4px; 1px rules; no glassmorphism, gradients, ornamental cards, large empty hero heights, unrelated accent colors or stock imagery.
- Information hierarchy: *intent → live output → controls → details and provenance*. Show meaningful data at the first fold.
- Motion: 180–350ms transitions only when supporting selected rank tracking; preserve identity of a selected item; support reduced motion.
- States: empty, selected, loading, errors, simulation/public, keyboard focus, mobile inspection, long content titles.

## Architecture rules

1. Put tokens in **one source**; style the six screens from the same tokens, not overlapping palettes or accumulating overrides.
2. Keep `computeResults`, datasets, Tournesol snapshot and CSV sanitization untouched unless independently tested.
3. The comparison result is always computed from the active catalog; never invent percentages or claim a YouTube observed ranking.
4. A single selected item is context, not a separate modal or navigation detour.
5. React 19, TypeScript and existing lightweight UI remain. Do not add a UI framework or chart library merely to imitate a reference.

## Acceptance gates

- Same six navigation routes continue to work, including hash links and back navigation.
- On desktop the relevant visualization is visible at first fold; choose source and strategy with one interaction.
- On mobile, names and metrics remain readable without global horizontal scrolling; the inspector is inline/accessible and selection survives changes appropriately.
- Evidence: visual screenshots at 1440px, 900px and 390px, including real long Tournesol titles; Chromium and WebKit functional tests; axe WCAG 2.2 AA, reduced motion, basic keyboard traversal.
- Budget: first-load JavaScript gzip <100KB, CSS gzip <12KB. Prefer removing dead V2 CSS rather than layering overrides.
- Final approval is visual **and** functional, never CI alone.

## Priorities

**P0**: unified app shell + variables + home experiment + Data workbench with provenance.

**P1**: Laboratory's primary comparison and inspectable outcomes, narrow viewport interaction.

**P2**: Discover, Effects and Methodology as simple editorial explanations within the same workbench system; retire the retro field-guide chrome.

This document is a decision record, not proof of successful implementation.

## Revision 2026-10-26: Tournesol signal and the living laboratory

- **Single token source.** `src/design/tokens.json` is the design system (also published as the Claude Design system "Algo Observatory"). `scripts/build-tokens.mjs` compiles it to `src/design/tokens.css`; a unit test fails when the CSS is stale.
- **Signal colour.** Lime is retired. Tournesol's yellow `#ffc800` (`sunflower`) is the only signal: tracked item, rising rank, focus halo, used as a highlighter under ink. Cobalt stays the interaction accent. Tournesol criterion colours (`crit-*`) come from `tournesol-app/tournesol` `frontend/src/utils/criteria.ts` and appear only in composition bars.
- **Type.** Instrument Sans (text) and IBM Plex Mono (measures), OFL, self-hosted and bundled by Vite (base-path safe). This replaces the Inter/system stack above.
- **Laboratory.** A (reference) and B (experiment) replace the multi-select columns. The rank ledger animates B with one tween shared by rows and paths; the inspector explains a move from the strategy's own composition against the catalogue mean; real Tournesol items show comparisons, contributors and a link. Mobile became a single list in B order with compact controls (lab page 5,244 px to about 3,100 px at 390 px).
- **Navigation.** The six routes are unchanged and grouped by intent: Comprendre, Expérimenter, Vérifier.

## Revision 2026-10-26 (afternoon): Hallmark audit

An audit with the Hallmark linter (`sloplint --render`, six routes, 30 screenshots) went from 170 FAIL to 30. Applied:
- Labels are the body face in sentence case (`meta` type style). No eyebrows, no tracked capitals, no monospace for words, no coloured word inside a heading, no middle-dot meta strings, no em dash in copy.
- Selected rows and the current mobile nav item lose their side stripe: `sunflower-wash` fill with an `ink` border.
- `control-border` darkened to `#6f808b` so field edges reach 3:1 on `sunken`; the focus ring turns `on-ink` on ink panels.
- Rows move with `transform`; no `top` or `width` transitions. Disabled controls use fill, ink, cursor and the attribute.
- The data workbench is capped at 1600px; no text below 11px.
Remaining FAILs are raw pixel spacings where a `--space-*` token exists, and word density on Discover and Effects.

## Revision 2026-10-26 (later): one page system, plain language

- Every route opens with `PageHead` (src/core/ui/PageHead.tsx): one 56px title at the same height, one plain-language lead, at most two actions. Sections share `page.css`: 32px section titles, 22px instrument titles, 18px item titles, one button system (`btn-primary`, `btn-secondary`, `btn-link`, 44px, square).
- One data source picker (`SourceSwitch`) in the laboratory and the data workbench. One inspector style (light). The home machine now uses the laboratory's `RankLedger`.
- Copy is written for non-specialists: a three-step how-to in the laboratory, a hint under each slider, measures named in plain words, simpler strategy descriptions.



## Operational handoff to Open Design — 2026-10-26

This is the **project-specific design contract** to attach to Open Design experiments. It is not a request to redesign the six shipped routes or to fork a second design system.

### Source of truth and version drift

1. The canonical palette, type scale, spacing and motion come from `src/design/tokens.json` (compiled by `scripts/build-tokens.mjs` into `src/design/tokens.css`). Never edit compiled CSS or substitute Open Design's default UI styling. Take values from the current JSON at the time of the experiment, not from earlier paragraphs of this decision record; the initial lime and system-font recommendations above have been superseded.
2. The canonical page hierarchy and components are in `src/design/page.css`, `src/design/studio.css`, `src/core/ui/` and the six live route implementations. Generated mock-ups are reference material only; integrating them requires reusing existing React 19/TypeScript components, not copying a new stand-alone HTML framework into the application.
3. The experiments are demonstrators, **not measured YouTube ranking algorithms**. Real public Tournesol snapshots have explicit provenance and licence; simulated rankings must be visibly labeled and derived from the active catalog. No invented counts, percentages, ranking changes, sources or product features.
4. The current visual language is a data laboratory, not corporate analytics: Instrument Sans plus IBM Plex Mono; `--canvas` / `--paper` / `--ink` surfaces; cobalt `--cobalt` for interaction and Tournesol sunflower `--sunflower` for a tracked move or experiment. Emphasize measurements, provenance and direct manipulation. Use the UI's actual labels in French.

### Open Design brief to reuse

> Conçois une amélioration ciblée d'**Algo Observatory**, laboratoire public de comparaison de règles de classement. Pars des composants et des tokens vérifiés `src/design/tokens.json`, `src/design/page.css`, `src/design/studio.css`. La page est un instrument : l'utilisateur voit les mêmes 24 éléments publics Tournesol, modifie une règle et comprend pourquoi un élément change de rang. N'ajoute aucune métrique, source, recommandation ou capture prétendument observée qui n'existe pas. Sépare visuellement données sourcées et classements simulés. Préserve les six routes, la sélection et l'inspecteur contextuel, la navigation clavier, les titres longs et le modèle mobile sans tableau écrasé. Évite les badges décoratifs, les gradients, les cartes répétitives, les polices « IA par défaut » et les capitales suivies. Livrable : maquette d'un parcours précis avec états chargement/vide/erreur, pas un nouveau site autonome.

When Open Design is not linked to this repository, pass the relevant CSS tokens and component states in the actual brief. Selecting a generic Open Design system such as `application` is **not** a substitute for these local rules.

### QA and acceptance

- At minimum: 1440×900, 1000×700 and 390×844, Chromium and WebKit for functionality, keyboard and reduced-motion checks. Do not demand a dark variant unless this product explicitly adopts a dark theme; this version's source tokens describe a light canvas.
- The local `/Users/memo/bin/opencode-v2 od-status <runId>` verifies file production and runs a Chromium smoke, including screenshots. `od-check <runId>` provides six screenshots and warns when clear/dark renders do not differ. Static screenshots or a `verified:true` response are **not** evidence of semantic correctness.
- Before code integration run `pnpm test`, the existing Playwright browser journeys, token compiler checks, bundle budgets (100 KB initial JS / 12 KB CSS gzip) and explicit visual review. Do not modify `computeResults`, the Tournesol public snapshots or provenance logic as a side effect of style work.
- Compare the proposed screen with live `docs/screenshots/` references, but use the most recent source code as authority if a screenshot is outdated.
