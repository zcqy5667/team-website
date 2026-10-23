import { getAdminSession, requireAdmin, type RuntimeEnv } from "../../../_shared/auth";
import { jsonError, readJson } from "../../../_shared/http";

type ApplicationBody = {
  name?: string;
  gender?: string;
  college?: string;
  major_class?: string;
  qq?: string;
  wechat?: string;
  email?: string;
  phone?: string;
  primary_choice?: string;
  willing_transfer?: boolean;
  bio?: string;
  honors?: string;
  roles?: string;
  technical_basis?: string;
  projects?: string;
  consent?: boolean;
};

const allowedGenders = new Set(["male", "female"]);
const allowedChoices = new Set(["机械组", "电控组", "算法组", "硬件组", "运营组"]);
const fieldLimits: Record<string, number> = {
  name: 50,
  college: 100,
  major_class: 120,
  qq: 30,
  wechat: 60,
  email: 160,
  phone: 30,
  bio: 1200,
  honors: 1200,
  roles: 1200,
  technical_basis: 1600,
  projects: 2000,
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validate(body: ApplicationBody) {
  const data = Object.fromEntries(Object.keys(fieldLimits).map((key) => [key, clean(body[key as keyof ApplicationBody])])) as Record<string, string>;
  const requiredFields = ["name", "college", "major_class", "qq", "email", "phone"];
  for (const key of requiredFields) {
    if (!data[key]) return { error: `${key} 不能为空` };
  }
  for (const [key, max] of Object.entries(fieldLimits)) {
    if (data[key].length > max) return { error: `${key} 内容过长` };
  }
  if (!allowedGenders.has(clean(body.gender))) return { error: "请选择有效性别" };
  if (!allowedChoices.has(data.primary_choice)) return { error: "请选择有效的第一志愿" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: "邮箱格式不正确" };
  if (!body.consent) return { error: "请先同意个人信息使用说明" };
  return {
    data: {
      ...data,
      gender: clean(body.gender),
      willing_transfer: body.willing_transfer ? 1 : 0,
      consent: 1,
      email: data.email.toLowerCase(),
    },
  };
}

function ensureDatabase(env: RuntimeEnv) {
  if (!env.DB) throw new Error("D1 binding DB 未配置");
  return env.DB;
}

export const onRequestPost: PagesFunction<RuntimeEnv> = async (context) => {
  const body = await readJson<ApplicationBody>(context.request);
  if (!body) return jsonError("请求数据格式不正确");
  const result = validate(body);
  if (result.error || !result.data) return jsonError(result.error ?? "报名信息不完整");
  try {
    const db = ensureDatabase(context.env);
    const data = result.data;
    await db
      .prepare(
        `INSERT INTO recruitment_applications
          (name, gender, college, major_class, qq, wechat, email, phone, primary_choice, willing_transfer, bio, honors, roles, technical_basis, projects, consent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
          name=excluded.name, gender=excluded.gender, college=excluded.college, major_class=excluded.major_class,
          qq=excluded.qq, wechat=excluded.wechat, phone=excluded.phone, primary_choice=excluded.primary_choice,
          willing_transfer=excluded.willing_transfer, bio=excluded.bio, honors=excluded.honors, roles=excluded.roles,
          technical_basis=excluded.technical_basis, projects=excluded.projects, consent=excluded.consent,
          updated_at=CURRENT_TIMESTAMP`,
      )
      .bind(
        data.name,
        data.gender,
        data.college,
        data.major_class,
        data.qq,
        data.wechat,
        data.email,
        data.phone,
        data.primary_choice,
        data.willing_transfer,
        data.bio,
        data.honors,
        data.roles,
        data.technical_basis,
        data.projects,
        data.consent,
      )
      .run();
    const application = await db.prepare("SELECT id, status, created_at, updated_at FROM recruitment_applications WHERE email = ?").bind(data.email).first();
    return Response.json({ ok: true, application });
  } catch (error) {
    console.error(error);
    return jsonError("报名暂时无法提交，请稍后重试", 503);
  }
};

export const onRequestGet: PagesFunction<RuntimeEnv> = async (context) => {
  const unauthorized = await requireAdmin(context);
  if (unauthorized) return unauthorized;
  const url = new URL(context.request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status")?.trim() ?? "";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 100) || 100, 1), 200);
  try {
    const db = ensureDatabase(context.env);
    const conditions: string[] = [];
    const params: string[] = [];
    if (query) {
      conditions.push("(name LIKE ? OR email LIKE ? OR college LIKE ? OR major_class LIKE ? OR qq LIKE ? OR phone LIKE ?)");
      params.push(...Array(6).fill(`%${query}%`));
    }
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const statement = db.prepare(`SELECT * FROM recruitment_applications ${where} ORDER BY created_at DESC LIMIT ?`).bind(...params, limit);
    const { results } = await statement.all();
    return Response.json({ applications: results ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return jsonError("报名数据暂时无法读取，请检查 D1 配置", 503);
  }
};
