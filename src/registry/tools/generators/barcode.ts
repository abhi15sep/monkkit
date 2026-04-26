import type { ToolDefinition } from "@/types/registry";

export const barcodeTool: ToolDefinition = {
  id: "generators-barcode",
  slug: "barcode",
  name: "Barcode Generator",
  shortDescription: "Generate barcodes in Code128, EAN-13, UPC-A, and more formats.",
  description:
    "Generate professional barcodes in multiple formats including Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14, and Codabar. Customize colors, size, and text display. Download as SVG or PNG.",
  category: "generators",
  tags: ["barcode", "ean", "upc", "code128", "generator"],
  keywords: ["barcode generator online", "ean-13 barcode", "upc barcode maker", "code128 generator"],
  icon: "BarChart2",
  status: "new",
  component: () => import("@/tools/generators/barcode"),
  process: (input) => import("@/tools/generators/barcode/logic").then((m) => m.process(input as Parameters<typeof m.process>[0])),
};
