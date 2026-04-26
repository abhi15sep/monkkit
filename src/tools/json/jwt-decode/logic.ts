export interface JwtDecodeInput {
  token: string;
}

export interface JwtDecodeOutput {
  success: boolean;
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signature?: string;
  error?: string;
  isExpired?: boolean;
  expiresAt?: string;
  issuedAt?: string;
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + (4 - (str.length % 4)) % 4, "=");
  return Buffer.from(padded, "base64").toString("utf-8");
}

export function process(params: unknown): JwtDecodeOutput {
  const { token } = params as JwtDecodeInput;
  const raw = token?.trim();
  if (!raw) return { success: false, error: "Token is empty" };

  const parts = raw.split(".");
  if (parts.length !== 3) return { success: false, error: "Invalid JWT — must have exactly 3 parts (header.payload.signature)" };

  try {
    const header = JSON.parse(base64urlDecode(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(base64urlDecode(parts[1])) as Record<string, unknown>;
    const signature = parts[2];

    const result: JwtDecodeOutput = { success: true, header, payload, signature };

    if (typeof payload.exp === "number") {
      const expDate = new Date(payload.exp * 1000);
      result.expiresAt = expDate.toISOString();
      result.isExpired = expDate < new Date();
    }
    if (typeof payload.iat === "number") {
      result.issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return result;
  } catch (e) {
    return { success: false, error: `Failed to decode JWT: ${(e as Error).message}` };
  }
}
