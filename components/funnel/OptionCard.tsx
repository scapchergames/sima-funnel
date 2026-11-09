"use client";

import { motion } from "framer-motion";
import { hapticTap } from "@/lib/haptic";

interface OptionCardProps {
  id: string;
  label: string;
  icon?: string;
  selected?: boolean;
  onClick: (id: string) => void;
  disabled?: boolean;
  variant?: "default" | "compact";
}

export default function OptionCard({ id, label, icon, selected, onClick, disabled, variant = "default" }: OptionCardProps) {
  const isCompact = variant === "compact";

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={() => { if (!disabled) { hapticTap(); onClick(id); } }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: isCompact ? 12 : 16,
        padding: isCompact ? "14px 16px" : "16px 20px",
        borderRadius: "18px",
        border: selected
          ? "2px solid var(--brand)"
          : "1.5px solid var(--border-mid)",
        background: selected
          ? "rgba(124,92,252,0.12)"
          : "rgba(124,92,252,0.03)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "border-color 0.18s, background 0.18s",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {selected && (
        <motion.div
          layoutId="card-glow"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(124,92,252,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {icon && (
        <span
          style={{
            width: isCompact ? 36 : 44,
            height: isCompact ? 36 : 44,
            borderRadius: "12px",
            background: selected ? "rgba(124,92,252,0.15)" : "rgba(124,92,252,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isCompact ? 18 : 22,
            flexShrink: 0,
            transition: "background 0.18s",
          }}
        >
          {icon}
        </span>
      )}

      <span
        style={{
          flex: 1,
          fontSize: isCompact ? 15 : 16,
          fontWeight: 500,
          color: selected ? "var(--text-primary)" : "var(--text-secondary)",
          lineHeight: 1.4,
          transition: "color 0.18s",
        }}
      >
        {label}
      </span>

      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: selected ? "none" : "1.5px solid var(--border-mid)",
          background: selected ? "var(--brand)" : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.18s, border 0.18s",
        }}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </motion.button>
  );
}
