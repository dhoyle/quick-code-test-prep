import type { ReactNode } from "react";
import TrackSidebar from "@/components/layout/track-sidebar";

type Props = {
  children: ReactNode;
  params: Promise<{
    track: string;
  }>;
};

export default async function TrackLayout({ children, params }: Props) {
  const { track } = await params;

  return (
    <div className="flex min-h-screen">
      <TrackSidebar track={track} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}