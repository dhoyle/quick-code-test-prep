import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTracks } from "@/db/tracks";
import LogoutButton from "@/components/auth/logout-button";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";

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
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 p-8 text-base leading-relaxed">
        <div className="mx-auto w-full max-w-5xl">
          {/* Hero */}
          <section className="rounded border bg-gray-50 p-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <p className="mt-3 text-base text-gray-700">
              Practice interview-style SQL and Python questions with a mix of
              crash-course lessons, warmup tests, and timed practice.
            </p>

            <p className="mt-4 text-base text-gray-600">
              Signed in as: {user.email}
            </p>
          </section>

          {/* Tracks */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold">Available Tracks</h2>

            <p className="mt-2 text-base text-gray-600">
              Choose a track to review concepts, build confidence with warmups,
              and practice under time pressure.
            </p>

            <ul className="mt-6 space-y-4">
              {tracks.map((track) => (
                <li key={track.id}>
                  <Link
                    href={`/dashboard/${track.slug}`}
                    className="block rounded border p-5 transition hover:bg-gray-50"
                  >
                    <h3 className="text-xl font-semibold">{track.title}</h3>

                    <p className="mt-2 text-base text-gray-600">
                      {track.description ?? "No description yet."}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Logout */}
          <section className="mt-10">
            <LogoutButton />
          </section>
        </div>
      </main>
    </div>
  );
}