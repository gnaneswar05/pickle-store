"use client";

import { useToast } from "@/app/store/useStore";

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  info: "border-amber-200 bg-white text-stone-900",
  error: "border-rose-200 bg-rose-50 text-rose-950",
};

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_18px_60px_rgba(44,24,16,0.14)] backdrop-blur ${toneClasses[toast.tone || "info"]} animate-[toast-slide_.24s_ease-out]`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.message ? (
                <p className="mt-1 text-sm opacity-80">{toast.message}</p>
              ) : null}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs font-medium opacity-60 transition hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
