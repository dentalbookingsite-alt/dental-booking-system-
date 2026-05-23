import "./globals.css";

export const metadata = {
  title: "ODBS Dental Booking",
  description: "Dental booking website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__SUPABASE_ENV__ = {
  url: ${JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || '')},
  anonKey: ${JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')}
};`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}


