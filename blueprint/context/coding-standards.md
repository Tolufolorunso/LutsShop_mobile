# Coding Standards

## TypeScript

- Strict mode enabled (`tsconfig.json` extends `expo/tsconfig.base` with `strict: true`)
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props and data models
- Use type inference where obvious, explicit types where helpful

## React / React Native

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks
- Use `StyleSheet.create()` for styles; avoid inline style objects outside of dynamic values

## Expo Router

- File-based routing under `src/app/`
- Stack screens use `src/app/_layout.tsx` as the root navigator
- Shared UI (headers, tabs) belongs in layout files, not in individual screens
- Use typed routes via `app.json` `experiments.typedRoutes: true`
- Path alias `@/*` maps to `src/*`; `@/assets/*` maps to `assets/*`

## File Organisation

- Screens: `src/app/[route].tsx`
- Components: `src/components/[feature]/ComponentName.tsx`
- Hooks: `src/hooks/use[Name].ts`
- Types: `src/types/[feature].ts`
- Utilities: `src/lib/[utility].ts`
- Assets: `assets/` (images, fonts, icons)

## Naming

- Components: PascalCase (`ProductCard.tsx`)
- Files: match component name or kebab-case for utilities
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no `I` prefix)

## Styling

- `StyleSheet.create()` for all static styles
- No inline styles except for truly dynamic values (e.g., computed widths)
- Platform-specific logic: `Platform.select()` or `.ios.tsx` / `.android.tsx` extensions
- Colors and spacing defined as shared constants, not magic numbers

## Data Fetching

- No specific data layer is configured yet. > TODO: document the API/state approach (e.g., React Query, Zustand, or plain `fetch`)
- Validate all external inputs before use

## Error Handling

- Use try/catch for async operations
- Display user-friendly messages; never surface raw error strings to the UI

## Testing

The project has no test runner configured yet. Testing is opt-in.
Run `/tests` or `$tests` to add one and update the Commands section of `AGENTS.md`.

When a test command exists it becomes a gate: logic-bearing steps must ship a
passing test. UI-only steps ride on device/emulator and screenshot evidence.

> TODO: add unit runner (Jest + jest-expo is the standard for Expo) when needed.

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible

## Comments

Write code that explains itself; comment only what the code cannot say.

- Comment the **why**, not the **what**. Delete any comment that restates the code.
- No banner/header blocks or section dividers.
- A comment earns its place only when it captures a non-obvious decision, gotcha, or workaround.
- Keep doc comments minimal: a one-line purpose on an exported type or function is plenty.

## Writing

- No em dashes (U+2014) in generated content: docs, comments, commit messages, READMEs, specs.
- Use a hyphen for `term - description` separators; rephrase prose with commas, parentheses, or a colon.
