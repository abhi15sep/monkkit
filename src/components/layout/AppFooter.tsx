import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-border/50 py-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link href="/" className="hover:text-foreground transition-colors font-medium">
            MonkKit
          </Link>{" "}
          — Free developer tools by{" "}
          <a
            href="https://devops-monk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            DevOps Monk
          </a>
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/docs/api" className="hover:text-foreground transition-colors">API Docs</Link>
        </div>
      </div>
    </footer>
  );
}
