import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ContactForm } from "@/interfaces/ContactForm";

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// HTML email template
function generateEmailHTML(formData: ContactForm): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Contact Form Submission</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 40px 20px;
          text-align: center;
          border-bottom: 4px solid #4a9eff;
        }
        .logo {
          display: inline-block;
          margin-bottom: 20px;
        }
        .logo img {
          max-width: 200px;
          height: auto;
          display: block;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px 30px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #4a9eff;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #4a9eff;
        }
        .field {
          margin-bottom: 18px;
        }
        .field-label {
          font-weight: 600;
          color: #666;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }
        .field-value {
          color: #333;
          font-size: 15px;
          word-wrap: break-word;
          white-space: pre-wrap;
          line-height: 1.5;
        }
        .website-link {
          color: #4a9eff;
          text-decoration: none;
          font-weight: 500;
        }
        .website-link:hover {
          text-decoration: underline;
        }
        .message-content {
          background-color: #f9f9f9;
          border-left: 4px solid #4a9eff;
          padding: 15px;
          border-radius: 4px;
          margin-top: 8px;
        }
        .footer {
          background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
          padding: 25px 30px;
          text-align: center;
          color: #999;
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
        .footer-link {
          color: #4a9eff;
          text-decoration: none;
          font-weight: 500;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <a href="https://webequate.com" style="display: inline-block; text-decoration: none;">
              <img src="https://allensaliens.com/assets/logo-webequate-light.png" alt="WebEquate" />
            </a>
          </div>
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Submission Details</div>
            <div class="field">
              <span class="field-label">Website</span>
              <div class="field-value">
                <a href="https://allensaliens.com" class="website-link">AllensAliens.com</a>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="field">
              <span class="field-label">Name</span>
              <div class="field-value">${formData.name}</div>
            </div>
            <div class="field">
              <span class="field-label">Email</span>
              <div class="field-value">
                <a href="mailto:${formData.email}" class="website-link">${formData.email}</a>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Subject</span>
              <div class="field-value">${formData.subject}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Message</div>
            <div class="message-content">
              ${formData.message}
            </div>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">This email was sent from <strong>AllensAliens.com</strong> contact form.</p>
          <p style="margin: 0;">Powered by <a href="https://webequate.com" class="footer-link">WebEquate</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Plain text email template
function generatePlainText(formData: ContactForm): string {
  return `
Website Contact Form Submission
================================

Website: https://allensaliens.com
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
  `.trim();
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed." },
      { status: 405 }
    );
  }

  try {
    const formData: ContactForm = await request.json();

    // Check honeypot field
    if (formData.website) {
      return NextResponse.json(
        { message: "Invalid submission." },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM || "WebEquate <webequate@gmail.com>",
      to: process.env.EMAIL_TO,
      cc: process.env.EMAIL_CC,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: generateEmailHTML(formData),
      text: generatePlainText(formData),
      replyTo: formData.email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      {
        message: "Error sending email.",
        error: error.message || JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
