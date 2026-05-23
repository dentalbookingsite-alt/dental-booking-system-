import "./globals.css";

export const metadata = {
  title: "ODBS Dental Booking",
  description: "Dental booking website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

