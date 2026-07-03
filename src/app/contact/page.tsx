import type { Metadata } from "next";
import { Mail, MessageSquare, Send } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us | AIVideos - Free AI Generated Videos",
  description:
    "Get in touch with the AIVideos team. Have questions about our free AI videos or partnership requests? We'd love to hear from you.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl gradient-brand text-white">
          <MessageSquare size={24} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
          Get in Touch
        </h1>
        <p className="mt-3 text-muted">
          Have a question, feedback or a partnership idea? We&apos;d love to hear
          from you.
        </p>
      </div>

      <form className="mt-10 space-y-4 rounded-3xl glass p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              required
              placeholder="Your name"
              className="w-full rounded-xl border border-app bg-soft px-4 py-3 text-sm outline-none focus:border-brand-400"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-xl border border-app bg-soft px-4 py-3 text-sm outline-none focus:border-brand-400"
            />
          </Field>
        </div>
        <Field label="Message">
          <textarea
            required
            rows={5}
            placeholder="How can we help?"
            className="w-full resize-none rounded-xl border border-app bg-soft px-4 py-3 text-sm outline-none focus:border-brand-400"
          />
        </Field>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand py-3 font-semibold text-white"
        >
          <Send size={17} /> Send Message
        </button>
      </form>

      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
        <Mail size={15} /> hello@aivideos.app
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
