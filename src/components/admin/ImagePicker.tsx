"use client";

import { useRef, useState } from "react";
import { deleteImageAction } from "@/lib/admin-actions";
import { compressToDataUrl } from "@/lib/client-image";

export default function ImagePicker({ existing }: { existing?: { id: string; alt: string }[] }) {
  const [dataUrls, setDataUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const next: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        window.alert("حجم هر تصویر باید کمتر از ۵ مگابایت باشد.");
        continue;
      }
      try {
        next.push(await compressToDataUrl(file));
      } catch {
        window.alert("یکی از تصاویر قابل پردازش نبود.");
      }
    }
    setDataUrls((prev) => [...prev, ...next]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="field-label">تصاویر</span>
      <div className="flex flex-wrap gap-3">
        {existing?.map((img) => (
          <div key={img.id} className="relative h-24 w-36 overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/images/${img.id}`} alt={img.alt} className="h-full w-full object-cover" />
            <form action={deleteImageAction} className="absolute left-1.5 top-1.5">
              <input type="hidden" name="id" value={img.id} />
              <button
                type="submit"
                title="حذف تصویر"
                className="grid h-6 w-6 place-items-center rounded-lg bg-black/70 text-sm font-bold text-rose-300 transition-colors hover:bg-black"
              >
                ×
              </button>
            </form>
          </div>
        ))}
        {dataUrls.map((url, i) => (
          <div key={i} className="relative h-24 w-36 overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <input type="hidden" name="images" value={url} />
            <button
              type="button"
              onClick={() => setDataUrls((prev) => prev.filter((_, j) => j !== i))}
              className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-lg bg-black/70 text-sm font-bold text-rose-300 transition-colors hover:bg-black"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="grid h-24 w-36 place-items-center rounded-xl border border-dashed border-white/20 text-sm text-slate-400 transition-colors hover:border-emerald-300/40 hover:text-teal-200"
        >
          {busy ? "در حال پردازش..." : "+ افزودن تصویر"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-1.5 text-[11px] text-slate-500">حداکثر ۵ مگابایت — تصاویر به صورت خودکار فشرده می‌شوند.</p>
    </div>
  );
}
