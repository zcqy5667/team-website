import { getAdminSession, type RuntimeEnv } from "../../_shared/auth";

export const onRequestGet: PagesFunction<RuntimeEnv> = async (context) => {
  const session = await getAdminSession(context);
  if (!session) return Response.json({ authenticated: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  return Response.json({ authenticated: true, username: session.username }, { headers: { "Cache-Control": "no-store" } });
};
