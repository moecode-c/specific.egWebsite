export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="SPECIFIC"
          className="h-14 w-14 rounded-2xl shadow-glow"
        />
        <div className="text-sm font-semibold text-white/70">Loading...</div>
      </div>
    </div>
  );
}
