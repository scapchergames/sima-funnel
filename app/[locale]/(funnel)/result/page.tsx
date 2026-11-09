"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { TeaserResult } from "@/lib/report/types";
import { fbEvent } from "@/lib/analytics/pixel";
import { storageGet } from "@/lib/storage";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [teaser, setTeaser] = useState<TeaserResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = storageGet("sima_teaser");
      const img = storageGet("sima_image_url");
      if (raw) {
        setTeaser(JSON.parse(raw) as TeaserResult);
        fbEvent("ViewContent", { content_name: "TeaserResult", content_category: "Funnel" });
      }
      if (img) setImageUrl(img);
    } catch {}
  }, []);

  if (!teaser) {
    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid var(--border-mid)",
          borderTopColor: "var(--brand)",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Yükleniyor…</p>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", padding: "32px 20px 160px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 440, margin: "0 auto" }}
      >
        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(124,92,252,0.12)",
          border: "1px solid rgba(124,92,252,0.3)",
          borderRadius: 999,
          padding: "5px 12px",
          marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", display: "inline-block", boxShadow: "0 0 6px var(--brand)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-light)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Analiz Tamamlandı
          </span>
        </div>

        {/* Hero card */}
        <div style={{
          borderRadius: 24,
          background: "linear-gradient(135deg, rgba(124,92,252,0.15) 0%, rgba(91,63,212,0.08) 100%)",
          border: "1.5px solid rgba(124,92,252,0.2)",
          padding: "24px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,92,252,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            {imageUrl ? (
              <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(124,92,252,0.4)", flexShrink: 0 }}>
                <img src={imageUrl} alt="Yüzün" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(124,92,252,0.15)", border: "2px solid rgba(124,92,252,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 28 }}>
                👤
              </div>
            )}

            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Yüz Tipin
              </p>
              <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--text-primary)" }}>
                {teaser.archetype}
              </h1>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />

          <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)" }}>
            {teaser.archetypeSummary}
          </p>
        </div>

        {/* Open region */}
        {teaser.openRegion && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              borderRadius: 20,
              border: "1.5px solid var(--border-mid)",
              background: "rgba(124,92,252,0.04)",
              padding: "18px 20px",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(124,92,252,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13 }}>◎</span>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--brand-light)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Alın Analizi — Ücretsiz Önizleme
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginTop: 1 }}>
                  {teaser.openRegion.region}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text-primary)" }}>Gözlem:</strong> {teaser.openRegion.observation}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 6 }}>
              <strong style={{ color: "var(--text-primary)" }}>Yorum:</strong> {teaser.openRegion.reading}
            </p>
          </motion.div>
        )}

        {/* Locked sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {teaser.lockedSections.map((section, i) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              style={{
                borderRadius: 16,
                border: "1.5px solid var(--border)",
                background: "rgba(124,92,252,0.03)",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                filter: "blur(0.3px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11 }}>🔒</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>{section}</span>
              </div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--brand-light)",
                background: "rgba(124,92,252,0.1)",
                padding: "3px 8px",
                borderRadius: 999,
              }}>
                KİLİTLİ
              </div>
            </motion.div>
          ))}
        </div>

        <p style={{
          fontSize: 11,
          color: "var(--text-muted)",
          textAlign: "center",
          lineHeight: 1.6,
          maxWidth: 320,
          margin: "0 auto 32px",
        }}>
          Simaloji eğlence ve keşif amaçlıdır; bilimsel veya psikolojik değerlendirme değildir.
        </p>
      </motion.div>

      {/* Sticky CTA */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 20px",
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        background: "rgba(247,245,255,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/${locale}/paywall`)}
            style={{
              width: "100%",
              padding: "17px 0",
              borderRadius: 16,
              background: "linear-gradient(135deg, #7C5CFC, #5B3FD4)",
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(124,92,252,0.4)",
              letterSpacing: "0.01em",
              marginBottom: 8,
            }}
          >
            Tam Raporumu Aç ✦
          </motion.button>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
            Binlerce bölgeyi açıkla · İptal istediğinde
          </p>
        </div>
      </div>
    </main>
  );
}
