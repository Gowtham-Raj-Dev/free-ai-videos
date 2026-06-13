import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Free AI Videos",
  description: "Privacy Policy for Free AI Videos platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-0 sm:px-6">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      <div className="prose prose-invert prose-brand max-w-none text-muted">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Information We Collect</h2>
        <p>We do not collect personal information unless you explicitly provide it (e.g., when contacting us or using premium features). For payments, we use a secure third-party gateway, and we only store transaction reference IDs to verify downloads.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>Any information collected is solely used to provide and improve our services, process your transactions, and respond to your inquiries.</p>
        
        <h2>3. Cookies and Analytics</h2>
        <p>We may use basic analytics to understand website traffic. We do not use intrusive tracking cookies.</p>
        
        <h2>4. Third-Party Services</h2>
        <p>Our website uses third-party payment gateways. Their use of your personal data is governed by their respective privacy policies.</p>
        
        <h2>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us via our Contact Us page.</p>
      </div>
    </div>
  );
}
