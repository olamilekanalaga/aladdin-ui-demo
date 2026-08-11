import { TokenPage } from "../../TokenPage";

export default async function TokenRoute({ params }: { params: Promise<{ mint: string; tab: string }> }) {
  const { mint, tab } = await params;
  return <TokenPage mint={mint} tab={tab} />;
}
