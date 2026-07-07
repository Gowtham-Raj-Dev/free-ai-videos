"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  X,
  Mail,
  Zap,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { usePdfDownloads } from "@/hooks/use-collection";
import { assetPath } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BundlesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { push, pushMany } = usePdfDownloads();
  const [purchasingSlug, setPurchasingSlug] = useState<string | null>(null);
  const [demoModalSlug, setDemoModalSlug] = useState<string | null>(null);
  const [isMegaBundleModal, setIsMegaBundleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter categories that represent folder bundles (exactly 12 categories)
  const bundles = CATEGORIES.filter((c) => c.kind === "folder");

  const handleBuyClick = (slug: string) => {
    setDemoModalSlug(slug);
    setIsMegaBundleModal(false);
  };

  const handleBuyMegaBundleClick = () => {
    setDemoModalSlug("mega-bundle");
    setIsMegaBundleModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!user) {
      alert("Please sign in first to purchase premium bundles.");
      router.push("/profile");
      return;
    }

    const currentSlug = isMegaBundleModal ? "mega-bundle" : demoModalSlug;
    if (!currentSlug) return;

    setPurchasingSlug(currentSlug);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load payment gateway. Please check your internet connection.");
        setPurchasingSlug(null);
        return;
      }

      const amount = isMegaBundleModal ? 99 : 9;
      const apiHost = process.env.NEXT_PUBLIC_PAYMENT_API_URL || "";
      
      const res = await fetch(`${apiHost}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR" }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const { order } = await res.json();

      const bundleName = isMegaBundleModal 
        ? "Mega Bundle (All 12 Collections)" 
        : bundles.find((b) => b.slug === demoModalSlug)?.name + " Bundle";

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_T1ZGJz5iR0rxLf",
        amount: order.amount,
        currency: order.currency,
        name: "AIVideos by CodeLove",
        description: `Purchase ${bundleName}`,
        order_id: order.id,
        prefill: {
          email: user.email || "",
        },
        theme: {
          color: "#a855f7", // brand purple
        },
        handler: async (response: any) => {
          setPurchasingSlug(currentSlug);
          try {
            const verifyRes = await fetch(`${apiHost}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment signature verification failed");
            }

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (isMegaBundleModal) {
                const allSlugs = bundles.map((b) => b.slug);
                pushMany(allSlugs);
              } else if (demoModalSlug) {
                push(demoModalSlug);
              }
              setDemoModalSlug(null);
              setShowSuccessModal(true);
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Error verifying payment signature. Please contact support.");
          } finally {
            setPurchasingSlug(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPurchasingSlug(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to initialize Razorpay checkout. Please try again.");
      setPurchasingSlug(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Page Header */}
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400 border border-brand-500/10 mb-4">
          <Sparkles size={12} /> Direct Downloads
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          Premium Video Bundles
        </h1>
        <p className="mt-4 text-lg text-muted">
          Access complete high-definition video collections with direct Google Drive links inside.
        </p>
      </header>

      {/* Featured Mega Bundle Banner */}
      <div className="mb-12 relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-50/80 via-purple-50/50 to-white dark:from-brand-700/20 dark:via-accent/10 dark:to-black p-8 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto text-left transition hover:border-brand-500/50 animate-fade-in">
        {/* Glowing ambient background */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black dark:text-brand-300 border border-black/10 dark:border-brand-500/30 mb-3 animate-pulse">
              <Zap size={11} /> Best Value Offer
            </span>
            <h2 className="text-2xl font-black text-foreground md:text-3xl tracking-tight">
              Mega Bundle — Get All 12 Collections!
            </h2>
            <p className="mt-2 text-sm text-muted/90 max-w-2xl leading-relaxed">
              Unlock the entire library of 5,000+ premium AI video assets across all 12 categories. Includes lifetime updates and instant Google Drive folder access.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">✅ 12 PDF Downloads</span>
              <span className="flex items-center gap-1">✅ Unlimited Access</span>
              <span className="flex items-center gap-1">✅ Lifetime Updates</span>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-start md:items-end gap-2 bg-white dark:bg-black/40 border border-black/10 dark:border-white/5 p-5 rounded-2xl md:min-w-[180px]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-muted/80 dark:text-muted/60 line-through">Rs. 499</span>
              <span className="text-2xl font-black text-black dark:text-brand-400">Rs. 99</span>
            </div>
            <span className="text-[10px] text-muted">One-time payment</span>
            <button
              onClick={handleBuyMegaBundleClick}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full gradient-brand px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-brand-500/20 transition hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <Zap size={13} /> Buy Mega Bundle
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle) => {
          const isFree = bundle.slug === "study-reels";

          return (
            <div
              key={bundle.slug}
              className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 p-6 shadow-sm dark:shadow-xl backdrop-blur-xl transition duration-300 flex flex-col justify-between hover:border-brand-500/30 hover:shadow-lg group"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors" />

              <div>
                <div className="flex items-start gap-4">
                  {/* Small thumbnail image */}
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-500/10 bg-brand-500/5 text-brand-400">
                    <img
                      src={assetPath(`/images/bundles/${bundle.slug}.jpg`)}
                      alt={`${bundle.name} icon`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        // Show FileText icon as fallback
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border bg-brand-500/5 dark:bg-brand-500/10 text-black dark:text-brand-400 border-black/10 dark:border-brand-500/10 mb-2">
                      {isFree ? "Free Bundle" : "Rs. 9 Bundle"}
                    </span>
                    <h3 className="truncate text-base font-bold text-foreground">
                      {bundle.name} Bundle
                    </h3>
                    <p className="mt-1.5 text-xs text-foreground/80 dark:text-muted/70 line-clamp-3">
                      {bundle.description || `Instant access to all ${bundle.name} direct video download links and resources.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-black/10 dark:border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-muted uppercase tracking-wider font-semibold">Price</span>
                  {isFree ? (
                    <span className="text-base font-extrabold text-emerald-500 dark:text-emerald-400">Free</span>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-muted/80 dark:text-muted/40 line-through">Rs. 49</span>
                      <span className="text-base font-extrabold text-black dark:text-brand-400">Rs. 9</span>
                    </div>
                  )}
                </div>

                {isFree ? (
                  <a
                    href={assetPath(`/bundles/${bundle.slug}.pdf`)}
                    download={`${bundle.slug}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95 cursor-pointer animate-fade-in"
                  >
                    <Download size={13} /> Download PDF
                  </a>
                ) : (
                  <button
                    onClick={() => handleBuyClick(bundle.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Buy Bundle
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Coming soon placeholder */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 p-8 text-center backdrop-blur-xl transition hover:bg-black/10 dark:hover:bg-white/10 min-h-[250px]">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-500/10 text-brand-400">
            <Sparkles size={24} className="opacity-70" />
          </div>
          <h3 className="text-lg font-bold text-foreground">More Bundles Coming Soon!</h3>
          <p className="mt-2 text-sm text-muted max-w-xs mx-auto">
            We are constantly working on bringing you more high-quality AI video resources. Stay tuned!
          </p>
        </div>
      </div>

      {/* Success Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-app p-6 shadow-2xl text-center animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>
            
            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Purchase Successful!
            </h3>
            
            <p className="text-sm text-muted mb-6">
              Thank you for your purchase! All unlocked PDF bundles are now synced and ready for download under **"Your Bundles"** in your Profile Library.
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                className="w-full rounded-2xl gradient-brand py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:scale-[1.01] active:scale-95"
              >
                Go to My Library
              </Link>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 py-2.5 text-sm font-semibold transition hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 cursor-pointer text-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Checkout Modals */}
      {demoModalSlug && (() => {
        const isMega = demoModalSlug === "mega-bundle";
        const bundleName = isMega ? "Mega Bundle (All 12 Collections)" : bundles.find((b) => b.slug === demoModalSlug)?.name + " Bundle";
        const price = isMega ? "Rs. 99" : "Rs. 9";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in">
            <div 
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-app p-6 shadow-2xl animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-400">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Purchase {bundleName}
                </h3>
                <p className="mt-1.5 text-xs text-muted">
                  Secure Razorpay Payment
                </p>
              </div>

              <div className="space-y-4 rounded-2xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/5 p-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{bundleName} PDF</span>
                  <span className="font-semibold text-foreground">{price}</span>
                </div>
                <div className="border-t border-black/10 dark:border-white/5 my-2 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-foreground">Total Payable</span>
                  <span className="text-black dark:text-brand-400">{price}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDemoModalSlug(null)}
                  className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 cursor-pointer text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  disabled={purchasingSlug === demoModalSlug}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl gradient-brand py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {purchasingSlug === demoModalSlug ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    `Pay ${price}`
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
