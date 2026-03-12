import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTracks } from "@/db/tracks";
import LogoutButton from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const tracks = await getTracks();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Signed in as: {user.email}</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Available tracks</h2>

        <ul className="mt-4 space-y-3">
          {tracks.map((track) => (
            <li key={track.id} className="rounded border p-4">
              <h3 className="text-lg font-semibold">
                <Link
                  href={`/dashboard/${track.slug}`}
                  className="hover:underline"
                >
                  {track.title}
                </Link>
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {track.description ?? "No description yet."}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <LogoutButton />
    </main>
  );
}