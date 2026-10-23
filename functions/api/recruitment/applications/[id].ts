import { requireAdmin, type RuntimeEnv } from "../../../_shared/auth";
import { jsonError, readJson } from "../../../_shared/http";

type UpdateBody = { status?: string; admin_note?: string };
const statuses = new Set(["new", "reviewing", "interview", "accepted", "rejected"]);

export const onRequestPatch: PagesFunction<RuntimeEnv> = async (context) => {
  const unauthorized = await requireAdmin(context);
  if (unauthorized) return unauthorized;
  const id = Number(context.params.id);
  if (!Number.isInteger(id) || id < 1) return jsonError("报名编号不正确");
  const body = await readJson<UpdateBody>(context.request);
  const status = body?.status?.trim() ?? "";
  const adminNote = body?.admin_note?.trim() ?? "";
  if (!statuses.has(status)) return jsonError("处理状态不正确");
  if (adminNote.length > 2000) return jsonError("备注内容过长");
  if (!context.env.DB) return jsonError("D1 binding DB 未配置", 503);
  try {
    const result = await context.env.DB.prepare("UPDATE recruitment_applications SET status = ?, admin_note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(status, adminNote, id)
      .run();
    if (!result.meta.changes) return jsonError("未找到报名记录", 404);
    const application = await context.env.DB.prepare("SELECT * FROM recruitment_applications WHERE id = ?").bind(id).first();
    return Response.json({ application }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return jsonError("报名记录更新失败", 503);
  }
};
