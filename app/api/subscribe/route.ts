import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { initializeApp, getApps, getApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
};

let app;

let firestore: Firestore | undefined;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  firestore = getFirestore(app);
} catch (err) {
  console.error("Firebase initialization failed:", err);
}

const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

async function sendConfirmationEmail(to: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to,
      subject: "Thanks for subscribing on Kapda!",
      html: `<h1>Thank you for subscribing!</h1><p>We will notify you when we launch.</p>`,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("Received email:", email);

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!firestore) {
      console.error("No Firestore instance");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const subscriberRef = doc(firestore, "subscribers", email);
    const docSnapshot = await getDoc(subscriberRef);

    if (docSnapshot.exists()) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 409 });
    }

    await setDoc(subscriberRef, { email });
    await sendConfirmationEmail(email);

    return NextResponse.json({ message: "Subscribed and email sent!" }, { status: 201 });
  } catch (error) {
    console.error("API POST error:", error, (error as any)?.stack || "");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
