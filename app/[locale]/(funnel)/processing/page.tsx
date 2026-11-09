"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { key: "regions", label: "14 bölge analizi", icon: "🗺️", durationMs: 2800 },
  { key: "temperament", label: "Mizaç profili", icon: "🧬", durationMs: 2600 },
  { key: "strengths", label: "Güçlü yönler", icon: "⚡", durationMs: 2400 },
  { key: "compat", label: "Uyum profili", icon: "🤝", durationMs: 2200 },
] as const;

const MICRO_QUESTIONS = [
  {
    id: "q1",
    showAtStep: 1,
    question: "Başkalarının seni nasıl gördüğüyle ne kadar ilgilenirsin?",
    options: ["Çok önemsirim", "Biraz umururum", "Pek umursamam"],
  },
  {
    id: "q2",
    showAtStep: 2,
    question: "Önemli kararlarda ne daha ağır basar?",
    options: ["Sezgim", "Analiz", "İkisi birden"],
  },
  {
    id: "q3",
    showAtStep: 3,
    question: "Sosyal ortamlarda enerjin nasıl değişir?",
    options: ["Şarj olurum", "Nötr kalırım", "Yorulurum"],
  },
] as const;

type MicroQuestion = (typeof MICRO_QUESTIONS)[number];

export default function ProcessingPage() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<MicroQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [allDone, setAllDone] = useState(false);

  const abortRef = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    abortRef.current = false;

    const run = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (abortRef.current) return;

        setActiveStepIdx(i);
        setStepProgress(0);

        const q = MICRO_QUESTIONS.find((mq) => mq.showAtStep === i);
        if (q) {
          setActiveQuestion(q);
          setSelectedAnswer(null);
        }

        const { durationMs } = STEPS[i];
        const intervalMs = 40;
        const totalIncrements = Math.ceil(durationMs / intervalMs);
        let inc = 0;

        await new Promise<void>((resolve) => {
          const timer = setInterval(() => {
            if (abortRef.current) {
              clearInterval(timer);
              resolve();
              return;
            }
            inc++;
            const pct = Math.min((inc / totalIncrements) * 100, 100);
            setStepProgress(pct);
            if (pct >= 100) {
              clearInterval(timer);
              resolve();
            }
          }, intervalMs);
        });

        if (abortRef.current) return;

        setCompletedSteps((prev) => new Set([...prev, i]));
        setActiveQuestion(null);
        setSelectedAnswer(null);

        if (i < STEPS.length - 1) {
          await new Promise<void>((r) => setTimeout(r, 300));
          if (abortRef.current) return;
        }
      }

      setAllDone(true);
      await new Promise<void>((r) => setTimeout(r, 900));
      if (abortRef.current) return;
      router.push(`/${locale}/email`);
    };

    run();

    return () => {
      abortRef.current = true;
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [locale, router]);

  const handleAnswer = useCallback((_questionId: string, answer: string) => {
    setSelectedAnswer(answer);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setActiveQuestion(null);
      setSelectedAnswer(null);
    }, 700);
  }, []);

  return (
    <main
      style={{
        minHeight: "100dvh",
        padding: "56px 24px 48px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ maxWidth: 440, margin: "0 auto", width: "100%", flex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(124,92,252,0.1)",
              border: "2px solid rgba(124,92,252,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 30,
              position: "relative",
            }}
          >
            <span>{allDone ? "✓" : "🔬"}</span>
            {!allDone && (
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: "2px solid transparent",
                  borderTopColor: "var(--brand)",
                  animation: "spin 1.4s linear infinite",
                }}
              />
            )}
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 8,
              color: "var(--text-primary)",
            }}
          >
            {allDone ? "Rapor Hazır!" : "Rapor Hazırlanıyor…"}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {allDone
              ? "Simaloji analizin tamamlandı."
              : "Yüz haritandan derin okuma yapılıyor."}
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
          {STEPS.map((step, i) => {
            const isDone = allDone || completedSteps.has(i);
            const isActive = !isDone && i === activeStepIdx;
            const isPending = !isDone && !isActive;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  borderRadius: 16,
                  border: `1.5px solid ${isActive ? "rgba(124,92,252,0.35)" : "var(--border)"}`,
                  background: isActive
                    ? "rgba(124,92,252,0.07)"
                    : "rgba(124,92,252,0.03)",
                  padding: "14px 16px",
                  transition: "border-color 0.3s, background 0.3s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: isActive ? 10 : 0,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: isDone
                        ? "rgba(124,92,252,0.2)"
                        : isPending
                        ? "rgba(124,92,252,0.05)"
                        : "rgba(124,92,252,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                      transition: "all 0.3s",
                    }}
                  >
                    {isDone ? "✓" : step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 500,
                        color: isDone
                          ? "var(--brand-light)"
                          : isPending
                          ? "var(--text-muted)"
                          : "var(--text-primary)",
                        transition: "color 0.3s",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: isDone
                        ? "var(--brand-light)"
                        : isActive
                        ? "var(--text-secondary)"
                        : "var(--text-muted)",
                      fontWeight: isDone ? 600 : 400,
                    }}
                  >
                    {isDone ? "Tamamlandı" : isActive ? "İşleniyor…" : "Bekliyor"}
                  </span>
                </div>

                {isActive && (
                  <div
                    style={{
                      height: 3,
                      borderRadius: 2,
                      background: "var(--border)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 2,
                        background:
                          "linear-gradient(90deg, var(--brand), var(--brand-light))",
                        width: `${stepProgress}%`,
                        transition: "width 0.08s linear",
                      }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Micro question */}
        <AnimatePresence mode="wait">
          {activeQuestion && (
            <motion.div
              key={activeQuestion.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              style={{
                borderRadius: 20,
                background:
                  "linear-gradient(135deg, rgba(124,92,252,0.1), rgba(91,63,212,0.05))",
                border: "1.5px solid rgba(124,92,252,0.22)",
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--brand-light)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Hızlı Soru
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.4,
                  marginBottom: 16,
                }}
              >
                {activeQuestion.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  return (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(activeQuestion.id, option)}
                      style={{
                        padding: "11px 16px",
                        borderRadius: 12,
                        border: `1.5px solid ${
                          isSelected
                            ? "rgba(124,92,252,0.5)"
                            : "var(--border-mid)"
                        }`,
                        background: isSelected
                          ? "rgba(124,92,252,0.15)"
                          : "rgba(124,92,252,0.04)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: isSelected
                          ? "var(--brand-light)"
                          : "var(--text-secondary)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {isSelected && (
                        <span style={{ fontSize: 12, flexShrink: 0 }}>✓</span>
                      )}
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
