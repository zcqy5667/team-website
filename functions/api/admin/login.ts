import { createSessionCookie, type RuntimeEnv } from "../../_shared/auth";
import { jsonError, readJson } from "../../_shared/http";

type LoginBody = { username?: string; password?: string };

export const onRequestPost: PagesFunction<RuntimeEnv> = async (context) => {
  const body = await readJson<LoginBody>(context.request);
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";
  const { ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET } = context.env;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SESSION_SECRET) {
    return jsonError("后台尚未配置管理员密钥，请先在 Cloudflare 设置环境变量", 503);
  }
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return jsonError("用户名或密码错误", 401);
  }

  return Response.json(
    { ok: true, username },
    { headers: { "Set-Cookie": await createSessionCookie(username, SESSION_SECRET), "Cache-Control": "no-store" } },
  );
};
