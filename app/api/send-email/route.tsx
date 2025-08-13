import { NextResponse } from "next/server";
import type { ContactForm } from "@/interfaces/ContactForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function sendEmail(formData: ContactForm) {
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
    const formData = (await request.json()) as ContactForm;
    await sendEmail(formData);
    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending email." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
