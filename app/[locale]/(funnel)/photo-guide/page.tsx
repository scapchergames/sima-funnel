"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SimalHeader from "@/components/funnel/SimalHeader";

export default function PhotoGuidePage() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", padding: "16px 20px", paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>

      <SimalHeader />

      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{ position: "absolute", top: "max(18px, env(safe-area-inset-top))", left: 20, background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "var(--text-secondary)" }}
        aria-label="Geri"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.3, color: "var(--text-primary)", marginBottom: 6, marginTop: 12 }}>
          Doğru analiz için yüz fotoğrafın nasıl olmalı?
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
          Aşağıdaki örneği takip et — 14 bölge tam analizi için net ve önden çekilmiş bir fotoğraf gerekiyor.
        </p>

        {/* CORRECT example */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            borderRadius: 18,
            background: "rgba(34,197,94,0.07)",
            border: "1.5px solid rgba(34,197,94,0.3)",
            padding: "16px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <CorrectFaceIllustration />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5l2.5 2.5L9 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#15803D" }}>Doğru</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
              {["Önden, düz bakış", "İyi aydınlatma", "Yüz çerçevede ortalanmış", "Yüz ifadesi nötr"].map(t => (
                <li key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#22C55E", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* INCORRECT examples */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
          Bunlardan kaçın
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { illustration: <AngledFaceIllustration />,   label: "Yandan bakış" },
            { illustration: <GlassesFaceIllustration />,  label: "Gözlük / engel" },
            { illustration: <BlurryFaceIllustration />,   label: "Karanlık / bulanık" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{
                borderRadius: 14,
                background: "rgba(239,68,68,0.06)",
                border: "1.5px solid rgba(239,68,68,0.2)",
                padding: "12px 8px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ position: "relative" }}>
                {item.illustration}
                <div style={{ position: "absolute", bottom: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#B91C1C", textAlign: "center", lineHeight: 1.3 }}>{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Privacy note */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", borderRadius: 12, background: "rgba(124,92,252,0.06)", border: "1px solid rgba(124,92,252,0.14)", marginBottom: 20 }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Gizliliğini ciddiye alıyoruz. Fotoğrafın yalnızca analiz için kullanılır ve analiz biter bitmez sunucularımızdan <strong>kalıcı olarak silinir</strong>.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/${locale}/scan`)}
            style={{
              width: "100%", padding: "17px 0", borderRadius: 18,
              background: "linear-gradient(135deg, #7C5CFC, #5B3FD4)",
              border: "none", fontSize: 16, fontWeight: 700, color: "white",
              cursor: "pointer", boxShadow: "0 8px 32px rgba(124,92,252,0.4)",
              letterSpacing: "0.01em",
              position: "relative", overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
              style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)", pointerEvents: "none" }}
            />
            📸 Şimdi Fotoğraf Çek
          </motion.button>

          <button
            onClick={() => router.push(`/${locale}/scan`)}
            style={{ width: "100%", padding: "14px 0", borderRadius: 16, background: "transparent", border: "1.5px solid var(--border-mid)", fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
          >
            🖼️ Galeriden Seç
          </button>
        </div>
      </motion.div>
    </main>
  );
}

/* ── SVG Illustrations ── */

function CorrectFaceIllustration() {
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      {/* Phone frame */}
      <rect x="8" y="2" width="64" height="92" rx="10" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" fill="rgba(34,197,94,0.06)" />
      {/* Camera dot */}
      <circle cx="40" cy="10" r="2.5" fill="rgba(34,197,94,0.4)" />
      {/* Face oval */}
      <ellipse cx="40" cy="52" rx="20" ry="26" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" strokeDasharray="4 2.5" />
      {/* Eyes */}
      <ellipse cx="33" cy="46" rx="4" ry="2.8" stroke="rgba(34,197,94,0.8)" strokeWidth="1.2" />
      <ellipse cx="47" cy="46" rx="4" ry="2.8" stroke="rgba(34,197,94,0.8)" strokeWidth="1.2" />
      <circle cx="33" cy="46" r="1.5" fill="rgba(34,197,94,0.7)" />
      <circle cx="47" cy="46" r="1.5" fill="rgba(34,197,94,0.7)" />
      {/* Nose */}
      <path d="M40 50 L37.5 57 Q40 59 42.5 57 Z" stroke="rgba(34,197,94,0.5)" strokeWidth="1" fill="none" />
      {/* Mouth */}
      <path d="M34 63 Q40 67 46 63" stroke="rgba(34,197,94,0.7)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Center crosshair */}
      <line x1="40" y1="26" x2="40" y2="78" stroke="rgba(34,197,94,0.25)" strokeWidth="0.7" strokeDasharray="2 3" />
      <line x1="20" y1="52" x2="60" y2="52" stroke="rgba(34,197,94,0.25)" strokeWidth="0.7" strokeDasharray="2 3" />
    </svg>
  );
}

function AngledFaceIllustration() {
  return (
    <svg width="60" height="72" viewBox="0 0 60 72" fill="none">
      <rect x="4" y="2" width="52" height="68" rx="8" stroke="rgba(239,68,68,0.4)" strokeWidth="1.2" fill="rgba(239,68,68,0.04)" />
      {/* Angled/rotated face oval */}
      <ellipse cx="32" cy="38" rx="14" ry="20" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2" transform="rotate(20 32 38)" />
      {/* Side profile eye */}
      <ellipse cx="36" cy="32" rx="3" ry="2" stroke="rgba(239,68,68,0.6)" strokeWidth="1" transform="rotate(20 36 32)" />
      <path d="M34 44 L33 50 Q35 52 37 50 Z" stroke="rgba(239,68,68,0.5)" strokeWidth="1" fill="none" transform="rotate(20 35 47)" />
    </svg>
  );
}

function GlassesFaceIllustration() {
  return (
    <svg width="60" height="72" viewBox="0 0 60 72" fill="none">
      <rect x="4" y="2" width="52" height="68" rx="8" stroke="rgba(239,68,68,0.4)" strokeWidth="1.2" fill="rgba(239,68,68,0.04)" />
      <ellipse cx="30" cy="38" rx="16" ry="22" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2" strokeDasharray="3 2" />
      {/* Sunglasses */}
      <rect x="15" y="30" width="12" height="8" rx="4" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" fill="rgba(239,68,68,0.15)" />
      <rect x="33" y="30" width="12" height="8" rx="4" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" fill="rgba(239,68,68,0.15)" />
      <line x1="27" y1="34" x2="33" y2="34" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2" />
      <line x1="12" y1="34" x2="15" y2="34" stroke="rgba(239,68,68,0.6)" strokeWidth="1" />
      <line x1="45" y1="34" x2="48" y2="34" stroke="rgba(239,68,68,0.6)" strokeWidth="1" />
      {/* Mouth */}
      <path d="M24 50 Q30 54 36 50" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BlurryFaceIllustration() {
  return (
    <svg width="60" height="72" viewBox="0 0 60 72" fill="none">
      <rect x="4" y="2" width="52" height="68" rx="8" stroke="rgba(239,68,68,0.4)" strokeWidth="1.2" fill="rgba(239,68,68,0.04)" />
      {/* Small distant face */}
      <ellipse cx="30" cy="38" rx="9" ry="12" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      {/* Blur lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={16 + i * 6} y1="20" x2={12 + i * 7} y2="56" stroke="rgba(239,68,68,0.15)" strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* Dark overlay suggestion */}
      <rect x="4" y="2" width="52" height="68" rx="8" fill="rgba(0,0,0,0.18)" />
      <text x="30" y="40" textAnchor="middle" fontSize="10" fill="rgba(239,68,68,0.7)" fontFamily="system-ui">?</text>
    </svg>
  );
}
