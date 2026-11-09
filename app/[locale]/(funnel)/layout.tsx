import type { ReactNode } from "react";


export default function FunnelLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--dark)",
        color: "var(--text-primary)",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
