export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  instituteName?: string;
  iat?: number;
  exp?: number;
}

export const AUTH_COOKIE_NAME = "authToken";

function base64UrlEncode(input: string | Uint8Array): string {
  let base64 = "";
  if (typeof input === "string") {
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(input, "utf-8").toString("base64");
    } else {
      base64 = btoa(unescape(encodeURIComponent(input)));
    }
  } else {
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(input).toString("base64");
    } else {
      let binary = "";
      for (let i = 0; i < input.byteLength; i++) {
        binary += String.fromCharCode(input[i]);
      }
      base64 = btoa(binary);
    }
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  } else {
    return decodeURIComponent(escape(atob(base64)));
  }
}

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }

  return secret;
}

async function getCryptoKey(
  secret: string,
  usage: "sign" | "verify",
): Promise<CryptoKey> {
  const enc = new TextEncoder();

  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

export async function signJWT(
  payload: Omit<JWTPayload, "iat" | "exp">,
  expiresInSeconds: number = 7 * 24 * 60 * 60,
): Promise<string> {
  const secret = getJWTSecret();

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getCryptoKey(secret, "sign");

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(dataToSign),
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signature));

  return `${dataToSign}.${encodedSignature}`;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const secret = getJWTSecret();
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    const key = await getCryptoKey(secret, "verify");

    const sigBase64 = encodedSignature.replace(/-/g, "+").replace(/_/g, "/");
    let paddedSig = sigBase64;
    while (paddedSig.length % 4) paddedSig += "=";

    let rawSig: Uint8Array;
    if (typeof Buffer !== "undefined") {
      rawSig = new Uint8Array(Buffer.from(paddedSig, "base64"));
    } else {
      const binary = atob(paddedSig);
      rawSig = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        rawSig[i] = binary.charCodeAt(i);
      }
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      rawSig as BufferSource,
      new TextEncoder().encode(dataToVerify),
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload: JWTPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export const AUTH_COOKIE_OPTIONS = {
  name: AUTH_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
