# Accessibility

## Objective
EcoSphere is designed to be usable by people with diverse abilities, including keyboard users and screen reader users. Accessibility is treated as a first-class feature in the application.

## WCAG Goals

The project targets a WCAG 2.2 AA-aligned experience with a focus on:

- Keyboard navigation
- Clear focus states
- Screen reader compatibility
- Semantic markup and role support
- Sufficient color contrast
- Accessible form controls

## Accessibility Features

- **Keyboard navigation** for all interactive elements.
- **ARIA support** for tab panels, form controls, and status announcements.
- **Semantic HTML** components using `fieldset`, `legend`, `button`, `label`, and `input`.
- **Visible focus management** with ring outlines and high contrast.
- **Live region updates** for carbon impact changes and error messages.
- **Screen reader compatibility** through explicit labels and descriptions.

## Implementation Details

### Keyboard Support

- Category tabs are interactive buttons with `role="tab"` semantics.
- Preset actions and form buttons are reachable via keyboard.
- Enter and Space keys activate actionable controls.

### Screen Reader Support

- Inputs include `aria-label` and `aria-describedby` where appropriate.
- Carbon preview updates are announced using `aria-live="polite"`.
- Error alerts use `role="alert"` and `aria-live="assertive"`.

### Semantic Structure

- `fieldset` and `legend` provide accessible form grouping.
- `section` landmarks organize content meaningfully.
- Headings follow a logical hierarchy for screen reader scanning.

### Visual Contrast

- Text and UI elements use color contrast ratios that meet WCAG AA thresholds.
- Backgrounds, borders, and accent colors are chosen for readability.
- Focus indicators remain visible on light and dark backgrounds.

## Testing Accessibility

- `vitest-axe` is integrated to check for common accessibility violations.
- Tests include keyboard flows and ARIA attribute assertions.
- The test setup includes DOM polyfills required for axe evaluations.

## Ongoing Accessibility Practices

- Add accessibility test coverage for new UI components.
- Review color contrast for new visual styles.
- Validate interactive patterns for keyboard and screen reader users.
- Maintain semantic HTML structure with future UI changes.
