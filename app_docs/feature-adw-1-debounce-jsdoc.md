# Add JSDoc to Debounce Utility

**ADW ID:** 1
**Date:** 2026-03-23
**Specification:** specs/issue-18aa1878-adw-1-sdlc_planner-add-jsdoc-to-debounce.md

## Overview

Added a JSDoc comment block to the `debounce` function in `web-components/src/utils.js` to match the documentation style of the other exported utilities in that file. This is a documentation-only change with no functional impact.

## What Was Built

- JSDoc block for `debounce` with `@param` and `@returns` tags consistent with the style used by `createTag`, `isMobileOrTablet`, `discoverService`, and `paramsToHash`

## Technical Implementation

### Files Modified

- `web-components/src/utils.js`: Added JSDoc comment block immediately above `export function debounce(func, delay)`

### Key Changes

- Documents `@param {Function} func` — the function to debounce
- Documents `@param {number} delay` — delay in milliseconds
- Documents `@returns {Function}` — the debounced wrapper function
- No changes to the implementation logic

## How to Use

The `debounce` function wraps any function to delay its execution until after a specified idle period:

```js
import { debounce } from './utils.js';

const handleResize = debounce(() => {
  // expensive operation
}, 300);

window.addEventListener('resize', handleResize);
```

## Configuration

No configuration required. Pure utility function.

## Testing

Run the Node syntax check to verify no parse errors were introduced:

```sh
node --check web-components/src/utils.js
```

## Notes

This change restores JSDoc consistency across all exported utilities in `utils.js`. No functional behavior was altered.
