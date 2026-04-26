import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nodemailer before importing the route so the transport is never created
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({}),
    })),
  },
}));

import { POST } from "@/app/api/send-email/route";

const env = {
  GMAIL_USER: "test@gmail.com",
  GMAIL_APP_PASS: "app-pass",
  EMAIL_FROM: "test@gmail.com",
  EMAIL_TO: "owner@example.com",
};

const makeRequest = (body: Record<string, unknown>) =>
  new Request("http://localhost/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const validBody = {
  name: "Allen",
  email: "allen@example.com",
  subject: "Hello",
  message: "Test message",
  website: "",
};

beforeEach(() => {
  Object.assign(process.env, env);
});

describe("POST /api/send-email — honeypot", () => {
  it("returns 200 success (silently discards) when the honeypot field is filled", async () => {
    const res = await POST(makeRequest({ ...validBody, website: "http://spam.com" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Email sent successfully!");
  });

  it("does NOT send an email when the honeypot is filled", async () => {
    const nodemailer = await import("nodemailer");
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.default.createTransport).mockReturnValue({ sendMail } as never);

    await POST(makeRequest({ ...validBody, website: "spam" }));
    expect(sendMail).not.toHaveBeenCalled();
  });
});

describe("POST /api/send-email — validation", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ website: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid email address", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 200 and sends email for a valid submission", async () => {
    const nodemailer = await import("nodemailer");
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.default.createTransport).mockReturnValue({ sendMail } as never);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledOnce();
  });
});
