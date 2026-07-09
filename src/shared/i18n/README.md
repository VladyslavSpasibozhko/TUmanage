# shared/i18n

Internationalization module shared by both the back-end and front-end. Not a
published package — a plain TypeScript module imported directly via
`@/src/shared/i18n`. Uses native `Intl.PluralRules` for pluralization; no
runtime i18n library.

Split into two ownership zones:

- top-level files (`types.ts`, `translator.interface.ts`, `index.ts`) — the
  runtime, dev-owned.
- `content/` — translation content, translations-team-owned (except
  `content/scripts/`, which is dev-owned).

## Files

| File | Description |
|------|-------------|
| `types.ts` | Shared types: `SupportedLocale`, `TranslationParams`, `PluralCategory`, `PluralForm`, `TranslationText`, `TranslationValue`, `TranslationResources` |
| `translator.interface.ts` | The `Translator` interface: `locale` (readonly) and `t(key, params?)` |
| `index.ts` | Barrel re-export of the above |
| `content/config/languages.json` | Default locale + list of supported locales |
| `content/source/*.json` | Source strings, default locale only, one file per domain entity plus `common.json`. Each entry is `{ text, description }` — `text` is `string \| PluralForm`, `description` is translator/MT context |
| `content/scripts/translationProvider.interface.ts` | `TranslationProvider` interface — abstraction for a future MT/LLM translation provider |

## Key format

`"namespace:leafKey"` (e.g. `"order:status.pending"`). No `:` prefix defaults
to the `common` namespace.

## Not implemented yet

- `createTranslator` (the runtime factory)
- `plural.ts` / `interpolate.ts` (plural resolution + `{{param}}` interpolation)
- `content/locales/*` (generated, per-locale output with `description` stripped)
- `content/scripts/noopProvider.ts` and `translate.ts` (the generation script)

## Usage rules

- Import from the barrel (`shared/i18n`), not individual files
- `content/source/` is written in the default locale only — never edit
  `content/locales/*` (generated) once it exists
- The translator must stay stateless per instance — no global mutable locale
  state, so concurrent requests with different locales stay isolated
