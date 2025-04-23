// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

const subscribersFile = path.join(process.cwd(), "subscribers.json");

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

    // Read existing subscribers
    let subscribers: string[] = [];
    try {
      const data = await fs.readFile(subscribersFile, "utf-8");
      subscribers = JSON.parse(data);
    } catch (err) {
      // File might not exist yet, ignore error
    }

    // Prevent duplicate subscriptions
    if (subscribers.includes(email)) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 409 });
    }

    // Save new subscriber
    subscribers.push(email);
    await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2));

    // Send confirmation email
    await sendConfirmationEmail(email);

    return NextResponse.json({ message: "Subscribed and email sent!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}