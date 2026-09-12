import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-content flex min-h-[60dvh] flex-col items-center justify-center text-center">
      <p className="font-serif text-8xl font-medium text-accent">404</p>
      <p className="mt-4 text-lg text-muted-foreground">
        Looks like this page disappeared into the void.
      </p>
      <Link href="/" className="link-underline mt-8 text-base font-medium text-foreground">
        Back home
      </Link>
    </div>
  );
}
