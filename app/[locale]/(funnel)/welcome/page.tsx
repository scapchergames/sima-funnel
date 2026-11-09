"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  return (
    <main style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
      textAlign: "center",
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ maxWidth: 400, width: "100%" }}
      >
        <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>

        <h1 style={{
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          marginBottom: 12,
          color: "var(--text-primary)",
        }}>
          Hoş Geldin!
        </h1>

        <p style={{
          fontSize: 15,
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          marginBottom: 36,
        }}>
          Raporun hazır. Şimdi ne yapmak istersin?
        </p>

        <div style={{
          borderRadius: 16,
          background: "rgba(124,92,252,0.08)",
          border: "1px solid rgba(124,92,252,0.2)",
          padding: "14px 18px",
          marginBottom: 24,
          fontSize: 13,
          color: "var(--brand-light)",
          lineHeight: 1.55,
        }}>
          ✉️ Giriş linki e-postana gönderildi.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/${locale}/report`)}
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
              boxShadow: "0 8px 32px rgba(124,92,252,0.35)",
            }}
          >
            📋 Tam Raporumu Web'de Oku
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              padding: "15px 0",
              borderRadius: 16,
              background: "transparent",
              border: "1.5px solid var(--border-mid)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            📱 Uygulamayı İndir
          </motion.button>
        </div>

        <p style={{
          marginTop: 16,
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.55,
        }}>
          Uygulamada aynı e-postayla giriş yap — premium otomatik açılır.
        </p>
      </motion.div>
    </main>
  );
}
