# /document-frontend

Generate or update documentation for the front-end codebase under `src/front-end/`, following Feature-Sliced Design (FSD) conventions.

## When to use

Run this command whenever you:
- Add a new FSD layer folder (`features/`, `entities/`, `shared/<lib>/`)
- Add a new feature, entity, or shared sub-library
- Add or remove files from an existing layer
- Change the public API of a shared lib

## What this command does

For each target, read the source files, then write or update the corresponding `README.md` following the rules below. Do not modify source code — documentation only.

---

## Rules by layer

### `src/front-end/README.md`

Top-level FSD overview. Must contain:
- A directory tree showing all current layers and sub-libraries
- A layer import-rule table (`may import from` / `must never import from`)
- A one-paragraph description of each layer

### `src/front-end/shared/README.md`

Overview of the `shared/` layer. Must contain:
- A table of all sub-libraries with a one-line purpose description
- A "File Descriptions" section per sub-library: a table listing every file with a one-sentence description of what it exports or does

### `src/front-end/shared/<lib>/README.md`

Per-library reference. Must contain:
- A one-paragraph description of the library's purpose
- A file table (file → one-sentence description)
- A "Usage" section with copy-paste TypeScript import examples
- A "Usage rules" section (import path, what not to do)

### `src/front-end/entities/README.md`

Entity layer reference. Must contain:
- The folder structure (one folder per entity)
- Per-entity sections with:
  - Field table (`field | type | description`)
  - List of typical file contents (`types.ts`, `constants.ts`, `utils.ts`)
- Conventions section (barrel exports, naming, type mirroring from `src/domain/`)

### `src/front-end/features/README.md`

Feature layer reference. Must contain:
- Folder structure and naming convention (`<domain>-<action>`)
- Per-feature sections, each covering the full user flow:

  ```
  ### <feature-name> — <human title>

  #### Screen
  Which page/URL the user is on. Layout context (auth-protected? centered? full-page?).

  #### Form / UI
  Table of all inputs: field name | input type | label | validation rules.
  List of buttons and their states (idle, loading, disabled conditions).

  #### User Flow
  Step-by-step narrative:
    1. Initial state (what the user sees)
    2. User actions (fill fields, click button)
    3. Client-side validation (which fields, what rules, what error is shown)
    4. Request in-flight (loading state description)
    5. Success path (server response, UI change, navigation)
    6. Error paths — one entry per error case:
       - HTTP status / error type
       - What message is shown (inline field error vs. form-level vs. toast)
       - Whether fields are re-enabled

  #### Service
  The service function used, the endpoint it calls, and the return type.
  ```

- A "Adding a New Feature" section with the template above

---

## Steps to run

1. Read every file in the target directory/layer
2. Write the README following the rules above
3. If the README already exists, update only sections that have changed — preserve any hand-written context not derivable from code
4. After writing, verify:
   - All files in the folder are listed
   - Field tables match actual TypeScript types
   - User flows cover success AND every documented error response from the API route

## Output

One `README.md` per targeted folder. No changes to `.ts`, `.tsx`, or `.mjs` source files.
