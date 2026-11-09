"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import ProgressBar from "@/components/funnel/ProgressBar";
import OptionCard from "@/components/funnel/OptionCard";
import ImageOptionCard from "@/components/funnel/ImageOptionCard";
import InfoScreen from "@/components/funnel/InfoScreen";
import StickyCTA, { CTAButton } from "@/components/funnel/StickyCTA";
import SimalHeader from "@/components/funnel/SimalHeader";
import { patchSession, getSessionId } from "@/lib/session/store";
import { getQuizMaxSteps } from "@/lib/experiments";

import quizConfigTr from "@/funnel-config/quiz.tr.json";

type QuizStep =
  | { id: string; type: "single_choice"; titleKey: string; options: QuizOption[]; autoAdvance: boolean; track: string }
  | { id: string; type: "multi_choice"; titleKey: string; maxSelect: number; options: QuizOption[]; autoAdvance: boolean; track: string }
  | { id: string; type: "image_choice"; titleKey: string; subtitleKey?: string; multiSelect: boolean; maxSelect?: number; options: ImageQuizOption[]; track: string }
  | { id: string; type: "info"; titleKey: string; bodyKey: string; illustration?: string; stat?: string; statLabel?: string; track: string }
  | { id: string; type: "transition"; titleKey: string; bodyKey: string; ctaKey: string; track: string };

interface QuizOption {
  id: string;
  labelKey: string;
  icon?: string;
  traits: Record<string, number>;
  exit?: boolean;
  highlight?: string;
}

interface ImageQuizOption {
  id: string;
  labelKey: string;
  imageUrl: string;
  traits: Record<string, number>;
}

const QUIZ_STEPS = quizConfigTr.steps as QuizStep[];
const TOTAL_REAL_STEPS = QUIZ_STEPS.filter((s) => s.type !== "info" && s.type !== "transition").length;
const MAX_REAL_STEPS = typeof window !== "undefined" ? getQuizMaxSteps() : TOTAL_REAL_STEPS;

export default function QuizStepPage() {
  const params = useParams();
  const router = useRouter();

  const locale = params.locale as string;
  const stepIndex = parseInt(params.step as string, 10);
  const step = QUIZ_STEPS[stepIndex];

  const [selected, setSelected] = useState<string[]>([]);
  const [traits, setTraits] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const realStepsSoFar = QUIZ_STEPS.slice(0, stepIndex + 1).filter(
    (s) => s.type !== "info" && s.type !== "transition"
  ).length;

  const advance = useCallback(() => {
    const nextIndex = stepIndex + 1;
    const nextRealCount = QUIZ_STEPS.slice(0, nextIndex).filter(
      (s) => s.type !== "info" && s.type !== "transition"
    ).length;
    if (nextIndex >= QUIZ_STEPS.length || nextRealCount >= MAX_REAL_STEPS) {
      router.push(`/${locale}/photo-guide`);
    } else {
      router.push(`/${locale}/quiz/${nextIndex}`);
    }
  }, [stepIndex, locale, router]);

  const handleSingleChoice = useCallback(
    (optionId: string) => {
      if (!step || step.type !== "single_choice") return;

      const option = step.options.find((o) => o.id === optionId);
      if (!option) return;

      if (option.exit) {
        router.push(`/${locale}/start/karakter`);
        return;
      }

      const newTraits = { ...traits };
      Object.entries(option.traits).forEach(([k, v]) => {
        newTraits[k] = (newTraits[k] ?? 0) + v;
      });

      const newAnswers = { ...answers, [step.id]: optionId };
      setTraits(newTraits);
      setAnswers(newAnswers);

      const sid = getSessionId();
      if (sid) {
        patchSession(sid, {
          quizAnswers: newAnswers,
          traits: newTraits,
          currentStep: step.id,
        }).catch(console.error);
      }

      if (step.autoAdvance) {
        setTimeout(() => advance(), 180);
      } else {
        setSelected([optionId]);
      }
    },
    [step, traits, answers, advance, locale, router]
  );

  const handleMultiChoice = useCallback(
    (optionId: string) => {
      if (!step || step.type !== "multi_choice") return;

      setSelected((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId);
        }
        if (prev.length >= step.maxSelect) {
          return [...prev.slice(1), optionId];
        }
        return [...prev, optionId];
      });
    },
    [step]
  );

  const handleMultiConfirm = useCallback(() => {
    if (!step || step.type !== "multi_choice") return;

    const newTraits = { ...traits };
    selected.forEach((optionId) => {
      const option = step.options.find((o) => o.id === optionId);
      if (!option) return;
      Object.entries(option.traits).forEach(([k, v]) => {
        newTraits[k] = (newTraits[k] ?? 0) + v;
      });
    });

    const newAnswers = { ...answers, [step.id]: selected };
    setTraits(newTraits);
    setAnswers(newAnswers);

    const sid = getSessionId();
    if (sid) {
      patchSession(sid, {
        quizAnswers: newAnswers,
        traits: newTraits,
        currentStep: step.id,
      }).catch(console.error);
    }

    advance();
  }, [step, selected, traits, answers, advance]);

  if (!step) {
    router.replace(`/${locale}/scan`);
    return null;
  }

  if (step.type === "image_choice") {
    const isMulti = step.multiSelect;
    const max = step.maxSelect ?? 1;

    const handleImageClick = (optionId: string) => {
      if (!isMulti) {
        const option = step.options.find(o => o.id === optionId);
        if (!option) return;
        const newTraits = { ...traits };
        Object.entries(option.traits).forEach(([k, v]) => { newTraits[k] = (newTraits[k] ?? 0) + v; });
        const newAnswers = { ...answers, [step.id]: optionId };
        setTraits(newTraits);
        setAnswers(newAnswers);
        const sid = getSessionId();
        if (sid) patchSession(sid, { quizAnswers: newAnswers, traits: newTraits, currentStep: step.id }).catch(console.error);
        setTimeout(() => advance(), 220);
      } else {
        setSelected(prev =>
          prev.includes(optionId)
            ? prev.filter(id => id !== optionId)
            : prev.length >= max ? [...prev.slice(1), optionId] : [...prev, optionId]
        );
      }
    };

    const handleImageConfirm = () => {
      const newTraits = { ...traits };
      selected.forEach(optionId => {
        const option = step.options.find(o => o.id === optionId);
        if (!option) return;
        Object.entries(option.traits).forEach(([k, v]) => { newTraits[k] = (newTraits[k] ?? 0) + v; });
      });
      const newAnswers = { ...answers, [step.id]: selected };
      setTraits(newTraits);
      setAnswers(newAnswers);
      const sid = getSessionId();
      if (sid) patchSession(sid, { quizAnswers: newAnswers, traits: newTraits, currentStep: step.id }).catch(console.error);
      advance();
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          style={{ padding: "16px 20px 140px" }}
        >
          <SimalHeader />
          <ProgressBar
            current={realStepsSoFar}
            total={TOTAL_REAL_STEPS}
            showBack={stepIndex > 0}
            onBack={() => router.back()}
            label="Quiz"
          />

          <h2 style={{
            marginTop: 28,
            marginBottom: step.subtitleKey ? 4 : 20,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            color: "var(--text-primary)",
          }}>
            {step.titleKey}
          </h2>

          {step.subtitleKey && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18, marginTop: 0 }}>
              {step.subtitleKey}
            </p>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {step.options.map(option => (
              <ImageOptionCard
                key={option.id}
                id={option.id}
                label={option.labelKey}
                imageUrl={option.imageUrl}
                selected={isMulti ? selected.includes(option.id) : answers[step.id] === option.id}
                onClick={handleImageClick}
              />
            ))}
          </div>

          {isMulti && selected.length > 0 && (
            <StickyCTA>
              <CTAButton onClick={handleImageConfirm}>
                Devam Et ({selected.length}/{max})
              </CTAButton>
            </StickyCTA>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step.type === "info") {
    return (
      <div>
        <div style={{ padding: "16px 20px 0" }}>
          <SimalHeader />
          <ProgressBar current={realStepsSoFar} total={TOTAL_REAL_STEPS} showBack onBack={() => router.back()} />
        </div>
        <InfoScreen
          title={step.titleKey}
          body={step.bodyKey}
          stat={(step as { stat?: string }).stat}
          statLabel={(step as { statLabel?: string }).statLabel}
          illustration={(step.illustration as "face_map" | "social" | undefined) ?? "none"}
          onCta={advance}
        />
      </div>
    );
  }

  if (step.type === "transition") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ position: "absolute", top: "max(16px, env(safe-area-inset-top))", left: 24 }}>
            <SimalHeader />
          </div>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✦</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 14, color: "var(--text-primary)" }}>
            {step.titleKey}
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 320, marginBottom: 48 }}>
            {step.bodyKey}
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={advance}
            style={{
              width: "100%",
              maxWidth: 360,
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
            {step.ctaKey}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        style={{ padding: "16px 20px 140px" }}
      >
        <SimalHeader />
        <ProgressBar
          current={realStepsSoFar}
          total={TOTAL_REAL_STEPS}
          showBack={stepIndex > 0}
          onBack={() => router.back()}
          label="Quiz"
        />

        <h2 style={{
          marginTop: 32,
          marginBottom: 24,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          color: "var(--text-primary)",
        }}>
          {step.titleKey}
        </h2>

        {step.type === "multi_choice" && (
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, marginTop: -16 }}>
            Birden fazla seçebilirsin (maks {step.maxSelect})
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {step.options.map((option) => (
            <OptionCard
              key={option.id}
              id={option.id}
              label={option.labelKey}
              icon={option.icon}
              selected={
                step.type === "multi_choice"
                  ? selected.includes(option.id)
                  : answers[step.id] === option.id
              }
              onClick={step.type === "multi_choice" ? handleMultiChoice : handleSingleChoice}
            />
          ))}
        </div>

        {step.type === "multi_choice" && selected.length > 0 && (
          <StickyCTA>
            <CTAButton onClick={handleMultiConfirm}>
              Devam Et ({selected.length}/{step.maxSelect})
            </CTAButton>
          </StickyCTA>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
