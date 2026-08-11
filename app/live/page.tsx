"use client";

import { useMemo, useState } from "react";
import { Search, Zap } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Shell } from "@/app/components/Shell";
import { bundles } from "@/app/data/bundles";
import { searchDemo } from "@/app/utils/search";
import { SearchResults } from "./SearchResults";
import { TokenTradeBlock } from "./TokenTradeBlock";

export default function LiveTerminal() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchDemo(query), [query]);
  return <Shell active="live"><Header title="Live Terminal" subtitle="Token, then trade" icon={Zap} /><section className="top-search"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search CA, token, wallet, or transaction..." /></section>{query && <SearchResults results={results} />}<div className="live-stack">{bundles.map((bundle) => <TokenTradeBlock key={bundle.token.token_mint} bundle={bundle} />)}</div></Shell>;
}
