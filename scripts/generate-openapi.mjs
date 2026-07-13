import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parseArgs } from "util";

const ROOT = process.cwd();

const { values } = parseArgs({
  options: {
    api: { type: "string" },
    output: { type: "string" },
  },
});

function findDocsFiles(dir) {
  const results = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findDocsFiles(fullPath));
    } else if (entry === "_docs.json") {
      results.push(fullPath);
    }
  }

  return results;
}

function toOpenApiResponses(output) {
  const responses = {};

  for (const [status, schema] of Object.entries(output ?? {})) {
    responses[status] = {
      description: `HTTP ${status}`,
      content: { "application/json": { schema } },
    };
  }

  return responses;
}

function toOperation(entry) {
  const operation = {
    summary: entry.title,
    description: entry.description,
    responses: toOpenApiResponses(entry.output),
  };

  if (entry.input) {
    operation.requestBody = {
      content: { "application/json": { schema: entry.input } },
    };
  }

  return operation;
}

function addToPaths(paths, entry) {
  const path = entry.path;
  const method = entry.method.toLowerCase();

  if (!paths[path]) paths[path] = {};
  paths[path][method] = toOperation(entry);
}

function build(apiDir, outputFile) {
  const docsFiles = findDocsFiles(apiDir);
  const paths = {};

  for (const file of docsFiles) {
    const content = JSON.parse(readFileSync(file, "utf-8"));
    const entries = Array.isArray(content) ? content : [content];

    for (const entry of entries) {
      addToPaths(paths, entry);
    }
  }

  const document = {
    openapi: "3.1.0",
    info: {
      title: "API",
      version: "1.0.0",
    },
    paths,
  };

  writeFileSync(outputFile, JSON.stringify(document, null, 2) + "\n", "utf-8");
  console.log(`Generated ${docsFiles.length} route doc(s) → ${outputFile}`);
  docsFiles.forEach((f) => console.log(`  ${f.replace(ROOT + "/", "")}`));
}

if (!values.api) {
  console.error(
    "Error: --api argument is required. Example: node generate-openapi.mjs --api=/src/app/api --output=/openapi.generated.json",
  );
  process.exit(1);
}

if (!values.output) {
  console.error(
    "Error: --output argument is required. Example: node generate-openapi.mjs --api=/src/app/api --output=/openapi.generated.json",
  );
  process.exit(1);
}

try {
  build(join(ROOT, values.api), join(ROOT, values.output));
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
