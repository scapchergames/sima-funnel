"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCAN_STEPS = [
  "Yüz algılandı",
  "Alın bölgesi analiz ediliyor",
  "Göz derinliği hesaplanıyor",
  "Çene hattı ölçülüyor",
  "Burun orantıları analiz ediliyor",
  "Dudak simetri kontrol ediliyor",
  "Mizaç profili çıkarılıyor",
  "Sonuç hazırlanıyor…",
];

const LANDMARK_POSITIONS = [
  { x: 50, y: 18 },
  { x: 50, y: 32 },
  { x: 35, y: 42 },
  { x: 65, y: 42 },
  { x: 35, y: 44 },
  { x: 65, y: 44 },
  { x: 50, y: 54 },
  { x: 42, y: 61 },
  { x: 58, y: 61 },
  { x: 50, y: 67 },
  { x: 36, y: 72 },
  { x: 64, y: 72 },
  { x: 28, y: 65 },
  { x: 72, y: 65 },
];

interface ScanAnimationProps {
  imageUrl: string;
  onComplete: () => void;
  minDurationMs?: number;
}

export default function ScanAnimation({ imageUrl, onComplete, minDurationMs = 6000 }: ScanAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleDots, setVisibleDots] = useState<number[]>([]);
  const [scanY, setScanY] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const stepDuration = Math.floor(minDurationMs / SCAN_STEPS.length);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= SCAN_STEPS.length) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setDone(true);
            onComplete();
          }, 600);
        }
        return Math.min(next, SCAN_STEPS.length - 1);
      });
    }, stepDuration);

    const dotInterval = setInterval(() => {
      setVisibleDots((prev) => {
        if (prev.length >= LANDMARK_POSITIONS.length) {
          clearInterval(dotInterval);
          return prev;
        }
        return [...prev, prev.length];
      });
    }, minDurationMs / LANDMARK_POSITIONS.length);

    const scanInterval = setInterval(() => {
      setScanY((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 60);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotInterval);
      clearInterval(scanInterval);
    };
  }, [minDurationMs, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#F7F5FF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div style={{ position: "relative", width: 240, height: 300, marginBottom: 32 }}>
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: 24,
          overflow: "hidden",
          border: "2px solid rgba(124,92,252,0.4)",
          position: "relative",
        }}>
          <img
            src={imageUrl}
            alt="Yüz analizi"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 60%, rgba(247,245,255,0.5) 100%)",
          }} />

          <motion.div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, rgba(124,92,252,0.8), rgba(169,139,255,1), rgba(124,92,252,0.8), transparent)",
              top: `${scanY}%`,
              boxShadow: "0 0 12px rgba(124,92,252,0.6)",
            }}
          />

          {LANDMARK_POSITIONS.map((pos, i) => (
            <AnimatePresence key={i}>
              {visibleDots.includes(i) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    position: "absolute",
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--brand-light)",
                    boxShadow: "0 0 8px rgba(169,139,255,0.8)",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </AnimatePresence>
          ))}
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "var(--brand)",
            borderRightColor: "var(--brand-light)",
          }}
        />
      </div>

      <div style={{ textAlign: "center", maxWidth: 320 }}>
        <div style={{
          display: "flex",
          gap: 4,
          justifyContent: "center",
          marginBottom: 16,
        }}>
          {SCAN_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i <= currentStep ? 20 : 6,
                height: 4,
                borderRadius: 2,
                background: i <= currentStep ? "var(--brand)" : "var(--border-mid)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {SCAN_STEPS[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
