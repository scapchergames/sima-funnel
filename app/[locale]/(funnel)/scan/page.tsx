"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { processImage } from "@/lib/image/process";
import ScanAnimation from "@/components/scan/ScanAnimation";
import { getSessionId } from "@/lib/session/store";
import { storageSet } from "@/lib/storage";

type ScanState = "idle" | "scanning" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_image: "Net bir yüz fotoğrafı gönderin. Önden çekilmiş, iyi aydınlatılmış bir fotoğraf deneyin.",
  minor_detected: "Bu analiz 18 yaş ve üzeri içindir.",
  default: "Fotoğraf işlenemedi. Lütfen tekrar deneyin.",
};

export default function ScanPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [state, setState] = useState<ScanState>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analysisDone = useRef(false);
  const analysisResult = useRef<unknown>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setError(null);

    try {
      const processed = await processImage(file);
      const dataUrl = `data:image/jpeg;base64,${processed.base64}`;
      const blob = await (await fetch(dataUrl)).blob();
      const processedFile = new File([blob], "face.jpg", { type: "image/jpeg" });

      const previewUrl = URL.createObjectURL(processedFile);
      setImageUrl(previewUrl);
      setImageFile(processedFile);

      await startAnalysis(processedFile, previewUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.default);
    }
  }, []);

  const startAnalysis = useCallback(async (file: File, previewUrl: string) => {
    setState("scanning");
    analysisDone.current = false;
    analysisResult.current = null;

    const sessionId = getSessionId();
    if (!sessionId) {
      setError("Session bulunamadı. Sayfayı yenileyin.");
      setState("error");
      return;
    }

    const form = new FormData();
    form.append("image", file);
    form.append("sessionId", sessionId);
    form.append("locale", locale);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        const status = res.headers.get("X-Analysis-Status");
        const msg = ERROR_MESSAGES[status ?? ""] ?? data.error ?? ERROR_MESSAGES.default;
        analysisDone.current = true;
        analysisResult.current = { error: msg };
      } else {
        analysisDone.current = true;
        analysisResult.current = data;
        storageSet("sima_teaser", JSON.stringify(data.teaser));
        storageSet("sima_image_url", previewUrl);
      }
    } catch {
      analysisDone.current = true;
      analysisResult.current = { error: ERROR_MESSAGES.default };
    }
  }, [locale]);

  const handleScanComplete = useCallback(() => {
    if (!analysisDone.current) {
      const checkInterval = setInterval(() => {
        if (analysisDone.current) {
          clearInterval(checkInterval);
          handleScanComplete();
        }
      }, 300);
      return;
    }

    const result = analysisResult.current as { error?: string } | null;

    if (result?.error) {
      setState("error");
      setError(result.error);
      return;
    }

    router.push(`/${locale}/processing`);
  }, [locale, router]);

  return (
    <main style={{ minHeight: "100dvh" }}>
      <AnimatePresence>
        {state === "scanning" && imageUrl && (
          <ScanAnimation
            imageUrl={imageUrl}
            onComplete={handleScanComplete}
            minDurationMs={6000}
          />
        )}
      </AnimatePresence>

      {state !== "scanning" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "56px 24px 120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(124,92,252,0.1)",
              border: "1.5px solid rgba(124,92,252,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 32,
            }}>
              📸
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10, color: "var(--text-primary)" }}>
              Yüzünü Çerçevele
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 300 }}>
              Önden çekilmiş, iyi aydınlatılmış ve yalnızca senin yüzünün göründüğü bir fotoğraf seç.
            </p>
          </div>

          {imageUrl && state === "idle" && (
            <div style={{
              width: 180,
              height: 220,
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 24,
              border: "2px solid rgba(124,92,252,0.3)",
            }}>
              <img src={imageUrl} alt="Seçilen fotoğraf" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {error && (
            <div style={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 16,
              background: "rgba(255,107,107,0.08)",
              border: "1px solid rgba(255,107,107,0.25)",
              padding: "14px 18px",
              marginBottom: 20,
              fontSize: 14,
              color: "#FF6B6B",
              lineHeight: 1.5,
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => fileInputRef.current?.click()}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              📸 Selfie Çek / Galeriden Seç
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
                e.target.value = "";
              }}
            />

            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }}
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
              🖼️ Galeriden Seç (kamerasız)
            </button>
          </div>

          <div style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 12,
            background: "rgba(124,92,252,0.06)",
            maxWidth: 400,
            width: "100%",
          }}>
            <span style={{ fontSize: 14 }}>🔒</span>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
              Fotoğrafın yalnızca analiz için kullanılır ve analiz biter bitmez silinir.
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
