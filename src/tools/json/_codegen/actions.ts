"use server";

import { generateCode } from "./logic";

export async function generateCodeAction(params: {
  input: string;
  typeName: string;
  lang: string;
}) {
  return generateCode(params);
}
