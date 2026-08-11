import { Trades } from "@/app/token/Trades";
import { TokenCard } from "./TokenCard";
import type { TokenBundle } from "@/app/types";

export function TokenTradeBlock({ bundle }: { bundle: TokenBundle }) {
  return <section className="terminal-token"><TokenCard token={bundle.token} /><Trades rows={bundle.trades} compact /></section>;
}
