"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { getOrCreateSession, patchSession } from "@/lib/session/store";
import { getExperimentVariants } from "@/lib/experiments";
import SimalHeader from "@/components/funnel/SimalHeader";

type Angle = "karakter" | "uyum" | "kariyer" | "takip";

const ANGLE_TO_I18N: Record<string, string> = {
  karakter: "character",
  uyum: "love",
  kariyer: "career",
  takip: "tracking",
};

const FLOATING_TAGS = [
  { label: "Alın",  sub: "Öngörü & Zekâ",     icon: "◈", side: "left"  as const, top: "18%" },
  { label: "Göz",   sub: "Derinlik & Sezgi",   icon: "◉", side: "right" as const, top: "14%" },
  { label: "Çene",  sub: "İrade & Kararlılık",  icon: "◆", side: "left"  as const, top: "66%" },
  { label: "Burun", sub: "Denge & Güç",         icon: "▽", side: "right" as const, top: "62%" },
];

const LANDMARKS = [
  [130,48],[130,72],[130,92],
  [98,108],[162,108],
  [106,112],[154,112],
  [130,132],[130,140],
  [120,155],[140,155],
  [130,164],[130,175],
  [106,165],[154,165],
  [88,150],[172,150],
  [80,130],[180,130],
  [84,112],[176,112],
];

export default function StartPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("prelanding");

  const locale = params.locale as string;
  const angle = params.angle as Angle;
  const i18nKey = ANGLE_TO_I18N[angle] ?? "character";
  const sessionRef = useRef(false);

  useEffect(() => {
    if (sessionRef.current) return;
    sessionRef.current = true;
    getOrCreateSession({
      locale, angle,
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      utmContent: searchParams.get("utm_content") ?? undefined,
      fbclid: searchParams.get("fbclid") ?? undefined,
    }).then((session) => {
      const variants = getExperimentVariants();
      if (Object.keys(variants).length > 0) {
        return patchSession(session.id, { experimentVariants: variants });
      }
    }).catch(console.error);
  }, []);

  return (
    <main style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      background: `
        radial-gradient(ellipse at 15% 10%, rgba(124,92,252,0.16) 0%, transparent 50%),
        radial-gradient(ellipse at 85% 15%, rgba(169,139,255,0.12) 0%, transparent 42%),
        radial-gradient(ellipse at 70% 88%, rgba(91,63,212,0.1) 0%, transparent 45%),
        #EDE9FF
      `,
      position: "relative",
      overflow: "hidden",
      paddingTop: "max(16px, env(safe-area-inset-top, 0px))",
      paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))",
    }}>

      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(124,92,252,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,92,252,0.045) 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }} />

      {/* Animated orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-8%", right: "-12%",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(124,92,252,0.22) 0%, transparent 68%)",
          filter: "blur(10px)", pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", bottom: "22%", left: "-10%",
          width: 190, height: 190, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(169,139,255,0.2) 0%, transparent 68%)",
          filter: "blur(12px)", pointerEvents: "none",
        }}
      />

      {/* ── TOP BAR ── */}
      <div style={{ padding: "0 20px 0", zIndex: 10, position: "relative" }}>
        <SimalHeader />
      </div>

      {/* ── SOCIAL PROOF ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ display: "flex", gap: 8, padding: "10px 20px 0", zIndex: 10 }}
      >
        {[
          { icon: "⭐", bold: "4.8 Memnuniyet", sub: "50K+ Değerlendirme" },
          { icon: "✦", bold: "%93 İsabetli",    sub: "Kullanıcı Doğrulaması" },
        ].map((b) => (
          <div key={b.bold} style={{
            flex: 1,
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(124,92,252,0.14)",
            borderRadius: 10,
            padding: "7px 10px",
            boxShadow: "0 2px 10px rgba(124,92,252,0.08)",
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1C1535", margin: 0, lineHeight: 1.2 }}>{b.bold}</p>
              <p style={{ fontSize: 9.5, color: "rgba(28,21,53,0.5)", margin: 0, lineHeight: 1.3 }}>{b.sub}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── HERO FACE ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>

          {/* Floating tags */}
          {FLOATING_TAGS.map((tag, i) => (
            <motion.div
              key={tag.label}
              initial={{ opacity: 0, x: tag.side === "left" ? -18 : 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.14, duration: 0.5, type: "spring", stiffness: 180 }}
              style={{
                position: "absolute",
                top: tag.top,
                ...(tag.side === "left" ? { left: 0 } : { right: 0 }),
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1.5px solid rgba(124,92,252,0.18)",
                borderRadius: 12,
                padding: "7px 11px",
                zIndex: 10,
                transform: `rotate(${tag.side === "left" ? -3 : 3}deg)`,
                boxShadow: "0 6px 24px rgba(124,92,252,0.14), 0 1px 4px rgba(124,92,252,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#7C5CFC" }}>{tag.icon}</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#1C1535", margin: 0, lineHeight: 1.2 }}>{tag.label}</p>
                  <p style={{ fontSize: 9.5, color: "rgba(124,92,252,0.75)", margin: 0, lineHeight: 1.3, fontWeight: 500 }}>{tag.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <HeroFace landmarks={LANDMARKS} />
          </motion.div>
        </div>
      </div>

      {/* ── BOTTOM CONTENT ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ padding: "0 20px", zIndex: 10, position: "relative" }}
      >
        {/* Two-line headline — Aura style */}
        <h1 style={{ margin: "0 0 10px", lineHeight: 1.18, letterSpacing: "-0.025em" }}>
          <span style={{ display: "block", fontSize: 26, fontWeight: 700, color: "#7C5CFC" }}>
            {t(`${i18nKey}.headline`)}
          </span>
          <span style={{ display: "block", fontSize: 30, fontWeight: 800, color: "#1C1535" }}>
            Yüz Analiziyle
          </span>
        </h1>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 7, marginBottom: 22, flexWrap: "wrap" }}>
          {[
            { icon: "⏱", label: "2 Dakika" },
            { icon: "◎", label: "14 Bölge" },
            { icon: "📋", label: "Kişisel Rapor" },
          ].map((p) => (
            <div key={p.label} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(124,92,252,0.16)",
              borderRadius: 999, padding: "5px 11px",
              boxShadow: "0 1px 6px rgba(124,92,252,0.07)",
            }}>
              <span style={{ fontSize: 11 }}>{p.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#1C1535", letterSpacing: "0.01em" }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/${locale}/quiz/0`)}
          style={{
            width: "100%",
            padding: "17px 0",
            borderRadius: 18,
            background: "linear-gradient(135deg, #7C5CFC 0%, #5B3FD4 100%)",
            border: "none",
            fontSize: 17,
            fontWeight: 700,
            color: "white",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(124,92,252,0.42)",
            letterSpacing: "0.01em",
            marginBottom: 12,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            style={{
              position: "absolute", top: 0, bottom: 0, width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              pointerEvents: "none",
            }}
          />
          {t(`${i18nKey}.cta`)}
        </motion.button>

        {/* Legal / trust */}
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(28,21,53,0.42)", lineHeight: 1.55 }}>
          Yukarıdaki seçeneği seçerek{" "}
          <span style={{ textDecoration: "underline" }}>Gizlilik Politikası</span>'nı kabul etmiş olursunuz.
          <br />
          🔒 Fotoğrafın analizden sonra silinir · Eğlence amaçlıdır
        </p>
      </motion.div>
    </main>
  );
}

function HeroFace({ landmarks }: { landmarks: number[][] }) {
  return (
    <div style={{ position: "relative", width: 240, height: 268 }}>
      {/* Glow */}
      <div style={{
        position: "absolute", inset: -40, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(124,92,252,0.2) 0%, rgba(169,139,255,0.08) 42%, transparent 68%)",
        filter: "blur(8px)", pointerEvents: "none",
      }} />

      {/* Pulsing rings */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ scale: 0.85, opacity: 0.4 }}
          animate={{ scale: 1.65, opacity: 0 }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1px solid rgba(124,92,252,0.38)", pointerEvents: "none",
          }}
        />
      ))}

      {/* Scan line */}
      <motion.div
        animate={{ top: ["5%", "90%", "5%"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
        style={{
          position: "absolute", left: "10%", right: "10%", height: 1.5,
          background: "linear-gradient(90deg, transparent, rgba(124,92,252,0.5), rgba(124,92,252,0.9), rgba(124,92,252,0.5), transparent)",
          boxShadow: "0 0 10px rgba(124,92,252,0.4)", borderRadius: 1,
          pointerEvents: "none", zIndex: 5,
        }}
      />

      <svg viewBox="0 0 240 268" width="240" height="268" fill="none" style={{ position: "relative", zIndex: 2 }}>
        <ellipse cx="120" cy="132" rx="84" ry="100" stroke="rgba(124,92,252,0.42)" strokeWidth="1.5" strokeDasharray="5 3.5" />
        <ellipse cx="120" cy="132" rx="66" ry="80"  stroke="rgba(124,92,252,0.1)"  strokeWidth="1" />

        <line x1="120" y1="32"  x2="120" y2="232" stroke="rgba(124,92,252,0.07)" strokeWidth="0.8" strokeDasharray="3 4" />
        <line x1="36"  y1="132" x2="204" y2="132" stroke="rgba(124,92,252,0.07)" strokeWidth="0.8" strokeDasharray="3 4" />

        <path d="M78 76 Q120 56 162 76" stroke="rgba(124,92,252,0.2)" strokeWidth="1" fill="none" />

        <ellipse cx="98"  cy="108" rx="11" ry="7.5" stroke="rgba(124,92,252,0.65)" strokeWidth="1.5" />
        <ellipse cx="142" cy="108" rx="11" ry="7.5" stroke="rgba(124,92,252,0.65)" strokeWidth="1.5" />
        <circle  cx="98"  cy="108" r="3.5" fill="rgba(124,92,252,0.6)" />
        <circle  cx="142" cy="108" r="3.5" fill="rgba(124,92,252,0.6)" />
        <circle  cx="99.5"  cy="106.5" r="1.2" fill="rgba(255,255,255,0.7)" />
        <circle  cx="143.5" cy="106.5" r="1.2" fill="rgba(255,255,255,0.7)" />

        <path d="M86 98  Q98  93 110 98"  stroke="rgba(124,92,252,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M130 98 Q142 93 154 98"  stroke="rgba(124,92,252,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        <path d="M120 114 L113 134 Q120 139 127 134 Z" stroke="rgba(124,92,252,0.33)" strokeWidth="1.2" fill="none" />

        <path d="M105 152 Q120 163 135 152" stroke="rgba(124,92,252,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        <path d="M70 152 Q78 186 120 196 Q162 186 170 152" stroke="rgba(124,92,252,0.28)" strokeWidth="1.2" fill="none" />

        <text x="126" y="48"  fill="rgba(124,92,252,0.4)" fontSize="7.5" fontFamily="system-ui" letterSpacing="0.08em">ALIN</text>
        <text x="57"  y="110" fill="rgba(124,92,252,0.4)" fontSize="7.5" fontFamily="system-ui" letterSpacing="0.06em">GÖZ</text>
        <text x="128" y="141" fill="rgba(124,92,252,0.38)" fontSize="7.5" fontFamily="system-ui" letterSpacing="0.06em">BURUN</text>
        <text x="57"  y="172" fill="rgba(124,92,252,0.38)" fontSize="7.5" fontFamily="system-ui" letterSpacing="0.06em">ÇENE</text>

        {landmarks.map(([x, y], i) => (
          <motion.circle
            key={i} cx={x} cy={y} r="2.2"
            fill="rgba(124,92,252,0.72)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.8], scale: [0, 1.2, 1] }}
            transition={{ delay: 0.3 + i * 0.045, duration: 0.4 }}
          />
        ))}
      </svg>

      {/* Corner brackets */}
      {[0, 1, 2, 3].map((corner) => {
        const isTop  = corner < 2;
        const isLeft = corner === 0 || corner === 3;
        return (
          <div key={corner} style={{
            position: "absolute",
            ...(isTop  ? { top: 6 }    : { bottom: 6 }),
            ...(isLeft ? { left: 6 }   : { right: 6 }),
            width: 14, height: 14,
            borderColor: "rgba(124,92,252,0.42)", borderStyle: "solid",
            borderTopWidth:    isTop    ? 1.5 : 0,
            borderBottomWidth: !isTop   ? 1.5 : 0,
            borderLeftWidth:   isLeft   ? 1.5 : 0,
            borderRightWidth:  !isLeft  ? 1.5 : 0,
          }} />
        );
      })}
    </div>
  );
}
