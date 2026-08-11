import { bundles } from "@/app/data/bundles";
import { wallets } from "@/app/data/wallets";
import { short } from "@/app/utils/formatters";
import type { Confidence } from "@/app/types";

export type SearchResult = {
  type: string;
  title: string;
  subtitle: string;
  route: string;
  confidence: Confidence;
};

export function searchDemo(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokenResults = bundles.filter(({ token }) => [token.name, token.symbol, token.token_mint].some((v) => v.toLowerCase().includes(q))).map(({ token }) => ({ type: "token", title: `$${token.symbol} ${token.name}`, subtitle: token.token_mint, route: `/token/${token.token_mint}/trades`, confidence: token.evidence_quality.confidence }));
  const walletResults = wallets.filter((w) => [w.wallet, w.label, w.temperament].some((v) => v.toLowerCase().includes(q))).map((w) => ({ type: "wallet", title: w.label, subtitle: w.wallet, route: `/wallet/${w.wallet}`, confidence: w.evidence_quality.confidence }));
  const tradeResults = bundles.flatMap((b) => b.trades).filter((t) => t.signature.toLowerCase().includes(q) || t.wallet.toLowerCase().includes(q)).map((t) => ({ type: "transaction", title: t.signature, subtitle: `${t.side.toUpperCase()} ${short(t.token_mint)}`, route: `/token/${t.token_mint}/trades`, confidence: "demo_only" as const }));
  return [...tokenResults, ...walletResults, ...tradeResults].slice(0, 10);
}
