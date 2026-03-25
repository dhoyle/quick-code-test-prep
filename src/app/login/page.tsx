"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Invalid credentials. Use the demo account below.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function fillDemoCredentials() {
    setEmail("demo@quickprep.com");
    setPassword("demoprep");
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Try the demo</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full rounded border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full rounded bg-black text-white px-4 py-2 hover:bg-gray-800 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Continuing..." : "Continue"}
        </button>
      </form>

      {/* Demo credentials box */}
      <div className="mt-6 rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-medium mb-2">Demo access</p>
        <p>Email: demo@quickprep.com</p>
        <p>Password: demoprep</p>

        <button
          type="button"
          onClick={fillDemoCredentials}
          className="mt-3 text-sm underline hover:text-black"
        >
          Fill demo credentials
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Use the demo credentials above to explore the app.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </main>
  );
}