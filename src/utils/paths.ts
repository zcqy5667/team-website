// 将内容数据中的资源路径转换为适用于部署环境的 URL。
// 数据文件使用根路径；这里会在渲染时自动补上 Astro 的 BASE_URL。
export function withBase(path: string) {
  const base = import.meta.env.BASE_URL;

  if (!path) return path;
  // 外部链接和纯锚点链接已经具备完整的 URL 语义，不需要再处理。
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  if (path.startsWith("#")) return `${base}${path}`;
  if (path.startsWith("/#")) return `${base}${path.slice(1)}`;
  if (path.startsWith("/")) return `${base}${path.slice(1)}`;

  return `${base}${path}`;
}
