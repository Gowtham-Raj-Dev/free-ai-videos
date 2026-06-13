"use client";

import { useState } from "react";
import { Download, X, CheckCircle, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function ZipDownloadButton({
  categorySlug,
  categoryName,
}: {
  categorySlug: string;
  categoryName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [utr, setUtr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uniqueId, setUniqueId] = useState("");

  // You can change the UPI ID here directly. Example: "your_upi_id@okicici"
  const merchantUpiId = "rajgowtham474@okhdfcbank"; 
  const amount = "19";
  const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=FreeAIVideos&am=${amount}&tn=${uniqueId}&cu=INR`;

  const handleVerify = async () => {
    // Check if UTR is exactly 12 digits
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(utr)) {
      setError("Please enter a valid 12-digit UTR number (Numbers only)");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorySlug, utr, amount, uniqueId }),
      });

      if (!res.ok) {
        throw new Error("Failed to verify payment. Please try again.");
      }

      setSuccess(true);
      
      // Redirect to Google Drive
      const driveUrl = "https://drive.google.com/drive/folders/1Pe1NEzBO7Ap6FI2Hcg1rsRKfMLfAZPz3?usp=sharing";
      window.open(driveUrl, "_blank");
      
      // Close modal after a delay
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setUtr("");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setUniqueId(`ORD-${Date.now().toString().slice(-6)}`);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:opacity-95"
      >
        <Download className="w-5 h-5" />
        Download {categoryName} as ZIP
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-muted hover:bg-white/10 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Premium Download</h3>
              <p className="text-muted text-sm mb-6">
                Please pay <strong className="text-white">₹{amount}</strong> to instantly download the entire category in a ZIP file.
                <br />
                <span className="text-xs text-brand-400">Order ID: {uniqueId}</span>
              </p>

              <div className="mx-auto bg-white p-4 rounded-xl inline-block mb-6">
                <QRCodeSVG value={upiUrl} size={180} />
              </div>

              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-muted mb-1">
                    Enter Transaction ID (12-digit UTR)
                  </label>
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 312345678901"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-left">{error}</p>}

                <button
                  onClick={handleVerify}
                  disabled={isLoading || success}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-lg gradient-brand px-4 py-3 font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:opacity-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verified! Opening Drive...
                    </>
                  ) : (
                    "Verify & Download"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
