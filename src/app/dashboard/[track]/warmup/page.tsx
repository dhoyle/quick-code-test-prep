import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WarmupQuestion from "@/components/warmup/warmup-question";

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

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        {track.toUpperCase()} Warmup Practice
      </h1>

      <WarmupQuestion track={track} />
    </main>
  );
}