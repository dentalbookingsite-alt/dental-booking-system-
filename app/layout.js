import "./globals.css";

export const metadata = {
  title: "ODBS Dental Booking",
  description: "Dental booking website",
};

export default function RootLayout({ children }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  return (
    <html lang="en">
      <head>
        <script
          // Inject browser-safe env for /public static pages.
          dangerouslySetInnerHTML={{
            __html: `window.__SUPABASE_ENV__ = {
  url: ${JSON.stringify(supabaseUrl)},
  anonKey: ${JSON.stringify(supabaseAnonKey)}
};`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}



