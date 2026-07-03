import Ajv, { type Schema, type ErrorObject, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const compiledSchemas = new WeakMap<Schema & object, ValidateFunction>();

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function getValidator(schema: Schema): ValidateFunction {
  // In case if schema is bool, which is valid for JSON Schema spec
  if (typeof schema !== "object" || schema === null) {
    return ajv.compile(schema);
  }

  const cached = compiledSchemas.get(schema);
  if (cached) return cached;

  const compiled = ajv.compile(schema);
  compiledSchemas.set(schema, compiled);
  return compiled;
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];
  return errors.map((error) =>
    `${error.instancePath || "value"} ${error.message}`.trim(),
  );
}

function validate(schema: Schema, data: unknown): ValidationResult {
  const validateFn = getValidator(schema);
  const valid = validateFn(data);
  return { valid, errors: formatErrors(validateFn.errors) };
}

export { validate };
export type { ValidationResult };
