export function formatPrice(n: number): string {
  return `${n.toLocaleString("fa-IR")} تومان`;
}

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 13)}`;
}

export function toLatinDigits(s: string): string {
  return s
    .replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)))
    .replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c)));
}

export function parseNumber(s: string): number | null {
  const digits = toLatinDigits(s).replace(/[^\d-]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

export function toSlug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function shortId(id: string): string {
  return id.slice(-8);
}
