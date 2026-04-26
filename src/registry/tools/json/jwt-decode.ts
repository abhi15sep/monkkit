import type { ToolDefinition } from "@/types/registry";
import { process } from "@/tools/json/jwt-decode/logic";
export const jwtDecodeTool: ToolDefinition = {
  id: "json-jwt-decode", slug: "jwt-decode", name: "JWT Decoder",
  shortDescription: "Decode and inspect JWT header, payload, and expiry.",
  description: "Decode a JSON Web Token and inspect its header, payload, and signature. Shows issued-at and expiry timestamps, and flags expired tokens. No signature verification — purely a decoder.",
  category: "json", tags: ["jwt", "decode", "auth", "token"], keywords: ["jwt decoder online", "decode jwt token", "inspect jwt payload"],
  icon: "KeyRound", status: "new",
  component: () => import("@/tools/json/jwt-decode"), process,
};
