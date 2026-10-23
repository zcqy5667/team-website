import { requireAdmin, type RuntimeEnv } from "../../../_shared/auth";
import { csvCell, jsonError } from "../../../_shared/http";

export const onRequestGet: PagesFunction<RuntimeEnv> = async (context) => {
  const unauthorized = await requireAdmin(context);
  if (unauthorized) return unauthorized;
  if (!context.env.DB) return jsonError("D1 binding DB 未配置", 503);
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM recruitment_applications ORDER BY created_at DESC").all();
    const columns = ["id", "name", "gender", "college", "major_class", "qq", "wechat", "email", "phone", "primary_choice", "willing_transfer", "bio", "honors", "roles", "technical_basis", "projects", "status", "admin_note", "created_at", "updated_at"];
    const rows = [columns, ...(results ?? []).map((item) => columns.map((column) => (item as Record<string, unknown>)[column]))];
    const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="recruitment-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return jsonError("导出失败", 503);
  }
};
