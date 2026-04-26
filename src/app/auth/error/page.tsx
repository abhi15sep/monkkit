import Link from "next/link";

export const metadata = { title: "Auth Error | MonkKit" };

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">Sign in failed</h1>
        <p className="text-muted-foreground text-sm">
          Something went wrong during sign in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block text-sm text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
