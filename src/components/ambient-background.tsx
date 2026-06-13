export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 -top-32 h-[42vh] w-[42vh] rounded-full bg-brand-500/25 blur-[100px] blob-1" />
      <div className="absolute right-[-10%] top-1/4 h-[38vh] w-[38vh] rounded-full bg-accent/25 blur-[110px] blob-2" />
      <div className="absolute bottom-[-10%] left-1/3 h-[40vh] w-[40vh] rounded-full bg-accent-2/20 blur-[120px] blob-1" />
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
        }}
      />
    </div>
  );
}
