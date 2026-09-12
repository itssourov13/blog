import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = subscribeSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Enter a valid email address." },
      { status: 400 }
    );
  }

  // Not wired to a real provider yet. When you pick one (Resend, ConvertKit,
  // Mailchimp, Buttondown, ...), forward result.data.email to its API here
  // using NEWSLETTER_API_KEY / NEWSLETTER_AUDIENCE_ID from the environment.
  // The NewsletterSubscriber model in prisma/schema.prisma is where a
  // database-backed version of this would persist the signup.
  console.log("Newsletter signup:", result.data.email);

  return NextResponse.json({ ok: true }, { status: 200 });
}
