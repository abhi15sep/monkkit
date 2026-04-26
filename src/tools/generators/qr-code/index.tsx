"use client";

import { useState, useCallback } from "react";
import { Download, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import type { ToolComponentProps } from "@/types/registry";
import type { QrType, ErrorLevel, WifiAuth, QrInput, QrOutput } from "./logic";

const QR_TYPES: { value: QrType; label: string }[] = [
  { value: "url", label: "URL / Link" },
  { value: "text", label: "Plain Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
  { value: "wifi", label: "WiFi" },
  { value: "vcard", label: "vCard Contact" },
];

const ERROR_LEVELS: { value: ErrorLevel; label: string; desc: string }[] = [
  { value: "L", label: "L — Low (7%)", desc: "Smallest size" },
  { value: "M", label: "M — Medium (15%)", desc: "Recommended" },
  { value: "Q", label: "Q — Quartile (25%)", desc: "More reliable" },
  { value: "H", label: "H — High (30%)", desc: "Best for logo overlay" },
];

export default function QrCodeTool({ toolMeta: _ }: ToolComponentProps) {
  const [qrType, setQrType] = useState<QrType>("url");
  const [value, setValue] = useState("https://tools.devops-monk.com");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiAuth, setWifiAuth] = useState<WifiAuth>("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vcardName, setVcardName] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardUrl, setVcardUrl] = useState("");
  const [vcardAddress, setVcardAddress] = useState("");
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [result, setResult] = useState<QrOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    const input: QrInput = {
      type: qrType,
      value,
      emailSubject,
      emailBody,
      smsMessage,
      wifiSsid,
      wifiPassword,
      wifiAuth,
      wifiHidden,
      vcardName,
      vcardOrg,
      vcardPhone,
      vcardEmail,
      vcardUrl,
      vcardAddress,
      size,
      margin,
      darkColor,
      lightColor,
      errorLevel,
    };
    const { process } = await import("./logic");
    const r = await process(input);
    setResult(r);
    setLoading(false);
  }, [
    qrType, value, emailSubject, emailBody, smsMessage,
    wifiSsid, wifiPassword, wifiAuth, wifiHidden,
    vcardName, vcardOrg, vcardPhone, vcardEmail, vcardUrl, vcardAddress,
    size, margin, darkColor, lightColor, errorLevel,
  ]);

  const downloadPng = () => {
    if (!result?.dataUrl) return;
    const a = document.createElement("a");
    a.href = result.dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = () => {
    if (!result?.svgString) return;
    const blob = new Blob([result.svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyDataUrl = async () => {
    if (!result?.dataUrl) return;
    await navigator.clipboard.writeText(result.dataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[600px]">
      {/* Left: Inputs */}
      <div className="flex flex-col gap-5 lg:w-[420px] shrink-0">
        {/* Type selector */}
        <div>
          <Label className="mb-2 block text-sm font-medium">QR Code Type</Label>
          <div className="flex flex-wrap gap-2">
            {QR_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setQrType(t.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                  qrType === t.value
                    ? "bg-violet-600 text-white border-violet-600"
                    : "border-border text-muted-foreground hover:border-violet-400 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic fields per type */}
        <div className="flex flex-col gap-3">
          {(qrType === "url" || qrType === "text") && (
            <div>
              <Label className="mb-1.5 block text-sm">{qrType === "url" ? "URL" : "Text"}</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={qrType === "url" ? "https://example.com" : "Enter text..."}
              />
            </div>
          )}

          {qrType === "email" && (
            <>
              <div>
                <Label className="mb-1.5 block text-sm">Email Address</Label>
                <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="user@example.com" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Subject (optional)</Label>
                <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Subject" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Body (optional)</Label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Message body..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </>
          )}

          {qrType === "phone" && (
            <div>
              <Label className="mb-1.5 block text-sm">Phone Number</Label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="+1234567890" />
            </div>
          )}

          {qrType === "sms" && (
            <>
              <div>
                <Label className="mb-1.5 block text-sm">Phone Number</Label>
                <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="+1234567890" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Message (optional)</Label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Pre-filled message..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </>
          )}

          {qrType === "wifi" && (
            <>
              <div>
                <Label className="mb-1.5 block text-sm">Network Name (SSID)</Label>
                <Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="MyWiFiNetwork" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Password</Label>
                <Input type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="Password" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Security</Label>
                <Select value={wifiAuth} onValueChange={(v) => setWifiAuth(v as WifiAuth)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No Password</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="accent-violet-600" />
                <span className="text-sm text-muted-foreground">Hidden network</span>
              </label>
            </>
          )}

          {qrType === "vcard" && (
            <>
              {[
                { label: "Full Name", val: vcardName, set: setVcardName, ph: "John Doe" },
                { label: "Organization", val: vcardOrg, set: setVcardOrg, ph: "Acme Inc." },
                { label: "Phone", val: vcardPhone, set: setVcardPhone, ph: "+1234567890" },
                { label: "Email", val: vcardEmail, set: setVcardEmail, ph: "john@example.com" },
                { label: "Website", val: vcardUrl, set: setVcardUrl, ph: "https://example.com" },
                { label: "Address", val: vcardAddress, set: setVcardAddress, ph: "123 Main St, City" },
              ].map(({ label, val, set, ph }) => (
                <div key={label}>
                  <Label className="mb-1.5 block text-sm">{label}</Label>
                  <Input value={val} onChange={(e) => set(e.target.value)} placeholder={ph} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Appearance */}
        <Tabs defaultValue="appearance">
          <TabsList className="mb-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="flex flex-col gap-4">
            <div>
              <Label className="mb-1.5 block text-sm">Size: {size}px</Label>
              <Slider min={100} max={600} step={50} value={[size]} onValueChange={(v) => setSize(Array.isArray(v) ? v[0] : v)} className="accent-violet-600" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="mb-1.5 block text-sm">Dark Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-input" />
                  <Input value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="font-mono text-sm" />
                </div>
              </div>
              <div className="flex-1">
                <Label className="mb-1.5 block text-sm">Light Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-input" />
                  <Input value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="font-mono text-sm" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="flex flex-col gap-4">
            <div>
              <Label className="mb-1.5 block text-sm">Quiet Zone (Margin): {margin}</Label>
              <Slider min={0} max={10} step={1} value={[margin]} onValueChange={(v) => setMargin(Array.isArray(v) ? v[0] : v)} />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Error Correction</Label>
              <Select value={errorLevel} onValueChange={(v) => setErrorLevel(v as ErrorLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ERROR_LEVELS.map((e) => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleGenerate} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
          {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Generate QR Code
        </Button>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-muted/30 p-8 min-h-[400px]">
        {result?.success && result.dataUrl ? (
          <>
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.dataUrl} alt="Generated QR Code" style={{ width: size, height: size, display: "block" }} />
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button variant="outline" onClick={downloadPng} className="gap-2">
                <Download className="w-4 h-4" /> Download PNG
              </Button>
              <Button variant="outline" onClick={downloadSvg} className="gap-2">
                <Download className="w-4 h-4" /> Download SVG
              </Button>
              <Button variant="outline" onClick={copyDataUrl} className="gap-2">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Data URL"}
              </Button>
            </div>
            {result.rawData && (
              <p className="text-xs text-muted-foreground text-center max-w-xs break-all">
                Encoded: <span className="font-mono">{result.rawData}</span>
              </p>
            )}
          </>
        ) : result && !result.success ? (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {result.error}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border mx-auto mb-4 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-20">
                <rect x="5" y="5" width="35" height="35" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="15" y="15" width="15" height="15" fill="currentColor" />
                <rect x="60" y="5" width="35" height="35" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="70" y="15" width="15" height="15" fill="currentColor" />
                <rect x="5" y="60" width="35" height="35" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="15" y="70" width="15" height="15" fill="currentColor" />
                <rect x="60" y="60" width="10" height="10" fill="currentColor" />
                <rect x="75" y="60" width="10" height="10" fill="currentColor" />
                <rect x="60" y="75" width="10" height="10" fill="currentColor" />
                <rect x="75" y="75" width="10" height="10" fill="currentColor" />
              </svg>
            </div>
            <p className="text-sm font-medium">Configure and click Generate</p>
            <p className="text-xs mt-1">Supports URL, WiFi, vCard, SMS, and more</p>
          </div>
        )}
      </div>
    </div>
  );
}
