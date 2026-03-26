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
      setError("Invalid credentials. Please use the demo account or request access.");
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
      <h1 className="mb-6 text-2xl font-bold">Demo access</h1>

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
          className="w-full rounded bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          type="submit"
          disabled={loading}
        >
          {loading ? "Continuing..." : "Continue"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Use the demo account below for immediate access, or{" "}
        <a href="/contact" className="underline hover:text-black">
          request your own account
        </a>
        .
      </p>

      <div className="mt-4 rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
        <p className="mb-2 font-medium">Demo account</p>
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

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </main>
  );
}