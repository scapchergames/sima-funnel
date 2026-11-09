"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import StickyCTA, { CTAButton } from "@/components/funnel/StickyCTA";
import { getSessionId, patchSession } from "@/lib/session/store";
import { fbEvent } from "@/lib/analytics/pixel";
import { storageSet } from "@/lib/storage";

const COMMON_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "hotmal.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
};

function suggestEmailFix(email: string): string | null {
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const domain = parts[1].toLowerCase();
  const fix = COMMON_TYPOS[domain];
  return fix ? `${parts[0]}@${fix}` : null;
}

export default function EmailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [email, setEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typoSuggestion, setTypoSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (email.includes("@") && email.includes(".")) {
      setTypoSuggestion(suggestEmailFix(email));
    } else {
      setTypoSuggestion(null);
    }
  }, [email]);

  async function handleSubmit() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir e-posta adresi gir.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionId = getSessionId();

      const [leadRes] = await Promise.all([
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, sessionId, marketingOptIn }),
        }),
        sessionId ? patchSession(sessionId, { email, marketingOptIn, currentStep: "email" }) : Promise.resolve(),
      ]);

      if (!leadRes.ok) {
        throw new Error("E-posta kaydedilemedi");
      }

      storageSet("sima_email", email);
      fbEvent("Lead", { content_name: "FunnelEmailCapture" });
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "Lead",
          sourceUrl: window.location.href,
          email,
          fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1],
          fbc: document.cookie.match(/_fbc=([^;]+)/)?.[1],
        }),
      }).catch(() => null);

      router.push(`/${locale}/result`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    router.push(`/${locale}/result`);
  }

  return (
    <main style={{ minHeight: "100dvh", padding: "56px 24px 140px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ maxWidth: 420, margin: "0 auto" }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: "linear-gradient(135deg, rgba(124,92,252,0.2), rgba(169,139,255,0.1))",
          border: "1.5px solid rgba(124,92,252,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 28,
        }}>
          ✉️
        </div>

        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          marginBottom: 12,
          color: "var(--text-primary)",
        }}>
          Raporun hazır! Kaybolmaması için nereye gönderelim?
        </h1>

        <p style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          marginBottom: 32,
        }}>
          Raporuna istediğin zaman bu e-postayla ulaşabilirsin.
        </p>

        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="e-posta@adresin.com"
            autoComplete="email"
            inputMode="email"
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 14,
              border: `1.5px solid ${error ? "rgba(255,107,107,0.5)" : "var(--border-mid)"}`,
              background: "rgba(124,92,252,0.04)",
              fontSize: 16,
              color: "var(--text-primary)",
              outline: "none",
            }}
          />

          {typoSuggestion && !error && (
            <motion.button
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => { setEmail(typoSuggestion); setTypoSuggestion(null); }}
              style={{
                marginTop: 8,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(124,92,252,0.08)",
                border: "1px solid rgba(124,92,252,0.2)",
                fontSize: 13,
                color: "var(--brand-light)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Bunu mu yazmak istedin: <strong>{typoSuggestion}</strong>?
            </motion.button>
          )}

          {error && (
            <p style={{ marginTop: 8, fontSize: 13, color: "#FF6B6B" }}>{error}</p>
          )}
        </div>

        <label style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          cursor: "pointer",
          padding: "14px 0",
        }}>
          <div
            onClick={() => setMarketingOptIn(!marketingOptIn)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              border: `1.5px solid ${marketingOptIn ? "var(--brand)" : "var(--border-mid)"}`,
              background: marketingOptIn ? "var(--brand)" : "transparent",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
              transition: "all 0.18s",
            }}
          >
            {marketingOptIn && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Yeni özellikler ve içeriklerden haberdar olmak istiyorum (isteğe bağlı)
          </span>
        </label>
      </motion.div>

      <StickyCTA
        note="Spam göndermiyoruz. İstediğin zaman çıkabilirsin."
      >
        <CTAButton onClick={handleSubmit} loading={loading}>
          Raporumu Gönder
        </CTAButton>
        <button
          onClick={handleSkip}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "12px 0",
            background: "transparent",
            border: "none",
            fontSize: 14,
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          Şimdi değil
        </button>
      </StickyCTA>
    </main>
  );
}
