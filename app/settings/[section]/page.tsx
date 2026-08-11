import { SettingsPage } from "../SettingsPage";

export default async function SettingsRoute({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <SettingsPage section={section} />;
}
