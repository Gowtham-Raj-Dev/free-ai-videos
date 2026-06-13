import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Free AI Videos",
  description: "Terms and conditions for using Free AI Videos platform.",
};

export default function TermsConditionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-0 sm:px-6">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
      <div className="prose prose-invert prose-brand max-w-none text-muted">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use of Content</h2>
        <p>The videos provided on our platform are AI-generated. While they are free to download and use, they are provided "as-is" without any warranties. We hold no liability for how you choose to use the generated content.</p>
        
        <h2>3. Purchases and Premium Downloads</h2>
        <p>If you purchase a premium ZIP download, you agree to provide accurate payment information. All digital purchases are subject to our Refund Policy.</p>
        
        <h2>4. User Conduct</h2>
        <p>You agree not to use the website in a way that may impair its performance, corrupt the content, or otherwise reduce the overall functionality of the website.</p>
        
        <h2>5. Modifications</h2>
        <p>We reserve the right to change these conditions from time to time as we see fit and your continued use of the site will signify your acceptance of any adjustment to these terms.</p>
      </div>
    </div>
  );
}
