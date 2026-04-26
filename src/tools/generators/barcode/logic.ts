export type BarcodeFormat =
  | "CODE128"
  | "EAN13"
  | "EAN8"
  | "UPCA"
  | "CODE39"
  | "ITF14"
  | "codabar"
  | "MSI";

export interface BarcodeInput {
  value: string;
  format?: BarcodeFormat;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  lineColor?: string;
  background?: string;
}

export interface BarcodeOutput {
  success: boolean;
  svgString?: string;
  error?: string;
}

const FORMAT_LABELS: Record<BarcodeFormat, string> = {
  CODE128: "Code 128 (auto)",
  EAN13: "EAN-13",
  EAN8: "EAN-8",
  UPCA: "UPC-A",
  CODE39: "Code 39",
  ITF14: "ITF-14",
  codabar: "Codabar",
  MSI: "MSI",
};

export { FORMAT_LABELS };

export async function process(input: BarcodeInput): Promise<BarcodeOutput> {
  try {
    const JsBarcode = (await import("jsbarcode")).default;
    const { DOMImplementation, XMLSerializer } = await import("xmldom");

    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument("http://www.w3.org/1999/xhtml", "html", null);
    const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    JsBarcode(svgNode, input.value, {
      format: input.format ?? "CODE128",
      width: input.width ?? 2,
      height: input.height ?? 100,
      displayValue: input.displayValue ?? true,
      fontSize: input.fontSize ?? 20,
      lineColor: input.lineColor ?? "#000000",
      background: input.background ?? "#ffffff",
      xmlDocument: document,
    });

    const svgString = xmlSerializer.serializeToString(svgNode);
    return { success: true, svgString };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
