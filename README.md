# Kapda - Opening Soon Subscription

This is the source code for the "Opening Soon" landing page of Kapda, allowing users to subscribe with their email and get notified when the site launches.

---

## Features

- Simple and elegant landing page UI with a logo and subscription form.
- Email subscription form with validation.
- Backend API route using Next.js App Router that:
  - Stores subscriber emails in Firebase Firestore.
  - Sends confirmation emails via SMTP (MailerSend).
- Error handling and user feedback for subscription attempts.

---

## Technologies Used

- **Frontend:** Next.js 13 (App Router), React, TypeScript, Tailwind CSS (optional, for styling)
- **Backend:** Next.js API Route (`app/api/subscribe/route.ts`)
- **Database:** Firebase Firestore
- **Email Service:** Nodemailer with MailerSend SMTP

---

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- Firebase project with Firestore enabled
- MailerSend account or other SMTP credentials

---

### Installation

1. Clone the repository:

```bash
git clone <https://github.com/H-sharma63/Kapda.gitl>
cd <kapda>

2. Install dependencies:
npm install
# or
yarn install

3. Create a .env.local file in the root directory and add the following environment variables:
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
