import type { ComponentType } from "react";

export function Header({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: ComponentType<{ size?: number }> }) {
  return <header className="header"><div><p className="eyebrow"><Icon size={15} />{subtitle}</p><h1>{title}</h1></div></header>;
}
