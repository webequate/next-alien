import { NextResponse } from "next/server";
import type { ContactForm } from "@/interfaces/ContactForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ensureEnv() {
  const required = [
    "EMAIL_FROM",
    "EMAIL_TO",
    // optional: EMAIL_CC,
    "GMAIL_USER",
    "GMAIL_APP_PASS",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    const msg = `Missing environment variables: ${missing.join(", ")}`;
    throw new Error(msg);
  }
}

function validateBody(body: any): asserts body is ContactForm {
  if (!body || typeof body !== "object") throw new Error("Invalid payload");
  const fields: Array<keyof ContactForm> = [
    "name",
    "email",
    "subject",
    "message",
  ];
  const missing = fields.filter((f) => !body[f] || typeof body[f] !== "string");
  if (missing.length) {
    throw new Error(`Missing fields: ${missing.join(", ")}`);
  }
}

async function sendEmail(formData: ContactForm) {
  ensureEnv();
  const { default: sendMail } = await import("@/emails");
  const { default: Contact } = await import("@/emails/Contact");

  await sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    cc: process.env.EMAIL_CC,
    subject: formData.subject,
    component: (
      <Contact
        name={formData.name}
        email={formData.email}
        subject={formData.subject}
        message={formData.message}
      />
    ),
    text: `
      Name: ${formData.name}
      Email: ${formData.email}
      Subject: ${formData.subject}
      Message: ${formData.message}
    `,
  });
}

export async function POST(request: Request) {
  try {
    const formData = (await request.json()) as unknown;
    validateBody(formData);
    await sendEmail(formData);
    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    const isDev = process.env.NODE_ENV !== "production";
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: isDev
          ? `Error sending email: ${details}`
          : "Error sending email.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
