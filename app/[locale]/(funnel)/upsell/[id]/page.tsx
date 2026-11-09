"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fbEvent } from "@/lib/analytics/pixel";
import pricingConfig from "@/funnel-config/pricing.json";

type UpsellId = "compatibility_report" | "pdf_report";
type PricingLocale = keyof typeof pricingConfig;

interface UpsellContent {
  icon: string;
  headline: string;
  subheadline: string;
  features: string[];
  badge?: string;
}

const UPSELL_CONTENT: Record<UpsellId, UpsellContent> = {
  compatibility_report: {
    icon: "💞",
    headline: "Partner veya arkadaşınla yüz uyumunu keşfet",
    subheadline: "Fotoğrafını ve partnerin fotoğrafını karşılaştır — hangi bölgeler uyum gösteriyor, hangileri sürtüşme yaratıyor?",
    badge: "En Çok Satan",
    features: [
      "14 bölge birebir karşılaştırması",
      "İlişki dinamikleri ve uyum skoru",
      "Kariyer ve iş birliği potansiyeli",
      "Farklılıklar nasıl güce dönüştürülür?",
    ],
  },
  pdf_report: {
    icon: "📄",
    headline: "Detaylı raporunu indir, istediğin zaman oku",
    subheadline: "30+ sayfalık premium PDF raporunu cihazına indir. Offline oku, arkadaşlarınla paylaş.",
    features: [
      "30+ sayfa tam analiz, bölüm bölüm",
      "Paylaşılabilir şık tasarım",
      "Instagram story boyutunda özet kart",
      "Reklamsız, kişisel arşiv için",
    ],
  },
};

const UPSELL_SEQUENCE: Record<UpsellId, string> = {
  compatibility_report: "pdf_report",
  pdf_report: "done",
};

export default function UpsellPage() {
  const { locale, id } = useParams() as { locale: string; id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const upsellId = id as UpsellId;
  const content = UPSELL_CONTENT[upsellId];
  const pricingLocale: PricingLocale = locale === "tr" ? "tr" : "en";
  const pricing = pricingConfig[pricingLocale];
  const upsellItem = pricing.upsells.find((u) => u.id === upsellId);

  const nextRoute = UPSELL_SEQUENCE[upsellId];
  const getNext = () =>
    nextRoute === "done" ? `/${locale}/welcome` : `/${locale}/upsell/${nextRoute}`;

  if (!content || !upsellItem) {
    router.replace(`/${locale}/welcome`);
    return null;
  }

  const sym = pricing.currencySymbol;
  const item = upsellItem!;

  async function handleAccept() {
    setLoading(true);
    fbEvent("Purchase", {
      value: item.price,
      currency: pricing.currency,
      content_name: item.name,
      content_category: "Upsell",
    });
    await new Promise((r) => setTimeout(r, 900));
    setAccepted(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push(getNext());
  }

  function handleSkip() {
    router.push(getNext());
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px 56px",
      }}
    >
      <div style={{ maxWidth: 440, width: "100%" }}>
        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 12,
            background: "rgba(124,92,252,0.08)",
            border: "1px solid rgba(124,92,252,0.2)",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 16 }}>✓</span>
          <span style={{ fontSize: 13, color: "var(--brand-light)", fontWeight: 600 }}>
            Ödeme başarılı! Raporun hazırlanıyor.
          </span>
        </motion.div>

        {/* Upsell card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            borderRadius: 24,
            border: "1.5px solid rgba(124,92,252,0.25)",
            background: "rgba(124,92,252,0.05)",
            padding: "24px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(124,92,252,0.08), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {content.badge && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(245,200,66,0.12)",
                border: "1px solid rgba(245,200,66,0.3)",
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--gold)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              ★ {content.badge}
            </div>
          )}

          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
              lineHeight: 1,
            }}
          >
            {content.icon}
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              marginBottom: 10,
              color: "var(--text-primary)",
            }}
          >
            {content.headline}
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              marginBottom: 20,
            }}
          >
            {content.subheadline}
          </p>

          {/* Features */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 24px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {content.features.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  style={{
                    color: "var(--brand)",
                    fontSize: 14,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>

          <div
            style={{
              height: 1,
              background: "var(--border)",
              marginBottom: 20,
            }}
          />

          {/* Price + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 2,
                }}
              >
                Tek Seferlik
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {sym}{item.price}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAccept}
              disabled={loading || accepted}
              style={{
                padding: "16px 24px",
                borderRadius: 16,
                background: accepted
                  ? "rgba(124,92,252,0.4)"
                  : "linear-gradient(135deg, #7C5CFC, #5B3FD4)",
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                cursor: loading || accepted ? "wait" : "pointer",
                boxShadow: accepted ? "none" : "0 6px 24px rgba(124,92,252,0.4)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : accepted ? (
                "✓ Eklendi!"
              ) : (
                "Evet, İstiyorum"
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Skip */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleSkip}
          style={{
            width: "100%",
            padding: "14px 0",
            background: "transparent",
            border: "none",
            fontSize: 14,
            color: "var(--text-muted)",
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "rgba(28,21,53,0.2)",
          }}
        >
          Hayır, teşekkürler
        </motion.button>
      </div>
    </main>
  );
}
