import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ track: string }>;
};

export default async function TimedStartRedirectPage({ params }: PageProps) {
  const { track } = await params;
  redirect(`/dashboard/${track}/timed`);
}