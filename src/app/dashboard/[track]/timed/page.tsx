import Link from "next/link";

type PageProps = {
  params: Promise<{ track: string }>;
};

export default async function TimedPage({ params }: PageProps) {
  const { track } = await params;

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">
        {track.toUpperCase()} Timed Test
      </h1>

      <p className="mt-2 text-gray-600">
        Timed practice mode is coming soon.
      </p>
    </div>
  );
}