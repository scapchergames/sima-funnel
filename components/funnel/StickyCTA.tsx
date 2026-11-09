"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StickyCTAProps {
  children: ReactNode;
  note?: string;
  className?: string;
}

export default function StickyCTA({ children, note, className }: StickyCTAProps) {
  return (
    <div
      className={className}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(247,245,255,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        padding: "12px 20px",
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {children}
        {note && (
          <p style={{
            marginTop: 8,
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

interface CTAButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  type?: "button" | "submit";
}

export function CTAButton({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
  fullWidth = true,
  type = "button",
}: CTAButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "17px 28px",
        borderRadius: "16px",
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "0.01em",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        border: isSecondary ? "1.5px solid var(--border-mid)" : "none",
        background: isPrimary
          ? "linear-gradient(135deg, var(--brand), var(--brand-dark))"
          : isSecondary
          ? "transparent"
          : "transparent",
        color: isPrimary ? "white" : "var(--text-secondary)",
        boxShadow: isPrimary ? "0 8px 32px rgba(124,92,252,0.35)" : "none",
        transition: "opacity 0.18s",
      }}
    >
      {loading ? (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "white",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      ) : (
        children
      )}
    </motion.button>
  );
}
