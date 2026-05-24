import type { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { env } = import.meta as {
    env?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  };
  const supabaseUrl = env?.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || '';

  const supabaseEnv = {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };

  return (
    <html lang="en">
      <head>
        <title>ODBS Dental Booking</title>
        <script
          // Inject browser-safe env for /public static pages.
          // These static pages load /supabase-browser.js which reads window.__SUPABASE_ENV__.
          dangerouslySetInnerHTML={{
            __html: `window.__SUPABASE_ENV__ = ${JSON.stringify(supabaseEnv)};`,
          }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

