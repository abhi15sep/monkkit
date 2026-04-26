import Ajv from "ajv";
import addFormats from "ajv-formats";

export interface SchemaValidateInput {
  data: string;
  schema: string;
}

export interface ValidationError {
  path: string;
  message: string;
  keyword: string;
}

export interface SchemaValidateOutput {
  success: boolean;
  valid?: boolean;
  errors?: ValidationError[];
  errorCount?: number;
  error?: string;
}

export function process(params: unknown): SchemaValidateOutput {
  const { data, schema } = params as SchemaValidateInput;
  if (!data?.trim()) return { success: false, error: "Data input is empty" };
  if (!schema?.trim()) return { success: false, error: "Schema input is empty" };

  let parsedData: unknown, parsedSchema: unknown;
  try { parsedData = JSON.parse(data); } catch (e) { return { success: false, error: `Invalid data JSON: ${(e as Error).message}` }; }
  try { parsedSchema = JSON.parse(schema); } catch (e) { return { success: false, error: `Invalid schema JSON: ${(e as Error).message}` }; }

  try {
    const ajv = new Ajv({ allErrors: true, strict: false });
    // addFormats may not have default export in all builds
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (addFormats as any)(ajv);
    const validate = ajv.compile(parsedSchema as object);
    const valid = validate(parsedData);
    if (valid) return { success: true, valid: true, errors: [], errorCount: 0 };
    const errors: ValidationError[] = (validate.errors ?? []).map((e) => ({
      path: e.instancePath || "/",
      message: e.message ?? "unknown error",
      keyword: e.keyword,
    }));
    return { success: true, valid: false, errors, errorCount: errors.length };
  } catch (e) {
    return { success: false, error: `Schema compilation failed: ${(e as Error).message}` };
  }
}
