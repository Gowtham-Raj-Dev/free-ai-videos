import { NextResponse } from "next/server";
import { logPaymentToSheet } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categorySlug, utr, amount, uniqueId } = body;

    if (!utr) {
      return NextResponse.json({ error: "UTR is required" }, { status: 400 });
    }

    // Attempt to log to google sheets using service account (if configured)
    await logPaymentToSheet(categorySlug, utr, amount, uniqueId);

    // Attempt to log using Google Apps Script Webhook (if configured)
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          timestamp: new Date().toISOString(),
          categorySlug, 
          utr, 
          amount,
          uniqueId,
          status: "Pending Verification"
        }),
      }).catch(err => console.error("Webhook fetch error:", err));
    }

    // Return success to the client
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error verifying payment:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
