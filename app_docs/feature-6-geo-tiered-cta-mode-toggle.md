# Geo-tiered CTA Mode Toggle

**ADW ID:** 6
**Date:** 2026-03-28
**Specification:** specs/issue-c93e91a4-adw-6-sdlc_planner-geo-tiered-cta-mode-toggle.md

## Overview

Adds a `ctaMode` settings flag (`default`, `buy-only`, `trial-only`) per geo/surface that suppresses conflicting CTAs at hydration time in `web-components`. The toggle is authored in Studio and delivered through the existing MAS-IO settings pipeline without modifying any card fragment content. When a card's only CTA conflicts with the active mode and no paired CTA exists, a Learn More fallback link is rendered instead.

## What Was Built

- `CTA_MODE` constants object exported from `web-components/src/constants.js`
- `processCtaMode()` function in `web-components/src/hydrate.js` that removes conflicting CTAs from the DOM before mount
- `ctaMode` and `learnMoreUrl` fields registered in `SETTING_NAME_DEFINITIONS` in `io/www/src/fragment/transformers/settings.js` (with `options` array for the select editor)
- `select` editor type support in `studio/src/settings/mas-settings.js` rendering an `<sp-picker>` with the configured options
- Unit tests for `processCtaMode` covering all modes, fallback scenarios, and edge cases
- Integration tests for `ctaMode` and `learnMoreUrl` extraction in the settings transformer

## Technical Implementation

### Files Modified

- `web-components/src/constants.js`: Added `CTA_MODE` constant (`DEFAULT`, `BUY_ONLY`, `TRIAL_ONLY`)
- `web-components/src/hydrate.js`: Added `processCtaMode(fields, settings)` export; called immediately before `processCTAs()` in `hydrate()`
- `io/www/src/fragment/transformers/settings.js`: Appended `ctaMode` (select editor with `['default', 'buy-only', 'trial-only']` options) and `learnMoreUrl` (text editor) to `SETTING_NAME_DEFINITIONS`
- `studio/src/settings/mas-settings.js`: Added `select` editor type detection in `getEditorType()` and an `<sp-picker>` renderer in the value editor template
- `web-components/test/hydrate.test.js`: Added `processCtaMode` test suite (11 cases)
- `io/www/test/fragment/settings.test.js`: Added tests for `ctaMode` and `learnMoreUrl` extraction

### Key Changes

- **DOM mutation only**: `processCtaMode` parses `fields.ctas` into a temporary `<div>`, removes matching `<a>` elements by `data-modal` attribute, and writes the result back — no fragment content is touched
- **Suppress logic**: `buy-only` removes links with `data-modal="twp"` (trial); `trial-only` removes links with `data-modal="d2p"` (buy)
- **Learn More fallback**: If all CTAs are removed and `settings.learnMoreUrl` is set, a `<a class="secondary-link">Learn More</a>` is appended; otherwise `fields.ctas` is set to `''`
- **Call order**: `processCtaMode` runs before `processCTAs` in `hydrate()`, ensuring downstream CTA processing sees the already-filtered set
- **Studio UI**: The new `select` editor branch in `renderSettingEditor()` dynamically builds `<sp-menu-item>` elements from `settingDefinition.options`, requiring no hardcoding for future option changes

## How to Use

1. In Studio, open the settings panel for the target surface/locale.
2. Locate the **ctaMode** setting row and click to edit.
3. Select one of: `default` (no change), `buy-only` (suppress trial CTAs), or `trial-only` (suppress buy CTAs).
4. Optionally set **learnMoreUrl** to a URL string — used as a fallback anchor when all CTAs for a card are suppressed.
5. Save. On next page hydration, cards with conflicting CTAs will have them removed (or replaced with the Learn More link).

## Configuration

| Setting | Type | Values | Description |
|---------|------|--------|-------------|
| `ctaMode` | select | `default`, `buy-only`, `trial-only` | Controls which CTA type is suppressed globally for the surface |
| `learnMoreUrl` | text | Any URL | Fallback href rendered as `Learn More` when all CTAs are suppressed |

Both fields are authored in Studio and flow through MAS-IO settings; no environment variables or build-time config are required.

## Testing

```sh
# Web components unit tests
cd web-components && npm run test:ci

# IO/www settings transformer tests
cd io/www && npm run test:ci

# Syntax check
node --check web-components/src/constants.js
node --check web-components/src/hydrate.js
node --check io/www/src/fragment/transformers/settings.js
```

The `processCtaMode` suite covers: default/absent mode (pass-through), buy-only with dual CTAs, trial-only with dual CTAs, single compatible CTA (unchanged), single conflicting CTA with/without `learnMoreUrl`, links with no `data-modal` attribute (pass-through), and missing `ctas` field (no-op).

## Notes

- The CTA swap is a **runtime DOM mutation only** — no content fragments are written or republished.
- Cards that have only buy CTAs under `buy-only` mode (or only trial CTAs under `trial-only` mode) are unaffected.
- `data-modal` attribute values `d2p` (buy) and `twp` (trial) are sourced from the existing `MODAL_TYPE_3_IN_1` constant and are not duplicated.
- Future CTA modal types can be accommodated by extending `CTA_MODE` and the suppress logic in `processCtaMode`.
