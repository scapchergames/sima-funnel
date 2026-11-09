"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { FullAnalysis } from "@/lib/report/types";
import { storageGet, storageSet } from "@/lib/storage";

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 20,
        border: "1.5px solid var(--border)",
        background: "rgba(255,255,255,0.01)",
        padding: "20px",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(124,92,252,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      background: "rgba(124,92,252,0.1)",
      border: "1px solid rgba(124,92,252,0.2)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--brand-light)",
      margin: "3px 4px 3px 0",
    }}>
      {children}
    </span>
  );
}

function BulletList({ items, color = "var(--text-secondary)" }: { items: string[]; color?: string }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ color: "var(--brand)", fontSize: 14, flexShrink: 0, marginTop: 1 }}>◈</span>
          <span style={{ fontSize: 14, color, lineHeight: 1.6 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ReportPage() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();

  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = storageGet("sima_session_id");
    const paid = storageGet("sima_paid");
    const img = storageGet("sima_image_url");

    if (img) setImageUrl(img);

    if (!sessionId || !paid) {
      router.replace(`/${locale}/paywall`);
      return;
    }

    fetch(`/api/report?sessionId=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 402) {
            router.replace(`/${locale}/paywall`);
            return;
          }
          throw new Error("Rapor yüklenemedi");
        }
        const data = (await res.json()) as { analysis: FullAnalysis };
        setAnalysis(data.analysis);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Hata oluştu"))
      .finally(() => setLoading(false));
  }, [locale, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border-mid)", borderTopColor: "var(--brand)", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Rapor yükleniyor…</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, flexDirection: "column", gap: 16 }}>
        <p style={{ color: "#FF6B6B", fontSize: 15, textAlign: "center" }}>⚠️ {error ?? "Rapor bulunamadı."}</p>
        <button onClick={() => router.back()} style={{ padding: "12px 24px", borderRadius: 12, background: "var(--brand)", border: "none", color: "white", fontWeight: 700, cursor: "pointer" }}>
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", padding: "32px 20px 80px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(124,92,252,0.15), rgba(91,63,212,0.08))",
            border: "1.5px solid rgba(124,92,252,0.2)",
            padding: "24px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,92,252,0.1), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            {imageUrl ? (
              <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(124,92,252,0.4)", flexShrink: 0 }}>
                <img src={imageUrl} alt="Yüzün" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(124,92,252,0.15)", border: "2px solid rgba(124,92,252,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 32 }}>👤</div>
            )}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Yüz Tipin
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--text-primary)" }}>
                {analysis.temperament.dominant}
              </h1>
              <p style={{ fontSize: 12, color: "var(--brand-light)", marginTop: 4 }}>
                {analysis.faceShape}
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)" }}>
            {analysis.temperament.summary}
          </p>

          {analysis.highlights.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap" }}>
              {analysis.highlights.map((h) => <Tag key={h}>{h}</Tag>)}
            </div>
          )}
        </motion.div>

        {/* 14 Regions */}
        <Section title="14 Bölge Analizi" icon="🗺️">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {analysis.regions.map((r, i) => (
              <div key={i} style={{ paddingBottom: i < analysis.regions.length - 1 ? 16 : 0, borderBottom: i < analysis.regions.length - 1 ? "1px solid var(--border)" : "none" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--brand-light)", marginBottom: 6 }}>
                  {r.region}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 4 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Gözlem:</strong> {r.observation}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Yorum:</strong> {r.reading}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Strengths */}
        <Section title="Güçlü Yönler" icon="⚡">
          <BulletList items={analysis.strengths} color="var(--text-secondary)" />
        </Section>

        {/* Growth areas */}
        <Section title="Gelişim Alanları" icon="🌱">
          <BulletList items={analysis.growthAreas} color="var(--text-secondary)" />
          {analysis.weaknesses.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                Dikkat Edilmesi Gerekenler
              </p>
              <BulletList items={analysis.weaknesses} color="var(--text-muted)" />
            </div>
          )}
        </Section>

        {/* Career fit */}
        <Section title="Kariyer Eğilimleri" icon="🚀">
          {analysis.careerFit.bestSectors.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                Uygun Sektörler
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {analysis.careerFit.bestSectors.map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </div>
          )}
          {analysis.careerFit.bestRoles.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                Uygun Roller
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {analysis.careerFit.bestRoles.map((r) => <Tag key={r}>{r}</Tag>)}
              </div>
            </div>
          )}
          {analysis.careerFit.avoidRoles.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                Kaçınılması Önerilen
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {analysis.careerFit.avoidRoles.map((r) => (
                  <span key={r} style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(255,107,107,0.08)",
                    border: "1px solid rgba(255,107,107,0.2)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,107,107,0.9)",
                    margin: "3px 4px 3px 0",
                  }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Lifestyle */}
        <Section title="Yaşam Tarzı" icon="◌">
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 8 }}>
              <strong style={{ color: "var(--text-primary)" }}>Sosyal Stil:</strong> {analysis.lifestyle.socialStyle}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
              <strong style={{ color: "var(--text-primary)" }}>Stres Tepkisi:</strong> {analysis.lifestyle.stressResponse}
            </p>
          </div>
          {analysis.lifestyle.enjoyedActivities.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                Keyif Alınan Aktiviteler
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {analysis.lifestyle.enjoyedActivities.map((a) => <Tag key={a}>{a}</Tag>)}
              </div>
            </div>
          )}
        </Section>

        {/* Dark side */}
        {analysis.darkSide.length > 0 && (
          <Section title="Gölge Taraf" icon="🌑">
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>
              Farkında olunmayan ya da bastırılan yönler — bunları tanımak güçtür.
            </p>
            <BulletList items={analysis.darkSide} color="var(--text-muted)" />
          </Section>
        )}

        {/* Narrative */}
        {analysis.narrative && (
          <Section title="Kişisel Yorum" icon="✦">
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, fontStyle: "italic" }}>
              "{analysis.narrative}"
            </p>
          </Section>
        )}

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, textAlign: "center", marginTop: 8, padding: "0 8px" }}>
          {analysis.disclaimer ?? "Simaloji eğlence ve keşif amaçlıdır; bilimsel veya psikolojik değerlendirme değildir."}
        </p>
      </div>
    </main>
  );
}
