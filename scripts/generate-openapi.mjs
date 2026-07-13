import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parseArgs } from "util";

const ROOT = process.cwd();

const { values } = parseArgs({
  options: {
    api: { type: "string" },
    outputDir: { type: "string" },
    docsFile: { type: "string" },
  },
});

function findDocsFiles(dir, docsFileName) {
  const results = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findDocsFiles(fullPath, docsFileName));
    } else if (entry === docsFileName) {
      results.push(fullPath);
    }
  }

  return results;
}

function versionOf(path) {
  const match = path.match(/^\/(v\d+)(\/|$)/);
  return match ? match[1] : "unversioned";
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

function groupByVersion(docsFiles) {
  const groups = {};

  for (const file of docsFiles) {
    const content = JSON.parse(readFileSync(file, "utf-8"));
    const entries = Array.isArray(content) ? content : [content];

    for (const entry of entries) {
      const version = versionOf(entry.path);
      if (!groups[version]) groups[version] = {};
      addToPaths(groups[version], entry);
    }
  }

  return groups;
}

function build(apiDir, outputDir, docsFileName) {
  const docsFiles = findDocsFiles(apiDir, docsFileName);
  const groups = groupByVersion(docsFiles);

  for (const [version, paths] of Object.entries(groups)) {
    const document = {
      openapi: "3.1.0",
      info: {
        title: "API",
        version,
      },
      paths,
    };

    const outputFile = join(outputDir, `openapi.${version}.generated.json`);
    writeFileSync(outputFile, JSON.stringify(document, null, 2) + "\n", "utf-8");
    console.log(`Generated ${version} (${Object.keys(paths).length} path(s)) → ${outputFile}`);
  }

  docsFiles.forEach((f) => console.log(`  ${f.replace(ROOT + "/", "")}`));
}

const usage =
  "Example: node generate-openapi.mjs --api=/src/app/api --outputDir=/src/docs --docsFile=_docs.json";

if (!values.api) {
  console.error(`Error: --api argument is required. ${usage}`);
  process.exit(1);
}

if (!values.outputDir) {
  console.error(`Error: --outputDir argument is required. ${usage}`);
  process.exit(1);
}

if (!values.docsFile) {
  console.error(`Error: --docsFile argument is required. ${usage}`);
  process.exit(1);
}

try {
  build(join(ROOT, values.api), join(ROOT, values.outputDir), values.docsFile);
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
