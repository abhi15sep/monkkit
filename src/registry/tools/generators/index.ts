import type { ToolDefinition } from "@/types/registry";
import { qrCodeTool } from "./qr-code";
import { barcodeTool } from "./barcode";

export const generatorTools: ToolDefinition[] = [qrCodeTool, barcodeTool];
