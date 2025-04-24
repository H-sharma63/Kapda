"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Subscribed successfully! Check your email.");
        setEmail("");
      } else {
        setMsg(data.error || data.message || "Subscription failed");
      }
    } catch {
      setMsg("Network error");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-24 px-6 bg-[#FCFBF6]">
      {/* Logo Section */}
      <section className="mb-16">
        <Image
          src="/logo.png" // Place your logo.svg file inside the public folder
          alt="Company Logo"
          width={60}
          height={60}
          className="mx-auto"
          priority={true}
        />
      </section>

      {/* Card Section */}
      <section className="bg-[#C8AD95] rounded-3xl max-w-lg w-full p-16 text-[#40475E] text-center">
        <h1 className="text-5xl font-serif font-semibold mb-6">Opening Soon</h1>
        <p className="mb-10 text-xl font-serif font-medium">
          Be the first one to know when we launch
        </p>
        <form onSubmit={handleSubmit} className="relative max-w-full">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-3xl border border-[#40475E] bg-[#C8AD95] px-8 py-5 pr-20 text-[#40475E] text-lg font-semibold placeholder-[#40475E] focus:outline-none focus:ring-2 focus:ring-[#40475E]"
            aria-label="Email"
          />
          <button
            type="submit"
            aria-label="Submit email"
            disabled={loading}
            className="absolute top-1/2 right-6 -translate-y-1/2 rounded-full text-[#40475E] hover:text-[#40475E]/80 focus:outline-none focus:ring-2 focus:ring-[#40475E]"
          >
            {loading ? (
              <svg
                className="h-8 w-8 animate-spin text-[#40475E]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-[#40475E]/90">{message}</p>}
      </section>
    </main>
  );
}
