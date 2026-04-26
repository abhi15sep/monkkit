import type { ToolDefinition } from "@/types/registry";

export const qrCodeTool: ToolDefinition = {
  id: "generators-qr-code",
  slug: "qr-code",
  name: "QR Code Generator",
  shortDescription: "Generate QR codes for URLs, WiFi, vCards, SMS, and more.",
  description:
    "Create QR codes for any purpose — links, plain text, email, phone numbers, SMS, WiFi credentials, or vCard contacts. Customize colors, size, error correction level, and download as PNG or SVG.",
  category: "generators",
  tags: ["qr", "qrcode", "generator", "wifi", "vcard", "url"],
  keywords: ["qr code generator online", "free qr code maker", "wifi qr code", "vcard qr code"],
  icon: "QrCode",
  status: "new",
  component: () => import("@/tools/generators/qr-code"),
  process: (input) => import("@/tools/generators/qr-code/logic").then((m) => m.process(input as Parameters<typeof m.process>[0])),
};
