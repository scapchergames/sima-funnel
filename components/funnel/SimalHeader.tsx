import React from "react";

export default function SimalHeader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    }}>
      {/* Logo icon */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        background: "linear-gradient(135deg, #7C5CFC, #5B3FD4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 10px rgba(124,92,252,0.35)",
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {/* Face oval */}
          <ellipse cx="9" cy="9.5" rx="5.5" ry="6.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
          {/* Eyes */}
          <circle cx="6.8" cy="8.2" r="1" fill="white" />
          <circle cx="11.2" cy="8.2" r="1" fill="white" />
          {/* Mouth */}
          <path d="M7 11.5 Q9 13 11 11.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Scan line */}
          <line x1="3.5" y1="9.5" x2="14.5" y2="9.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" strokeDasharray="2 1.5" />
        </svg>
      </div>

      {/* Brand name */}
      <span style={{
        fontSize: 17,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-primary)",
      }}>
        Simaloji
      </span>
    </div>
  );
}
