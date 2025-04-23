import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory store (resets on every deployment)
const tempSubscribers = new Set<string>();

const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendConfirmationEmail(to: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Thanks for subscribing!",
      html: `<h1>Thank you for subscribing!</h1><p>We will notify you when we launch.</p>`,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if the email is already in the in-memory store
    if (tempSubscribers.has(email)) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 409 });
    }

    // Add email to in-memory store
    tempSubscribers.add(email);

    // Send confirmation email
    await sendConfirmationEmail(email);

    return NextResponse.json({ message: "Subscribed and email sent!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
