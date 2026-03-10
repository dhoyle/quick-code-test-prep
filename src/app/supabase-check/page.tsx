export default function SupabaseCheck() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase Environment Check</h1>
      <p>URL present: {String(!!process.env.NEXT_PUBLIC_SUPABASE_URL)}</p>
      <p>Anon key present: {String(!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}</p>
    </main>
  );
}