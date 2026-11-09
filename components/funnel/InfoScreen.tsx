"use client";

import { motion } from "framer-motion";

interface InfoScreenProps {
  title: string;
  body: string;
  stat?: string;
  statLabel?: string;
  illustration?: "face_map" | "social" | "none";
  ctaLabel?: string;
  onCta: () => void;
}

export default function InfoScreen({ title, body, stat, statLabel, illustration = "none", ctaLabel = "Anladım, Devam", onCta }: InfoScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      style={{ padding: "24px 20px 120px", maxWidth: 480, margin: "0 auto" }}
    >
      {illustration === "face_map" && (
        <div style={{
          width: "100%",
          aspectRatio: "1",
          maxWidth: 220,
          margin: "0 auto 28px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(124,92,252,0.15) 0%, transparent 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <svg viewBox="0 0 200 200" width="160" height="160" fill="none">
            <ellipse cx="100" cy="100" rx="70" ry="85" stroke="rgba(124,92,252,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="78" cy="85" r="8" stroke="rgba(169,139,255,0.6)" strokeWidth="1.5" />
            <circle cx="122" cy="85" r="8" stroke="rgba(169,139,255,0.6)" strokeWidth="1.5" />
            <path d="M85 115 Q100 125 115 115" stroke="rgba(169,139,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="100" y1="55" x2="100" y2="75" stroke="rgba(124,92,252,0.4)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="60" y1="100" x2="140" y2="100" stroke="rgba(124,92,252,0.3)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="100" cy="100" r="3" fill="var(--brand)" />
            {[55, 70, 85, 100, 115, 130, 145].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 100 + 65 * Math.cos(rad);
              const y = 100 + 80 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(124,92,252,0.5)" />;
            })}
          </svg>
        </div>
      )}

      {illustration === "social" && (
        <div style={{
          fontSize: 56,
          textAlign: "center",
          marginBottom: 24,
        }}>
          🌟
        </div>
      )}

      {stat && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{
            display: "inline-block",
            fontSize: 40,
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--brand-light), var(--brand))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {stat}
          </span>
          {statLabel && (
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              {statLabel}
            </p>
          )}
        </div>
      )}

      <h2 style={{
        fontSize: 24,
        fontWeight: 800,
        color: "var(--text-primary)",
        lineHeight: 1.25,
        letterSpacing: "-0.02em",
        marginBottom: 14,
        textAlign: "center",
      }}>
        {title}
      </h2>

      <p style={{
        fontSize: 15,
        color: "var(--text-secondary)",
        lineHeight: 1.7,
        textAlign: "center",
      }}>
        {body}
      </p>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px", paddingBottom: "max(20px, env(safe-area-inset-bottom))", background: "rgba(247,245,255,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <button
            onClick={onCta}
            style={{
              width: "100%",
              padding: "17px 0",
              borderRadius: 16,
              background: "linear-gradient(135deg, var(--brand), var(--brand-dark))",
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(124,92,252,0.35)",
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
