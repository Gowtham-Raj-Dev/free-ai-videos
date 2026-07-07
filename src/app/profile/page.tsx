"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Trash2,
  FolderOpen,
  User as UserIcon,
  LogOut,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import { useHistory, usePdfDownloads } from "@/hooks/use-collection";
import { useAuth } from "@/context/auth-context";
import { CATEGORIES } from "@/lib/categories";
import { assetPath } from "@/lib/utils";

export default function ProfilePage() {
  const { user, loading: authLoading, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();
  
  const history = useHistory();
  const pdfDownloads = usePdfDownloads();
  const [showEmailModalCategory, setShowEmailModalCategory] = useState<string | null>(null);
  
  // Auth Form states
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Form handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      if (isRegister) {
        if (!name) throw new Error("Please enter your name.");
        await registerWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setFormError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError("");
    setFormLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setFormError(err.message || "Google Sign-In failed.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-400" size={36} />
      </div>
    );
  }

  // LOGGED OUT VIEW - Show Auth Gate
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-400">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isRegister ? "Create your Account" : "Welcome Back"}
            </h1>
            <p className="mt-1.5 text-xs text-muted">
              {isRegister
                ? "Sign up to sync your download history across all devices."
                : "Log in to access your saved favorites and downloads."}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted/60">
                    <UserIcon size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/40 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted/60">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/40 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted/60">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/40 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {formError && (
              <p className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="flex w-full cursor-pointer items-center justify-center rounded-2xl gradient-brand py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {formLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <span className="absolute w-full border-t border-black/10 dark:border-white/5" />
            <span className="relative bg-app px-3 text-[10px] uppercase tracking-wider text-muted">
              Or continue with
            </span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={formLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <p className="mt-6 text-center text-xs text-muted">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setFormError("");
              }}
              className="font-semibold text-brand-400 hover:underline"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW - Dashboard / Library
  const pdfList = pdfDownloads.ids
    .map((slug) => CATEGORIES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const folderBundles = CATEGORIES.filter((c) => c.kind === "folder");
  const hasMegaBundle = folderBundles.length > 0 && folderBundles.every((b) => pdfDownloads.ids.includes(b.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Premium Dashboard User Profile Section */}
      <div className="mb-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 p-6 backdrop-blur-xl shadow-lg dark:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-white shadow-xl shadow-brand-500/20 font-bold text-2xl uppercase">
            {user.displayName ? user.displayName.slice(0, 2) : user.email?.slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {user.displayName || "User Dashboard"}
            </h2>
            <p className="text-sm text-muted">{user.email}</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/10">
                <ShieldCheck size={11} /> Cloud Synced Account
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium text-brand-400 border border-brand-500/10">
                <Download size={11} /> {history.ids.length} Videos Downloaded
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/10 self-start md:self-center"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your Bundles
          </h1>
          {pdfDownloads.ready && pdfDownloads.ids.length > 0 && (
            <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-400 border border-brand-500/10">
              {pdfDownloads.ids.length}
            </span>
          )}
        </div>
        {pdfDownloads.ids.length > 0 && (
          <button
            onClick={pdfDownloads.clear}
            className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-sm text-muted transition hover:text-accent-2"
          >
            <Trash2 size={15} /> Clear All
          </button>
        )}
      </header>

      {pdfDownloads.ready && pdfList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center text-muted">
          <FileText size={44} className="opacity-50" />
          <p>No PDF bundles purchased or downloaded yet.</p>
          <Link
            href="/categories"
            className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/10 transition hover:scale-[1.02]"
          >
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Highlighted Mega Bundle Card if purchased */}
          {hasMegaBundle && (
            <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-50/80 via-purple-50/50 to-white dark:from-brand-700/20 dark:via-accent/10 dark:to-black p-6 shadow-xl backdrop-blur-xl transition hover:border-brand-500/50">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 dark:text-brand-400 border border-black/10 dark:border-brand-500/30">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-brand-500/10 dark:bg-brand-500/20 px-2 py-0.5 text-[9px] font-bold text-black dark:text-brand-300 uppercase border border-black/10 dark:border-brand-500/30 mb-1">
                      Mega Bundle Owned
                    </span>
                    <h3 className="text-lg font-black text-foreground">
                      Mega Bundle — All 12 Collections PDF
                    </h3>
                    <p className="text-xs text-muted">
                      Includes all 12 category folder direct download links in one single document.
                    </p>
                  </div>
                </div>
                <a
                  href={assetPath("/bundles/mega-bundle.pdf")}
                  download="mega-bundle.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-brand-500/20 transition hover:scale-[1.03] active:scale-95 cursor-pointer self-start sm:self-center"
                >
                  <Download size={13} /> Download Mega PDF
                </a>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pdfList.map((category) => {
              return (
                <div
                  key={category.slug}
                  className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm dark:shadow-xl backdrop-blur-xl transition hover:border-brand-500/30 hover:shadow-lg"
                >
                  {/* Decorative glowing gradient */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />
                  
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 text-brand-500 dark:text-brand-400">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium text-black dark:text-brand-400 border border-black/10 dark:border-brand-500/10 mb-2">
                        PDF Bundle Purchased
                      </span>
                      <h3 className="truncate text-base font-bold text-foreground">
                        {category.name} PDF Bundle
                      </h3>
                      <p className="mt-1 text-xs text-foreground/80 dark:text-muted line-clamp-2">
                        Contains all {category.name} direct video download links and resources.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-black/10 dark:border-white/5 pt-4">
                    <span className="text-[11px] text-muted font-semibold">
                      Ready to Download
                    </span>
                    <a
                      href={assetPath(`/bundles/${category.slug}.pdf`)}
                      download={`${category.slug}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/10 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <Download size={13} />
                      Download PDF
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Coming soon placeholder */}
          <div className="mt-8 relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 p-8 text-center backdrop-blur-xl transition hover:bg-black/10 dark:hover:bg-white/10">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-500/10 text-brand-400">
              <Sparkles size={20} className="opacity-70" />
            </div>
            <h3 className="text-base font-bold text-foreground">More Bundles Coming Soon!</h3>
            <p className="mt-1 text-sm text-muted">
              Keep an eye out for exciting new bundles added directly to the store!
            </p>
            <Link href="/bundles" className="mt-4 rounded-full border border-brand-500/30 px-5 py-2 text-xs font-semibold text-brand-400 hover:bg-brand-500/10 transition">
              Explore Store
            </Link>
          </div>
        </div>
      )}

      {/* Floating Resource Delivery Confirmation Modal */}
      {showEmailModalCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-app p-6 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowEmailModalCategory(null)}
              className="absolute right-4 top-4 text-muted hover:text-foreground transition"
            >
              <X size={18} />
            </button>
            
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Resource Dispatched!
              </h3>
              <p className="mt-1.5 text-xs text-muted">
                Resource delivery confirmation for {showEmailModalCategory}
              </p>
            </div>

            <div className="space-y-4 text-sm text-muted/90 leading-relaxed mb-6">
              <p>
                We have compiled the latest high-speed direct download resources for <strong>{showEmailModalCategory}</strong>.
              </p>
              <p>
                The complete Google Drive folder access link has been sent directly to your registered email address <strong>{user.email}</strong>. The custom PDF file will be compiled and downloadable directly here shortly.
              </p>
            </div>

            <button
              onClick={() => setShowEmailModalCategory(null)}
              className="w-full rounded-2xl gradient-brand py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
