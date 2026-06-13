# Testing Strategy

## Overview
EcoSphere follows a testing strategy that validates behavior, security, accessibility, and edge cases. The test suite is designed for competition-grade evaluation and continuous quality assurance.

## Test Types

- **Unit tests** — Validate pure functions and utility logic such as carbon calculation and storage helpers.
- **Integration tests** — Verify end-to-end form flows, provider state behavior, and dashboard data rendering.
- **Accessibility tests** — Ensure the UI meets accessibility requirements using `vitest-axe`.
- **Security tests** — Cover validation, sanitization, and safe persistence scenarios.
- **Edge-case tests** — Validate invalid storage payloads, empty state recovery, and boundary values.

## Test Tools

- **Vitest** — Fast test runner and assertion library.
- **Testing Library** — DOM-driven component assertions.
- **vitest-axe** — Accessibility validation and screen reader compatibility checks.
- **jsdom** — Browser-like DOM environment for component testing.

## Test Coverage

- **185+ tests** across components, hooks, utilities, and provider logic.
- **Coverage enforcement** via `vitest run --coverage`.
- **Automated validation** through test scripts and CI-ready commands.

## Core Test Files

- `src/components/assessment/AssessmentForm.test.tsx`
- `src/components/assessment/AssessmentForm.accessibility.test.tsx`
- `src/components/providers/AppProvider.test.tsx`
- `src/components/providers/AppProvider.goals.test.tsx`
- `src/lib/calculator.test.ts`
- `src/lib/schemas.test.ts`
- `src/lib/utils.storage.test.ts`
- `src/hooks/useFootprint.test.ts`
- `src/app/dashboard/Dashboard.test.tsx`

## Test Setup

- `src/test/setup.ts` configures the test environment.
- It provides a mock `localStorage` implementation when absent.
- It stubs `requestIdleCallback` and `cancelIdleCallback`.
- It ensures `getComputedStyle` works for accessibility test paths.

## Quality Checks

- `npm run test` — Runs the full Vitest suite.
- `npm run test:coverage` — Generates coverage reports.
- `npm run type-check` — Verifies TypeScript correctness.
- `npm run lint` — Enforces static quality rules.

## Example Test Scenarios

- Form submits valid carbon entries and displays the correct carbon preview.
- Invalid input generates a visible error state.
- Local storage loads safe defaults when payload is malformed.
- Dashboard renders correct breakdown values.
- Accessibility checks verify keyboard support and ARIA roles.
- Security checks ensure form sanitization and strict schema validation.

## Test Metrics

| Metric | Status |
|---|---|
| Total tests | 185+ |
| Pass rate | 100% expected |
| Accessibility coverage | vitest-axe enabled |
| Type checking | `tsc --noEmit` |
| Linting | ESLint with security rules |

## Maintenance

- Add tests for each new feature before merging.
- Keep accessibility regressions low by adding axe tests for new UI components.
- Validate storage parsing and recovery logic whenever data shapes change.
