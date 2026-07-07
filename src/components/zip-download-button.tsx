"use client";

import { useState } from "react";
import { Download, FileText, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { assetPath } from "@/lib/utils";
import { usePdfDownloads } from "@/hooks/use-collection";
import { useAuth } from "@/context/auth-context";
import { CATEGORIES } from "@/lib/categories";

import { useRouter } from "next/navigation";

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

export function ZipDownloadButton({
  categorySlug,
  categoryName,
}: {
  categorySlug: string;
  categoryName: string;
}) {
  const router = useRouter();
  const { ids, push, ready } = usePdfDownloads();
  const { user } = useAuth();
  
  const [purchasing, setPurchasing] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const isPurchased = ready && ids.includes(categorySlug);

  const handleBuyClick = () => {
    setShowDemoModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!user) {
      alert("Please sign in first to purchase premium bundles.");
      router.push("/profile");
      return;
    }

    setPurchasing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load payment gateway. Please check your internet connection.");
        setPurchasing(false);
        return;
      }

      const amount = 9;
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_T1ZGJz5iR0rxLf",
        amount: order.amount,
        currency: order.currency,
        name: "AIVideos by CodeLove",
        description: `Purchase ${categoryName} Bundle`,
        order_id: order.id,
        prefill: {
          email: user.email || "",
        },
        theme: {
          color: "#a855f7", // brand purple
        },
        handler: async (response: any) => {
          setPurchasing(true);
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
              push(categorySlug);
              setShowDemoModal(false);
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Error verifying payment signature. Please contact support.");
          } finally {
            setPurchasing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPurchasing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to initialize Razorpay checkout. Please try again.");
      setPurchasing(false);
    }
  };

  // If purchased, show the download card
  if (isPurchased) {
    const isAnimal = categorySlug === "ai-animal-videos";
    const categoryDef = CATEGORIES.find((c) => c.slug === categorySlug);
    const rawUrl = categoryDef?.downloadUrl;
    const downloadUrl = rawUrl && (isAnimal ? assetPath(rawUrl) : rawUrl);

    return (
      <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-black/40 p-6 shadow-xl backdrop-blur-xl max-w-md w-full text-left transition hover:shadow-brand-500/5">
        {/* Glow effect */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/15 blur-2xl" />

        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/10 mb-2">
              <ShieldCheck size={11} /> Purchased & Unlocked
            </span>
            <h3 className="truncate text-base font-bold text-foreground">
              {categoryName} PDF Bundle
            </h3>
            <p className="mt-1 text-xs text-muted line-clamp-2">
              You own this bundle. Access the direct resource links below.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="text-[11px] text-muted">
            Ready to Download
          </span>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Download size={13} />
              {isAnimal ? "Download PDF" : "Open Google Drive"}
            </a>
          ) : (
            <button
              onClick={() => alert(`Thank you! The complete direct download links and resources for ${categoryName} have been dispatched to your email address.`)}
              className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Download size={13} />
              Download PDF
            </button>
          )}
        </div>
      </div>
    );
  }

  // If not purchased, show the purchase card
  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl backdrop-blur-xl max-w-md w-full text-left transition hover:border-brand-500/20 hover:shadow-2xl">
        {/* Glow effect */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />

        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/10">
            <FileText size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium text-brand-400 border border-brand-500/10 mb-2">
              <Sparkles size={11} className="text-brand-400" /> Premium Bundle
            </span>
            <h3 className="truncate text-base font-bold text-foreground">
              {categoryName} PDF Bundle
            </h3>
            <p className="mt-1 text-xs text-muted line-clamp-2">
              Download all {categoryName} direct Google Drive links and video assets in one file.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted/60 uppercase tracking-wider">Lifetime Access</span>
            <span className="text-sm font-extrabold text-foreground">Rs. 9</span>
          </div>
          <button
            onClick={handleBuyClick}
            className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            Buy Bundle
          </button>
        </div>
      </div>

      {/* Demo Checkout Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-app p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-400">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Purchase {categoryName} Bundle
              </h3>
              <p className="mt-1.5 text-xs text-muted">
                Secure Razorpay Payment
              </p>
            </div>

            <div className="space-y-4 rounded-2xl bg-black/40 border border-white/5 p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{categoryName} PDF Bundle</span>
                <span className="font-semibold text-foreground">Rs. 9</span>
              </div>
              <div className="border-t border-white/5 my-2 pt-2 flex justify-between text-sm font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-brand-400">Rs. 9</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDemoModal(false)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold transition hover:bg-white/10 active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={purchasing}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl gradient-brand py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {purchasing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Pay Rs. 9"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
