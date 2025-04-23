// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,         // Use 587 for TLS (STARTTLS)
  secure: false,     // false since STARTTLS uses upgrade from plain to encrypted
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendConfirmationEmail(to: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Thanks for subscribing!",
    html: `<h1>Thank you for subscribing!</h1><p>We will notify you when we launch.</p>`,
  });
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Here you would normally save the email to DB or file...

    // Send confirmation email after storing subscriber
    await sendConfirmationEmail(email);

    return NextResponse.json({ message: "Subscribed and email sent!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}