import type { ToolDefinition } from "@/types/registry";
import { jsonToolsTool } from "./validator";
import { jsonRepairTool } from "./repair";
import { jsonEscapeTool } from "./escape";
import { jsonUnescapeTool } from "./unescape";
import { jsonStringifyTool } from "./stringify";
import { jsonSortTool } from "./sort";
import { jsonDiffTool } from "./diff";
import { jsonPathTool } from "./jsonpath";
import { jsonFlattenTool } from "./flatten";
import { jsonUnflattenTool } from "./unflatten";
import { jsonSizeTool } from "./size";
import { jsonSearchTool } from "./search";
import { jsonToYamlTool } from "./to-yaml";
import { yamlToJsonTool } from "./from-yaml";
import { jsonToCsvTool } from "./to-csv";
import { csvToJsonTool } from "./from-csv";
import { jsonToXmlTool } from "./to-xml";
import { xmlToJsonTool } from "./from-xml";
import { jsonToTomlTool } from "./to-toml";
import { jsonToSqlTool } from "./to-sql";
import { jsonToTypescriptTool } from "./to-typescript";
import { jsonToPythonTool } from "./to-python";
import { jsonToGolangTool } from "./to-golang";
import { jsonToJavaTool } from "./to-java";
import { jsonToCsharpTool } from "./to-csharp";
import { jsonToRustTool } from "./to-rust";
import { jsonToZodTool } from "./to-zod";
import { jsonSchemaValidateTool } from "./schema-validate";
import { jsonSchemaGenerateTool } from "./schema-generate";
import { jwtDecodeTool } from "./jwt-decode";
import { jsonTokenCountTool } from "./token-count";

export const jsonTools: ToolDefinition[] = [
  jsonToolsTool,
  jsonRepairTool,
  jsonEscapeTool,
  jsonUnescapeTool,
  jsonStringifyTool,
  jsonSortTool,
  jsonDiffTool,
  jsonPathTool,
  jsonFlattenTool,
  jsonUnflattenTool,
  jsonSizeTool,
  jsonSearchTool,
  jsonToYamlTool,
  yamlToJsonTool,
  jsonToCsvTool,
  csvToJsonTool,
  jsonToXmlTool,
  xmlToJsonTool,
  jsonToTomlTool,
  jsonToSqlTool,
  jsonToTypescriptTool,
  jsonToPythonTool,
  jsonToGolangTool,
  jsonToJavaTool,
  jsonToCsharpTool,
  jsonToRustTool,
  jsonToZodTool,
  jsonSchemaValidateTool,
  jsonSchemaGenerateTool,
  jwtDecodeTool,
  jsonTokenCountTool,
];
