export type DevnetPurchaseStatus="idle"|"loading"|"review"|"signing"|"confirming"|"confirmed"|"error";

export interface DevnetTokenMarket {
  tokenId:string;
  mint:string;
  decimals:number;
  lotTokens:number;
  priceLamports:number;
}

export interface PreparedDevnetPurchase {
  transaction:string;
  blockhash:string;
  lastValidBlockHeight:number;
  tokenId:string;
  mint:string;
  tokenAmount:number;
  priceLamports:number;
}

