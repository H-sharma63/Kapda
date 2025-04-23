// app/api/send-launch/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

const subscribersFile = path.join(process.cwd(), "subscribers.json");

async function sendLaunchEmail(email: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "We're Launching Soon!",
    html: `<h1>We're Launching Soon!</h1><p>Thank you for subscribing. Stay tuned for our launch!</p>`,
  });
}

export async function POST() {
  try {
    const data = await fs.readFile(subscribersFile, "utf-8");
    const subscribers: string[] = JSON.parse(data);

    // Send emails to all subscribers (serially here; for production use concurrency throttling)
    for (const email of subscribers) {
      await sendLaunchEmail(email);
    }

    return NextResponse.json(
      { message: `Launch email sent to ${subscribers.length} subscribers` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}