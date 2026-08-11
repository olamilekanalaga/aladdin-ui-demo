"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { searchDemo } from "@/app/utils/search";
import { useGo } from "@/app/utils/navigation";
import { ALADDIN_LOGO } from "@/app/utils/assets";

export function Shell({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const go = useGo();
  const [query, setQuery] = useState("");
  const runSearch = () => {
    const result = searchDemo(query)[0];
    if (result) go(result.route);
  };
  const nav = [
    ["live", "Live Terminal", "/live"],
    ["ifa", "Ask IFÁ", "/ask-ifa"],
    ["settings", "Settings", "/settings/profile"],
  ] as const;
  return (
    <div className="shell no-sidebar">
      <header className="topbar">
        <button className="brand horizontal" onClick={() => go("/live")}>
          <img className="brand-logo" src={ALADDIN_LOGO} alt="Aladdin" />
          <span>
            <strong>Aladdin</strong>
            <small>Live terminal</small>
          </span>
        </button>
        <div className="search-space">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            placeholder="Search CA / wallet / token / txn"
          />
          <button onClick={runSearch}>Search</button>
        </div>
        <nav className="top-nav">
          {nav.map(([id, label, path]) => (
            <button
              key={id}
              className={active === id ? "active" : "text-sm font-medium text-muted-foreground hover:text-foreground"}
              onClick={() => go(path)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="stage">{children}</main>
    </div>
  );
}
