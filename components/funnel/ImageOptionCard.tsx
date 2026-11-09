"use client";

import { motion } from "framer-motion";
import { hapticTap } from "@/lib/haptic";

interface ImageOptionCardProps {
  id: string;
  label: string;
  imageUrl: string;
  selected: boolean;
  onClick: (id: string) => void;
}

export default function ImageOptionCard({ id, label, imageUrl, selected, onClick }: ImageOptionCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => { hapticTap(); onClick(id); }}
      style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
    >
      <div style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        aspectRatio: "4/3",
        border: selected ? "2.5px solid #7C5CFC" : "2px solid rgba(124,92,252,0.1)",
        boxShadow: selected
          ? "0 0 0 3px rgba(124,92,252,0.2), 0 4px 16px rgba(124,92,252,0.15)"
          : "0 2px 10px rgba(0,0,0,0.08)",
        transition: "border-color 0.18s, box-shadow 0.18s",
      }}>
        <img
          src={imageUrl}
          alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />

        {/* Selected overlay */}
        {selected && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(124,92,252,0.14)",
            transition: "opacity 0.18s",
          }} />
        )}

        {/* Bottom gradient for readability */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
          pointerEvents: "none",
        }} />

        {/* Selection indicator */}
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 24, height: 24, borderRadius: "50%",
          background: selected ? "#7C5CFC" : "rgba(255,255,255,0.88)",
          border: selected ? "none" : "1.5px solid rgba(255,255,255,0.95)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 6px rgba(0,0,0,0.25)",
          transition: "background 0.18s",
        }}>
          {selected && (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5l2.5 2.5L9 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      <p style={{
        marginTop: 7,
        fontSize: 13,
        fontWeight: 600,
        color: selected ? "#7C5CFC" : "var(--text-primary)",
        textAlign: "center",
        transition: "color 0.18s",
        lineHeight: 1.3,
      }}>
        {label}
      </p>
    </motion.button>
  );
}
