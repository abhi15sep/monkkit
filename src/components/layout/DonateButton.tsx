"use client";

export function DonateButton() {
  const url = process.env.NEXT_PUBLIC_DONATE_URL ?? "https://buymeacoffee.com";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm
                 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
    >
      ☕ <span className="hidden sm:inline">Support</span>
    </a>
  );
}
