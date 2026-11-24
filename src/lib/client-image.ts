function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("load failed"));
    img.src = src;
  });
}

export async function compressToDataUrl(file: File, maxDim = 1280): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unsupported");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let out = canvas.toDataURL("image/webp", 0.78);
    if (!out.startsWith("data:image/webp")) out = canvas.toDataURL("image/jpeg", 0.8);
    if (out.length > 700_000) out = canvas.toDataURL("image/jpeg", 0.6);
    return out;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
