"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type Toast = {
  id: string;
  title: string;
  message?: string;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, "id"> & { durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeouts = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timeouts.current[id];
    if (handle) window.clearTimeout(handle);
    delete timeouts.current[id];
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id"> & { durationMs?: number }) => {
      const id = uid();
      const durationMs = t.durationMs ?? 2200;
      const next: Toast = { id, title: t.title, message: t.message };
      setToasts((prev) => [next, ...prev].slice(0, 3));
      timeouts.current[id] = window.setTimeout(() => remove(id), durationMs);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-60 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-2xl border border-white/10 bg-ink p-4 shadow-card"
            role="status"
            aria-live="polite"
          >
            <div className="text-sm font-extrabold text-white">{t.title}</div>
            {t.message ? (
              <div className="mt-1 text-xs text-white/65">{t.message}</div>
            ) : null}
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="mt-3 text-xs text-white/55 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
