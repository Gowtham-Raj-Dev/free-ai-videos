import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Free AI Videos",
  description: "Refund policy for premium downloads.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-0 sm:px-6">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Refund Policy</h1>
      <div className="prose prose-invert prose-brand max-w-none text-muted">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>Digital Goods</h2>
        <p>Because we offer digital goods (downloadable ZIP files containing videos), we generally do not offer refunds once the transaction is complete and the download link has been provided.</p>

        <h2>Exceptions</h2>
        <p>We will issue a refund or provide an alternative download method if:</p>
        <ul>
          <li>The ZIP file is completely corrupted and we are unable to provide a working replacement.</li>
          <li>You were charged multiple times for the same transaction due to a technical error on our end.</li>
        </ul>

        <h2>Contacting Us for Issues</h2>
        <p>If you experience any issues with your download, please reach out to us within 7 days of your purchase with your Transaction Reference ID (UTR). We will do our best to resolve the issue promptly.</p>
      </div>
    </div>
  );
}
