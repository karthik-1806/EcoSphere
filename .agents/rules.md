# Project Constitution: Carbon Footprint Tracker (EcoPulse)

All code generated must strictly adhere to the following five tenets. Failure to follow these is considered a critical failure.

## Tenet 1: Zero Implicit Trusts
- Every input (user, local storage, API) must be validated via Zod schemas before entering the application state.
- No loose object parsing. Graceful failure and fallback to defaults are mandatory for all data retrieval.

## Tenet 2: Strict Typings
- Forbidden: `any`, `unknown` (without guards), and `as Type` assertions.
- Mandatory: Explicit interfaces for all components, props, and utility functions. Generics must be used where type-safety is required.

## Tenet 3: Accessibility (WCAG 2.2 AA)
- Interactive elements must be native (`<button>`, `<input>`, etc.) or have valid `role` + `tabIndex`.
- 100% keyboard navigability is non-negotiable. Focus rings must be visible.

## Tenet 4: Resource Conservation
- Minimize re-renders: Push state to leaf components.
- Zero Layout Shift (CLS: 0). Always reserve space for dynamic content.
- Use `useMemo`/`useCallback` for expensive calculations.

## Tenet 5: Automated Verification
- Every module requires a corresponding unit/integration test file.
- Total project test coverage must remain at 100%.
- If a feature is implemented, the accompanying test suite must be generated simultaneously.
