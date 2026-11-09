"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import pricingConfig from "@/funnel-config/pricing.json";
import { fbEvent } from "@/lib/analytics/pixel";
import { storageGet, storageSet } from "@/lib/storage";

type PricingLocale = keyof typeof pricingConfig;

interface Plan {
  id: string;
  name: string;
  trialDays: number;
  trialPrice: number | null;
  renewalPrice: number;
  renewalPeriod: string;
  renewalPeriodDays: number;
  popular: boolean;
  cta: string;
  savingsLabel?: string;
}

const FEATURES = [
  { icon: "✦", text: "14 bölgenin tamamı — alın, gözler, çene ve daha fazlası" },
  { icon: "⚡", text: "Mizaç profili ve güçlü yönler" },
  { icon: "🚀", text: "Kariyer eğilimleri ve uygun roller" },
  { icon: "🌱", text: "Gelişim alanları ve öneriler" },
  { icon: "◌", text: "Yaşam tarzı ve sosyal profil" },
  { icon: "📱", text: "Uygulamada premium (günlük takip, karşılaştırma)" },
];

const REVIEWS = [
  { text: "Yüz şeklimle ilgili söyledikleri inanılmaz derecede isabetliydi. Kariyer bölümü özellikle çok değerliydi.", author: "M. K.", date: "Kasım 2026" },
  { text: "Partnerimle uyum raporunu aldık, ilişkimize farklı bir perspektiften bakmamızı sağladı.", author: "E. T.", date: "Ekim 2026" },
  { text: "Skeptiktim ama sonuçlar gerçekten etkileyiciydi. Özellikle güçlü/zayıf yönler kısmı tam isabet.", author: "A. Y.", date: "Kasım 2026" },
];

const FAQ = [
  { q: "Ne zaman ücretlendirilirim?", a: "Deneme süresi bitiminde, iptal etmezsen otomatik yenilenir. 24 saat öncesinde hatırlatma e-postası gönderiyoruz." },
  { q: "Nasıl iptal ederim?", a: "Hesabından istediğin zaman 2 tıkla iptal edebilirsin. Destek ekibimize de yazabilirsin." },
  { q: "Fotoğrafım saklanıyor mu?", a: "Hayır. Fotoğrafın analiz biter bitmez sunucularımızdan silinir. Sadece analiz sonuçları hesabında saklanır." },
  { q: "Bu bilimsel mi?", a: "Simaloji geleneksel fizyonomiden ilham alır ve eğlence amaçlıdır. Bilimsel veya psikolojik bir değerlendirme değildir." },
  { q: "Uygulamada da geçerli mi?", a: "Evet! Aynı e-postayla uygulamaya giriş yaptığında web aboneliğin uygulamada premium özelliklerini açar." },
];

export default function PaywallPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const pricingLocale: PricingLocale = locale === "tr" ? "tr" : "en";
  const pricing = pricingConfig[pricingLocale];
  const plans = pricing.plans as Plan[];

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.find((p) => p.popular)?.id ?? plans[0].id
  );
  const [loading, setLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    fbEvent("ViewContent", { content_name: "Paywall", content_category: "Funnel" });

    const arrivalTime = Date.now();
    const handleVisibilityChange = () => {
      if (document.hidden && Date.now() - arrivalTime > 12_000) {
        setShowExitModal(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? plans[0];
  const sym = pricing.currencySymbol;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  async function handleCheckout() {
    setLoading(true);
    const checkoutValue = selectedPlan.trialPrice ?? selectedPlan.renewalPrice;
    fbEvent("InitiateCheckout", { value: checkoutValue, currency: pricing.currency ?? "TRY", num_items: 1 });
    await new Promise((r) => setTimeout(r, 800));

    const sessionId = typeof window !== "undefined"
      ? storageGet("sima_session_id")
      : null;

    if (sessionId) {
      storageSet("sima_paid", "1");
      await fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, paid: true }),
      }).catch(() => null);
    }

    fbEvent("Purchase", { value: checkoutValue, currency: pricing.currency ?? "TRY", num_items: 1 });
    const email = sessionId ? storageGet("sima_email") ?? undefined : undefined;
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "Purchase",
        sourceUrl: window.location.href,
        email,
        value: checkoutValue,
        currency: pricing.currency ?? "TRY",
        fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1],
        fbc: document.cookie.match(/_fbc=([^;]+)/)?.[1],
      }),
    }).catch(() => null);

    setLoading(false);
    router.push(`/${locale}/upsell/compatibility_report`);
  }

  return (
    <main style={{ minHeight: "100dvh", padding: "24px 20px 160px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* Timer banner */}
        {timeLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 12,
              background: "rgba(245,200,66,0.08)",
              border: "1px solid rgba(245,200,66,0.25)",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 14 }}>⏱</span>
            <span style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>
              Bu fiyat sona eriyor: <strong>{formatTime(timeLeft)}</strong>
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.25,
          marginBottom: 8,
          color: "var(--text-primary)",
        }}>
          Kişisel yüz analizi raporun hazır
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
          Tam raporunu aç, 14 bölgeyi keşfet.
        </p>

        {/* Plan selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {plans.map((plan) => (
            <motion.button
              key={plan.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlanId(plan.id)}
              style={{
                width: "100%",
                borderRadius: 18,
                border: `2px solid ${selectedPlanId === plan.id ? "var(--brand)" : "var(--border-mid)"}`,
                background: selectedPlanId === plan.id ? "rgba(124,92,252,0.1)" : "rgba(124,92,252,0.03)",
                padding: "16px 18px",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "border-color 0.18s, background 0.18s",
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: -11,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, var(--brand), var(--brand-dark))",
                  borderRadius: 999,
                  padding: "3px 12px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}>
                  EN POPÜLER
                </div>
              )}

              <div style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: `2px solid ${selectedPlanId === plan.id ? "var(--brand)" : "var(--border-mid)"}`,
                background: selectedPlanId === plan.id ? "var(--brand)" : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.18s",
              }}>
                {selectedPlanId === plan.id && (
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />
                )}
              </div>

              <div style={{ flex: 1, textAlign: "left" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                  {plan.name}
                </p>
                {plan.savingsLabel && (
                  <p style={{ fontSize: 11, color: "var(--brand-light)" }}>{plan.savingsLabel}</p>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                {plan.trialPrice !== null ? (
                  <>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                      {sym}{plan.trialPrice}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      sonra {sym}{plan.renewalPrice} / {plan.renewalPeriod}
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                      {sym}{plan.renewalPrice}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{plan.renewalPeriod}</p>
                  </>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Legal text */}
        <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>
          {selectedPlan.trialDays > 0
            ? `"Raporumu Al" butonuna tıklayarak, ${selectedPlan.trialDays} günlük deneme için bugün ${sym}${selectedPlan.trialPrice} ödemeyi ve deneme sonunda iptal etmezsen aboneliğinin ${selectedPlan.renewalPeriod} ${sym}${selectedPlan.renewalPrice} olarak otomatik yenilenmesini kabul edersin. Banka ekstrende SIMAFZM.COM olarak görünür.`
            : `"Raporumu Al" butonuna tıklayarak, aboneliğinin ${selectedPlan.renewalPeriod} ${sym}${selectedPlan.renewalPrice} olarak otomatik yenilenmesini kabul edersin.`
          }
        </p>

        {/* Marifetname authority strip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          borderRadius: 14,
          background: "rgba(124,92,252,0.06)",
          border: "1px solid rgba(124,92,252,0.16)",
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>📖</span>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--text-primary)" }}>İbrahim Hakkı Hazretleri</strong> — Marifetname (1757) geleneğinden ilham alan{" "}
            <strong style={{ color: "var(--brand-light)" }}>ilm-i kıyafet</strong> yöntemi ile yapay zekanın birleşimi.
          </p>
        </div>

        {/* Features */}
        <div style={{
          borderRadius: 20,
          border: "1.5px solid var(--border)",
          background: "rgba(124,92,252,0.03)",
          padding: "20px",
          marginBottom: 28,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
            Neler Dahil
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FEATURES.map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
            Kullanıcı Yorumları
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {REVIEWS.map((r) => (
              <div key={r.author} style={{
                borderRadius: 16,
                border: "1.5px solid var(--border)",
                padding: "16px 18px",
                background: "rgba(124,92,252,0.03)",
              }}>
                <div style={{ display: "flex", gap: 1, marginBottom: 8 }}>
                  {[1,2,3,4,5].map((s) => <span key={s} style={{ fontSize: 12, color: "var(--gold)" }}>★</span>)}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 8 }}>
                  "{r.text}"
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.author} · {r.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
            Sık Sorulan Sorular
          </p>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{item.q}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 18, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, paddingBottom: 14 }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 18px",
          borderRadius: 16,
          background: "rgba(245,200,66,0.06)",
          border: "1px solid rgba(245,200,66,0.2)",
          marginBottom: 32,
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>🛡️</span>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--gold)" }}>7 gün iade garantisi.</strong> Memnun kalmazsan sorgulamadan geri ödüyoruz.
          </p>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Simaloji · simafzm.com · destek@simafzm.com<br />
          Kullanım Koşulları · Gizlilik Politikası · İade Politikası
        </p>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 20px",
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        background: "rgba(247,245,255,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: "100%",
              padding: "17px 0",
              borderRadius: 16,
              background: loading ? "rgba(124,92,252,0.4)" : "linear-gradient(135deg, #7C5CFC, #5B3FD4)",
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              color: "white",
              cursor: loading ? "wait" : "pointer",
              boxShadow: loading ? "none" : "0 8px 32px rgba(124,92,252,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            ) : (
              `Raporumu Al — ${selectedPlan.trialPrice !== null ? `${sym}${selectedPlan.trialPrice}` : `${sym}${selectedPlan.renewalPrice}`}`
            )}
          </motion.button>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
            İstediğin zaman iptal et · Güvenli ödeme
          </p>
        </div>
      </div>

      {/* Exit intent modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "flex-end",
              zIndex: 200,
              padding: "0 16px 24px",
            }}
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 480,
                margin: "0 auto",
                borderRadius: 24,
                background: "var(--surface)",
                border: "1.5px solid var(--border-mid)",
                padding: "28px 24px",
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: "var(--text-primary)" }}>
                Bekle! Sana özel bir teklifimiz var
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
                Bu sayfadan çıkmadan önce 7 günlük denemeyi sadece {sym}{pricing.exitOffer.discountedTrialPrice} ile başlatabilirsin.
              </p>
              <button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "16px 0",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #7C5CFC, #5B3FD4)",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "white",
                  cursor: "pointer",
                  marginBottom: 10,
                }}
              >
                İndirimli Teklifi Kullan
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                style={{ width: "100%", padding: "12px 0", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 14, cursor: "pointer" }}
              >
                Hayır, teşekkürler
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
