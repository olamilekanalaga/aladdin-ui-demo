import { WalletPage } from "../WalletPage";

export default async function WalletRoute({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  return <WalletPage address={address} />;
}
