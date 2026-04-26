"use client";

import { useState, useRef, useCallback } from "react";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ToolComponentProps } from "@/types/registry";
import type { BarcodeFormat } from "./logic";
import { FORMAT_LABELS } from "./logic";

const FORMAT_EXAMPLES: Record<BarcodeFormat, string> = {
  CODE128: "MonkKit-2024",
  EAN13: "5901234123457",
  EAN8: "96385074",
  UPCA: "012345678905",
  CODE39: "MONKKIT",
  ITF14: "00012345678905",
  codabar: "A12345B",
  MSI: "123456",
};

const FORMAT_HINTS: Record<BarcodeFormat, string> = {
  CODE128: "Alphanumeric, any printable ASCII",
  EAN13: "Exactly 12 digits (check digit auto-added)",
  EAN8: "Exactly 7 digits (check digit auto-added)",
  UPCA: "Exactly 11 digits (check digit auto-added)",
  CODE39: "Uppercase A-Z, 0-9, - . $ / + % space",
  ITF14: "Exactly 13 digits (check digit auto-added)",
  codabar: "Digits + special chars, start/end with A-D",
  MSI: "Digits only",
};

export default function BarcodeTool({ toolMeta: _ }: ToolComponentProps) {
  const [value, setValue] = useState("MonkKit-2024");
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [result, setResult] = useState<{ success: boolean; svgString?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const handleFormatChange = (f: BarcodeFormat) => {
    setFormat(f);
    setValue(FORMAT_EXAMPLES[f]);
  };

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    const { process } = await import("./logic");
    const r = await process({ value, format, width, height, displayValue, fontSize, lineColor, background });
    setResult(r);
    setLoading(false);
  }, [value, format, width, height, displayValue, fontSize, lineColor, background]);

  const downloadSvg = () => {
    if (!result?.svgString) return;
    const blob = new Blob([result.svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "barcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    const container = svgContainerRef.current;
    if (!container) return;
    const svgEl = container.querySelector("svg");
    if (!svgEl) return;
    const canvas = document.createElement("canvas");
    const bbox = svgEl.getBoundingClientRect();
    canvas.width = bbox.width * 2;
    canvas.height = bbox.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const svgBlob = new Blob([svgEl.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "barcode.png";
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[600px]">
      {/* Left: Inputs */}
      <div className="flex flex-col gap-5 lg:w-[380px] shrink-0">
        <div>
          <Label className="mb-1.5 block text-sm">Barcode Format</Label>
          <Select value={format} onValueChange={(v) => handleFormatChange(v as BarcodeFormat)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(FORMAT_LABELS) as BarcodeFormat[]).map((f) => (
                <SelectItem key={f} value={f}>{FORMAT_LABELS[f]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{FORMAT_HINTS[format]}</p>
        </div>

        <div>
          <Label className="mb-1.5 block text-sm">Value</Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={FORMAT_EXAMPLES[format]}
            className="font-mono"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="mb-1.5 block text-sm">Line Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-input" />
              <Input value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="font-mono text-sm" />
            </div>
          </div>
          <div className="flex-1">
            <Label className="mb-1.5 block text-sm">Background</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-input" />
              <Input value={background} onChange={(e) => setBackground(e.target.value)} className="font-mono text-sm" />
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block text-sm">Bar Width: {width}px</Label>
          <Slider min={1} max={5} step={0.5} value={[width]} onValueChange={(v) => setWidth(Array.isArray(v) ? v[0] : v)} />
        </div>

        <div>
          <Label className="mb-1.5 block text-sm">Height: {height}px</Label>
          <Slider min={40} max={200} step={10} value={[height]} onValueChange={(v) => setHeight(Array.isArray(v) ? v[0] : v)} />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="show-value" checked={displayValue} onCheckedChange={setDisplayValue} />
          <Label htmlFor="show-value" className="cursor-pointer text-sm">Show text below barcode</Label>
        </div>

        {displayValue && (
          <div>
            <Label className="mb-1.5 block text-sm">Font Size: {fontSize}px</Label>
            <Slider min={10} max={40} step={2} value={[fontSize]} onValueChange={(v) => setFontSize(Array.isArray(v) ? v[0] : v)} />
          </div>
        )}

        <Button onClick={handleGenerate} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
          {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Generate Barcode
        </Button>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-muted/30 p-8 min-h-[400px]">
        {result?.success && result.svgString ? (
          <>
            <div
              ref={svgContainerRef}
              className="rounded-lg overflow-hidden shadow-lg border border-border bg-white p-4"
              dangerouslySetInnerHTML={{ __html: result.svgString }}
            />
            <div className="flex gap-3 flex-wrap justify-center">
              <Button variant="outline" onClick={downloadSvg} className="gap-2">
                <Download className="w-4 h-4" /> Download SVG
              </Button>
              <Button variant="outline" onClick={downloadPng} className="gap-2">
                <Download className="w-4 h-4" /> Download PNG
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Format: {FORMAT_LABELS[format]}</p>
          </>
        ) : result && !result.success ? (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 max-w-sm text-center">
            {result.error}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <div className="flex gap-1 justify-center mb-4">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="bg-foreground/15 rounded-sm"
                  style={{ width: i % 3 === 0 ? 6 : i % 2 === 0 ? 3 : 2, height: 64 }}
                />
              ))}
            </div>
            <p className="text-sm font-medium">Configure and click Generate</p>
            <p className="text-xs mt-1">Supports Code128, EAN-13, UPC-A, and more</p>
          </div>
        )}
      </div>
    </div>
  );
}
