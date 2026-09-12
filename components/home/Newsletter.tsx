"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Try again in a moment.");
      }

      setStatus("success");
      setMessage("You're subscribed. Thanks for reading.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <section className="border-t border-border">
      <div className="container-content flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div>
          <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
            Get the occasional note.
          </h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Technical writing, research, and experiments. No spam.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm shrink-0" noValidate>
          <div className="flex gap-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={status === "loading"}
              className="w-full border-b border-border bg-transparent px-1 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 border-b border-foreground px-1 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {message && (
            <p
              className={cn(
                "mt-3 text-sm",
                status === "error" ? "text-danger" : "text-muted-foreground"
              )}
              role="status"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
