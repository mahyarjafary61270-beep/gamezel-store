export const MAX_IMAGE_BYTES = 500_000;

const DATA_URL_RE = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/;

export function parseDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } | null {
  const m = DATA_URL_RE.exec(dataUrl.trim());
  if (!m) return null;
  let binary: string;
  try {
    binary = atob(m[2]);
  } catch {
    return null;
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { mime: m[1], bytes };
}

export function toBytes(value: unknown): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  throw new Error("نوع داده تصویر نامعتبر است");
}
