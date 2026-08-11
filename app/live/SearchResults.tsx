"use client";

import { ConfidenceBadge } from "@/app/components/badges";
import { Empty } from "@/app/components/ui";
import { useGo } from "@/app/utils/navigation";
import type { SearchResult } from "@/app/utils/search";

export function SearchResults({ results }: { results: SearchResult[] }) {
  const go = useGo();
  return <div className="results live-results">{results.map((r) => <button key={`${r.type}-${r.subtitle}`} className="result" onClick={() => go(r.route)}><span>{r.type}</span><strong>{r.title}</strong><small>{r.subtitle}</small><ConfidenceBadge value={r.confidence} /></button>)}{!results.length && <Empty text="No matching token, wallet or transaction found." />}</div>;
}
