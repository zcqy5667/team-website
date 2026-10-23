export type RuntimeEnv = {
  DB?: D1Database;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
};

type RequestContext = { request: Request; env: RuntimeEnv };

const SESSION_COOKIE = "recruit_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

function base64UrlEncode(value: string | ArrayBuffer) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return base64UrlEncode(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

function getCookie(request: Request, name: string) {
  const cookies = request.headers.get("Cookie")?.split(";") ?? [];
  const item = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return item ? decodeURIComponent(item.trim().slice(name.length + 1)) : null;
}

export async function createSessionCookie(username: string, secret: string) {
  const payload = base64UrlEncode(JSON.stringify({ username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE }));
  const signature = await sign(payload, secret);
  return `${SESSION_COOKIE}=${encodeURIComponent(`${payload}.${signature}`)}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export async function getAdminSession(context: RequestContext) {
  const secret = context.env.SESSION_SECRET;
  if (!secret) return null;
  const value = getCookie(context.request, SESSION_COOKIE);
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  try {
    if (!(await sign(payload, secret)).localeCompare(signature)) {
      const data = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as { username?: string; exp?: number };
      if (data.username && data.exp && data.exp > Math.floor(Date.now() / 1000)) return data;
    }
  } catch {
    return null;
  }
  return null;
}

export async function requireAdmin(context: RequestContext) {
  const session = await getAdminSession(context);
  if (session) return null;
  return Response.json({ error: "需要管理员登录" }, { status: 401 });
}

export { SESSION_COOKIE };
