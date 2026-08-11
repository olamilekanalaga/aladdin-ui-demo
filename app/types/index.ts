export type Checkpoint = "BUY_10" | "BUY_25" | "BUY_50" | "BUY_100";
export type Lifecycle = "new_launch" | "pre_migration" | "migrated";
export type Confidence = "verified" | "partial" | "demo_only" | "unavailable";
export type RetentionStatus = "holding" | "partial_exit" | "full_exit" | "accumulated" | "unknown";

export interface EvidenceQuality {
  confidence: Confidence;
  source: string;
  missing: string[];
}

export interface CheckpointState {
  checkpoint: Checkpoint;
  buys: number;
  sells: number;
  unique_buyers: number;
  unique_sellers: number;
  buy_pressure: number;
  first_buyer_retention: number;
  top5_buyer_share: number;
  market_cap_usd: number | null;
  volume_usd: number;
  note: string;
}

export interface TokenRecord {
  token_mint: string;
  name: string;
  symbol: string;
  lifecycle: Lifecycle;
  launch_time: string;
  migration_time: string | null;
  creator_wallet: string;
  current_checkpoint: Checkpoint;
  price_usd: number | null;
  market_cap_usd: number | null;
  fdv_usd: number | null;
  liquidity_usd: number | null;
  volume_24h_usd: number | null;
  market_index: number | null;
  participation_score: number | null;
  behaviour_label: string;
  evidence_quality: EvidenceQuality;
  first_buyer_summary: Record<RetentionStatus, number>;
  checkpoints: CheckpointState[];
}

export interface TradeRecord {
  signature: string;
  token_mint: string;
  timestamp: string;
  side: "buy" | "sell";
  wallet: string;
  sol_amount: number;
  token_amount: number;
  price_usd: number | null;
  market_cap_usd: number | null;
  checkpoint: Checkpoint;
}

export interface FirstBuyerRecord {
  rank: number;
  wallet: string;
  first_buy_at: string;
  buy_sol: number;
  current_status: RetentionStatus;
  retained_pct: number | null;
  later_action: string;
  confidence: Confidence;
}

export interface ParticipantRecord {
  wallet: string;
  buys: number;
  sells: number;
  net_sol: number;
  retained_pct: number;
  behaviour: string;
}

export interface WalletRecord {
  wallet: string;
  label: string;
  temperament: string;
  observed_tokens: number;
  early_entries: number;
  median_hold_minutes: number;
  evidence_quality: EvidenceQuality;
}

export interface HistoricalMatch {
  title: string;
  similarity: number;
  checkpoint: Checkpoint;
  decision: "Buy" | "Sell" | "Hold" | "Avoid" | "Position Size" | "Risk";
  outcome: string;
  caution: string;
}

export interface TokenBundle {
  token: TokenRecord;
  trades: TradeRecord[];
  first100: FirstBuyerRecord[];
  participants: ParticipantRecord[];
  holders: { wallet: string; share_pct: number | null; note: string; confidence: Confidence }[];
  historical: HistoricalMatch[];
  consultation: { question: string; answer: string; evidence: string[]; trade_change: string; confidence: Confidence }[];
}
