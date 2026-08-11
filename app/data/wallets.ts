import type { WalletRecord } from "@/app/types";

export const wallets: WalletRecord[] = [
  { wallet: "A1AccumWallet111111111111111111111111", label: "Early accumulator", temperament: "early accumulator", observed_tokens: 47, early_entries: 31, median_hold_minutes: 38, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "B7BuyerRetain111111111111111111111111", label: "Conviction holder", temperament: "conviction holder", observed_tokens: 39, early_entries: 24, median_hold_minutes: 44, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "FsFlipExit111111111111111111111111111", label: "Fast flipper", temperament: "fast flipper", observed_tokens: 64, early_entries: 44, median_hold_minutes: 7, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "Rot8Wallet1111111111111111111111111111", label: "Rotation wallet", temperament: "rotation wallet", observed_tokens: 58, early_entries: 21, median_hold_minutes: 16, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "HatchBuyer111111111111111111111111111", label: "Early accumulator", temperament: "early accumulator", observed_tokens: 18, early_entries: 12, median_hold_minutes: 26, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "SeedEarly11111111111111111111111111111", label: "New launch wallet", temperament: "unknown", observed_tokens: 3, early_entries: 2, median_hold_minutes: 0, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["trade history"] } }
];

export const walletStats: Record<string, { label: string; behaviour: string; winRate: number | null; trades: number; pnlUsd: number | null; roiPct: number | null; holdingPct: number | null; supplyPct: number | null; usdValue: number | null; age: string; soldPct: number | null; remainingPct: number | null; entryMc: number | null }> = {
  A1AccumWallet111111111111111111111111: { label: "Early accumulator", behaviour: "Migration Specialist", winRate: 0.61, trades: 47, pnlUsd: 1840, roiPct: 142, holdingPct: 100, supplyPct: 4.8, usdValue: 201, age: "38m", soldPct: 0, remainingPct: 100, entryMc: 1420 },
  B7BuyerRetain111111111111111111111111: { label: "Conviction holder", behaviour: "Fresh Wallet", winRate: 0.58, trades: 39, pnlUsd: 960, roiPct: 84, holdingPct: 73, supplyPct: 2.9, usdValue: 121, age: "34m", soldPct: 27, remainingPct: 73, entryMc: 1760 },
  FsFlipExit111111111111111111111111111: { label: "Fast flipper", behaviour: "Scalper", winRate: 0.52, trades: 64, pnlUsd: 310, roiPct: 22, holdingPct: 0, supplyPct: 0, usdValue: 0, age: "29m", soldPct: 100, remainingPct: 0, entryMc: 2200 },
  Rot8Wallet1111111111111111111111111111: { label: "Rotation wallet", behaviour: "Sniper", winRate: 0.49, trades: 58, pnlUsd: 420, roiPct: 37, holdingPct: 38, supplyPct: 1.5, usdValue: 63, age: "22m", soldPct: 62, remainingPct: 38, entryMc: 3710 },
  HatchBuyer111111111111111111111111111: { label: "Early accumulator", behaviour: "Fresh Wallet", winRate: 0.57, trades: 18, pnlUsd: 240, roiPct: 48, holdingPct: 100, supplyPct: 3.1, usdValue: 60, age: "19m", soldPct: 0, remainingPct: 100, entryMc: 1340 },
  SeedEarly11111111111111111111111111111: { label: "New launch wallet", behaviour: "Creator", winRate: null, trades: 3, pnlUsd: null, roiPct: null, holdingPct: 100, supplyPct: 1.2, usdValue: null, age: "2m", soldPct: 0, remainingPct: 100, entryMc: null }
};

export function walletInfo(wallet: string) {
  return walletStats[wallet] ?? { label: "Unknown wallet", behaviour: "unknown", winRate: null, trades: 0, pnlUsd: null, roiPct: null, holdingPct: null, supplyPct: null, usdValue: null, age: "Unavailable", soldPct: null, remainingPct: null, entryMc: null };
}
