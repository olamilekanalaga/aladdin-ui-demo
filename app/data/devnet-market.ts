import manifest from "@/app/data/devnet-market-manifest.json";
import type {DevnetTokenMarket} from "@/app/types/devnet-market";

const markets=manifest as Record<string,DevnetTokenMarket>;

export function getDevnetTokenMarket(tokenId:string){return markets[tokenId]??null}
export function hasDevnetTokenMarket(tokenId:string){return Boolean(markets[tokenId])}
export function listDevnetTokenMarkets(){return Object.values(markets)}

