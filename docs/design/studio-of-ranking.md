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

