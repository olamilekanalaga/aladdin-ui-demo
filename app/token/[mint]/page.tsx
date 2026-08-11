import { redirect } from "next/navigation";

export default async function TokenRedirect({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  redirect(`/token/${mint}/trades`);
}
