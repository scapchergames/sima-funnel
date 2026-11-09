"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  showBack?: boolean;
  onBack?: () => void;
  label?: string;
}

export default function ProgressBar({ current, total, showBack, onBack, label }: ProgressBarProps) {
  const pct = Math.min((current / total) * 100, 100);

  return (
    <div className="flex items-center gap-3 w-full">
      {showBack && (
        <button
          onClick={onBack}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border"
          style={{ borderColor: "var(--border-mid)", color: "var(--text-secondary)", background: "transparent" }}
          aria-label="Geri"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="flex-1 flex flex-col gap-1.5">
        {label && (
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            {label} · {current}/{total}
          </p>
        )}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border-mid)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--brand), var(--brand-light))" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
