import { clearSessionCookie, type RuntimeEnv } from "../../_shared/auth";

export const onRequestPost: PagesFunction<RuntimeEnv> = async () =>
  Response.json({ ok: true }, { headers: { "Set-Cookie": clearSessionCookie() } });
