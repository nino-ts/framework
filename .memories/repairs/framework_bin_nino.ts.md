# Repair note: framework/bin/nino.ts

File: framework\bin\nino.ts
Occurrences found: 1

Snippet (context around markers):

```js
const command = positionals[2];
<<<<<<< HEAD
const localBootstrapEntry = path.join(process.cwd(), "src", "bootstrap", "app.ts");
const publishedBootstrapEntry = path.join(import.meta.dir, "..", "dist", "app.js");
... (omitted)
=======
const cwdEntry = path.resolve(process.cwd(), "src/bootstrap/app.ts");
const packageEntry = path.resolve(import.meta.dir, "../src/bootstrap/app.ts");
... (omitted)
>>>>>>> 5dd5d88
```

Suggested action:
- Manual review required, but recommended to keep the HEAD variant which resolves a local development bootstrap (src/bootstrap/app.ts) and a published bundle (dist/app.js). This aligns with the styleguide changes (allow local dev bootstrap and published dist). Ensure usage message and non-zero exit behavior are preserved.

Confidence: medium — manual verification and local run of CLI recommended.
