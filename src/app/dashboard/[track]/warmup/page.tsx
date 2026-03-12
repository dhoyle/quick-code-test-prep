import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getRecentAttempts } from "@/db/attempts";
import WarmupQuestion from "@/components/warmup/warmup-question";
import AttemptHistory from "@/components/attempts/attempt-history";

type PageProps = {
  params: Promise<{ track: string }>;
};

export default async function WarmupPage({ params }: PageProps) {
  const { track } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const trackData = await getTrackBySlug(track);

  if (!trackData) {
    redirect("/dashboard");
  }

  const attempts = await getRecentAttempts(user.id, trackData.id);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        {track.toUpperCase()} Warmup Practice
      </h1>

      <WarmupQuestion track={track} />

      <AttemptHistory attempts={attempts} />
    </main>
  );
}