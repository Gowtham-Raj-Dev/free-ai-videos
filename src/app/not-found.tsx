import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <p className="gradient-text text-7xl font-extrabold">404</p>
      <h1 className="mt-4 text-2xl font-bold">Video not found</h1>
      <p className="mt-2 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-7 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 font-semibold text-white"
        >
          <Home size={17} /> Go Home
        </Link>
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold"
        >
          <Search size={17} /> Browse Videos
        </Link>
      </div>
    </div>
  );
}
