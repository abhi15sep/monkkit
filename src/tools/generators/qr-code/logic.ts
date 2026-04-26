export type QrType = "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard";
export type ErrorLevel = "L" | "M" | "Q" | "H";
export type WifiAuth = "WPA" | "WEP" | "nopass";

export interface QrInput {
  type: QrType;
  // URL / Text / Phone / Email
  value?: string;
  // Email extras
  emailSubject?: string;
  emailBody?: string;
  // SMS extras
  smsMessage?: string;
  // WiFi extras
  wifiSsid?: string;
  wifiPassword?: string;
  wifiAuth?: WifiAuth;
  wifiHidden?: boolean;
  // vCard extras
  vcardName?: string;
  vcardOrg?: string;
  vcardPhone?: string;
  vcardEmail?: string;
  vcardUrl?: string;
  vcardAddress?: string;
  // Appearance
  size?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorLevel?: ErrorLevel;
}

export interface QrOutput {
  success: boolean;
  dataUrl?: string;
  svgString?: string;
  rawData?: string;
  error?: string;
}

export function buildQrData(input: QrInput): string {
  switch (input.type) {
    case "url":
      return input.value ?? "";
    case "text":
      return input.value ?? "";
    case "email": {
      const to = input.value ?? "";
      const params: string[] = [];
      if (input.emailSubject) params.push(`subject=${encodeURIComponent(input.emailSubject)}`);
      if (input.emailBody) params.push(`body=${encodeURIComponent(input.emailBody)}`);
      return params.length ? `mailto:${to}?${params.join("&")}` : `mailto:${to}`;
    }
    case "phone":
      return `tel:${input.value ?? ""}`;
    case "sms": {
      const msg = input.smsMessage ? `?body=${encodeURIComponent(input.smsMessage)}` : "";
      return `sms:${input.value ?? ""}${msg}`;
    }
    case "wifi": {
      const ssid = (input.wifiSsid ?? "").replace(/[\\;,":]/g, (c) => `\\${c}`);
      const pass = (input.wifiPassword ?? "").replace(/[\\;,":]/g, (c) => `\\${c}`);
      const auth = input.wifiAuth ?? "WPA";
      const hidden = input.wifiHidden ? "true" : "false";
      return `WIFI:T:${auth};S:${ssid};P:${pass};H:${hidden};;`;
    }
    case "vcard": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        input.vcardName ? `FN:${input.vcardName}` : "",
        input.vcardOrg ? `ORG:${input.vcardOrg}` : "",
        input.vcardPhone ? `TEL:${input.vcardPhone}` : "",
        input.vcardEmail ? `EMAIL:${input.vcardEmail}` : "",
        input.vcardUrl ? `URL:${input.vcardUrl}` : "",
        input.vcardAddress ? `ADR:;;${input.vcardAddress};;;;` : "",
        "END:VCARD",
      ].filter(Boolean);
      return lines.join("\n");
    }
    default:
      return input.value ?? "";
  }
}

export async function process(input: QrInput): Promise<QrOutput> {
  try {
    const QRCode = (await import("qrcode")).default;
    const data = buildQrData(input);
    if (!data.trim()) return { success: false, error: "No data to encode" };

    const opts = {
      width: input.size ?? 300,
      margin: input.margin ?? 2,
      errorCorrectionLevel: input.errorLevel ?? "M",
      color: {
        dark: input.darkColor ?? "#000000",
        light: input.lightColor ?? "#ffffff",
      },
    };

    const dataUrl = await QRCode.toDataURL(data, opts);
    const svgString = await QRCode.toString(data, { ...opts, type: "svg" });

    return { success: true, dataUrl, svgString, rawData: data };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
