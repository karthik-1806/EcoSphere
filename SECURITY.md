# Security Policy & Implementation Guide

## Overview
This document describes the implemented security controls for EcoSphere. It is aligned to the current codebase and highlights runtime protection, input validation, persistence safety, and threat mitigation.

## Current Security Scope

- Browser security headers in `next.config.mjs`
- Error boundary handling in `src/app/error.tsx`
- Safe 404 handling in `src/app/not-found.tsx`
- Persistent state management in `src/components/providers/AppProvider.tsx`
- Input validation and sanitization in `src/components/assessment/AssessmentForm.tsx`
- Test environment hardening in `src/test/setup.ts`
- Schema validation in `src/lib/schemas.ts`

## Browser Security Headers
The application enforces security headers globally:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` denying sensors, camera, microphone, payment, USB, and geolocation
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-XSS-Protection: 1; mode=block`

These headers reduce browser attack surface, prevent clickjacking, and enforce secure transport and content sources.

## Input Validation and Sanitization

EcoSphere validates and sanitizes user input at the entry point.

Key protections:

- `validateSecureInput(...)` checks string type, length, and control characters.
- `FormSchema` enforces category enums, numeric limits, and maximum text lengths.
- Description and option text is sanitized before storage.
- Invalid input produces user-facing error feedback instead of unsafe state.

This prevents malformed or malicious input from entering application state.

## Persistence Security

Local storage is protected by a safe persistence layer:

- `safeStorageParser(...)` loads persisted payloads and validates them against Zod schemas.
- `saveToStorage(...)` writes versioned envelopes to local storage.
- Corrupted or invalid storage values are replaced with safe defaults.
- `requestIdleCallback` and debounced writes minimize UI overhead.

This ensures persisted state cannot silently corrupt the app or load unsafe payloads.

## Schema Validation

The application uses Zod schemas to validate data in runtime and persistence flows.

Validated shapes include:

- Carbon entries
- Goals
- Challenges
- Targets
- User settings
- Storage envelopes

Invalid data is rejected before it becomes application state.

## Application Resilience

### Error Handling

- `src/app/error.tsx` provides a fallback UI for runtime render failures.
- The page logs the error and offers a safe recovery path.
- Sensitive internals are not exposed to end users.

### Not-found Handling

- `src/app/not-found.tsx` provides a safe 404 experience.
- Invalid routes are handled gracefully with navigation guidance.

## Accessibility and Safe UX

The app uses accessibility-aware security patterns:

- Keyboard-operable controls and focusable elements.
- ARIA labels and live regions for dynamic state.
- Semantic HTML forms and sectioning.
- Visible focus states and screen reader alignment.

## Threat Mitigations

### XSS Prevention

- User text is sanitized before persistence.
- Input validation blocks unsafe control characters.
- Untrusted strings are not rendered without escaping.

### Prototype Pollution Protection

- Local storage parsing strips dangerous keys such as `__proto__`, `constructor`, and `prototype`.
- Recursive cleaning protects nested objects.

### Storage Corruption Recovery

- Malformed storage is detected and reset.
- Versioned payload envelopes prevent schema mismatches.
- Safe defaults keep the app operational when storage is unavailable.

## Performance-Aware Security

- Carbon breakdowns use O(N) aggregation.
- Storage parsing occurs once on initialization.
- Recalculations happen only when source data changes.
- Background storage writes reduce perceived latency.

## Testing and Validation

Security is validated through tests and environment hardening:

- `src/test/setup.ts` provides a stable DOM environment for security and accessibility tests.
- The test suite covers input validation, sanitization, storage recovery, and edge cases.
- `vitest-axe` checks accessibility compliance and live region behavior.

## Best Practices

- Validate at the entry point.
- Sanitize before storing.
- Use strict schemas for persisted data.
- Fail safely to defaults when data is invalid.
- Treat local storage as an untrusted source.

## Dependencies

Critical dependencies are kept minimal and audited:

- `zod` for schema validation
- `next` for framework-level security and headers
- `react` for UI rendering
- `tailwindcss` for styling

## Summary

EcoSphere implements defense-in-depth security by combining:

- input validation,
- sanitization,
- strict runtime schemas,
- safe persistence,
- browser security headers,
- and accessibility-aware UI behavior.

This document should remain aligned with code changes as the project evolves.


1. Content Security Policy (CSP) headers
2. Rate limiting on storage operations
3. Encryption for sensitive localStorage data
4. Audit logging for data modifications
5. CORS policy hardening
6. Subresource integrity for external assets

## Security Contact

For security vulnerabilities, follow responsible disclosure practices.

## Compliance

- WCAG 2.1 Level AA accessibility
- Data privacy: No PII collected or stored
- No external API calls to untrusted sources
- All scripts self-hosted (no third-party trackers)
