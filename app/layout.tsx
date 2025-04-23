// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Opening Soon',
  description: 'Stay tuned for launch',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}