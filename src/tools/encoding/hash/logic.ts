export type HashAlgo = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export interface HashInput {
  input: string;
  algorithms?: HashAlgo[];
  uppercase?: boolean;
}

export interface HashOutput {
  success: boolean;
  hashes?: Record<HashAlgo, string>;
  error?: string;
}

async function sha(algo: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buf = await crypto.subtle.digest(algo, encoder.encode(data));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function md5(str: string): string {
  // RFC 1321 MD5 — pure JS implementation
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  const rol = (n: number, c: number) => (n << c) | (n >>> (32 - c));
  const cmn = (q: number, a: number, b: number, x: number, s: number, t: number) =>
    safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn(c ^ (b | ~d), a, b, x, s, t);

  const strToUTF8Bytes = (s: string) => new TextEncoder().encode(s);
  const bytes = strToUTF8Bytes(str);
  const bitsLen = bytes.length * 8;
  const padLen = ((bytes.length + 8) >> 6) + 1;
  const padded = new Uint8Array(padLen * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padLen * 64 - 8, bitsLen >>> 0, true);
  view.setUint32(padLen * 64 - 4, Math.floor(bitsLen / 0x100000000), true);

  const words: number[] = [];
  for (let i = 0; i < padded.length; i += 4) words.push(view.getUint32(i, true));

  let [a, b, c, d] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

  for (let i = 0; i < words.length; i += 16) {
    const [A, B, C, D] = [a, b, c, d];
    const w = words.slice(i, i + 16);
    a = ff(a,b,c,d,w[0],7,-680876936); d = ff(d,a,b,c,w[1],12,-389564586); c = ff(c,d,a,b,w[2],17,606105819); b = ff(b,c,d,a,w[3],22,-1044525330);
    a = ff(a,b,c,d,w[4],7,-176418897); d = ff(d,a,b,c,w[5],12,1200080426); c = ff(c,d,a,b,w[6],17,-1473231341); b = ff(b,c,d,a,w[7],22,-45705983);
    a = ff(a,b,c,d,w[8],7,1770035416); d = ff(d,a,b,c,w[9],12,-1958414417); c = ff(c,d,a,b,w[10],17,-42063); b = ff(b,c,d,a,w[11],22,-1990404162);
    a = ff(a,b,c,d,w[12],7,1804603682); d = ff(d,a,b,c,w[13],12,-40341101); c = ff(c,d,a,b,w[14],17,-1502002290); b = ff(b,c,d,a,w[15],22,1236535329);
    a = gg(a,b,c,d,w[1],5,-165796510); d = gg(d,a,b,c,w[6],9,-1069501632); c = gg(c,d,a,b,w[11],14,643717713); b = gg(b,c,d,a,w[0],20,-373897302);
    a = gg(a,b,c,d,w[5],5,-701558691); d = gg(d,a,b,c,w[10],9,38016083); c = gg(c,d,a,b,w[15],14,-660478335); b = gg(b,c,d,a,w[4],20,-405537848);
    a = gg(a,b,c,d,w[9],5,568446438); d = gg(d,a,b,c,w[14],9,-1019803690); c = gg(c,d,a,b,w[3],14,-187363961); b = gg(b,c,d,a,w[8],20,1163531501);
    a = gg(a,b,c,d,w[13],5,-1444681467); d = gg(d,a,b,c,w[2],9,-51403784); c = gg(c,d,a,b,w[7],14,1735328473); b = gg(b,c,d,a,w[12],20,-1926607734);
    a = hh(a,b,c,d,w[5],4,-378558); d = hh(d,a,b,c,w[8],11,-2022574463); c = hh(c,d,a,b,w[11],16,1839030562); b = hh(b,c,d,a,w[14],23,-35309556);
    a = hh(a,b,c,d,w[1],4,-1530992060); d = hh(d,a,b,c,w[4],11,1272893353); c = hh(c,d,a,b,w[7],16,-155497632); b = hh(b,c,d,a,w[10],23,-1094730640);
    a = hh(a,b,c,d,w[13],4,681279174); d = hh(d,a,b,c,w[0],11,-358537222); c = hh(c,d,a,b,w[3],16,-722521979); b = hh(b,c,d,a,w[6],23,76029189);
    a = hh(a,b,c,d,w[9],4,-640364487); d = hh(d,a,b,c,w[12],11,-421815835); c = hh(c,d,a,b,w[15],16,530742520); b = hh(b,c,d,a,w[2],23,-995338651);
    a = ii(a,b,c,d,w[0],6,-198630844); d = ii(d,a,b,c,w[7],10,1126891415); c = ii(c,d,a,b,w[14],15,-1416354905); b = ii(b,c,d,a,w[5],21,-57434055);
    a = ii(a,b,c,d,w[12],6,1700485571); d = ii(d,a,b,c,w[3],10,-1894986606); c = ii(c,d,a,b,w[10],15,-1051523); b = ii(b,c,d,a,w[1],21,-2054922799);
    a = ii(a,b,c,d,w[8],6,1873313359); d = ii(d,a,b,c,w[15],10,-30611744); c = ii(c,d,a,b,w[6],15,-1560198380); b = ii(b,c,d,a,w[13],21,1309151649);
    a = ii(a,b,c,d,w[4],6,-145523070); d = ii(d,a,b,c,w[11],10,-1120210379); c = ii(c,d,a,b,w[2],15,718787259); b = ii(b,c,d,a,w[9],21,-343485551);
    a = safeAdd(a, A); b = safeAdd(b, B); c = safeAdd(c, C); d = safeAdd(d, D);
  }

  return [a, b, c, d]
    .map((n) => {
      const v = new DataView(new ArrayBuffer(4));
      v.setUint32(0, n, true);
      return Array.from(new Uint8Array(v.buffer)).map((x) => x.toString(16).padStart(2, "0")).join("");
    })
    .join("");
}

export async function process(params: unknown): Promise<HashOutput> {
  const {
    input,
    algorithms = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"],
    uppercase = false,
  } = params as HashInput;
  if (!input) return { success: false, error: "Input is empty" };
  try {
    const results: Partial<Record<HashAlgo, string>> = {};
    for (const algo of algorithms) {
      let hash: string;
      if (algo === "MD5") {
        hash = md5(input);
      } else {
        hash = await sha(algo, input);
      }
      results[algo] = uppercase ? hash.toUpperCase() : hash;
    }
    return { success: true, hashes: results as Record<HashAlgo, string> };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
