export default function Home() {
  // Keep your existing static pages in /public.
  // This is just a simple Next homepage.
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>ODBS Dental Booking</h1>
      <p>
        Open the existing pages:
        <a href="/index.html" style={{ marginLeft: 8 }}>
          Login
        </a>
        <span> | </span>
        <a href="/admin.html" style={{ marginLeft: 8 }}>
          Admin
        </a>
        <span> | </span>
        <a href="/dentist.html" style={{ marginLeft: 8 }}>
          Dentist
        </a>
      </p>
    </main>
  );
}

