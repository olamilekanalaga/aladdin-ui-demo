import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("Devnet purchases are atomic wallet-approved Token-2022 transactions",()=>{
  const route=read("app/api/devnet-market/prepare/route.ts"),modal=read("app/components/devnet-market/DevnetBuyModal.tsx");
  assert.match(route,/SystemProgram\.transfer/);assert.match(route,/createMintToCheckedInstruction/);assert.match(route,/transaction\.partialSign\(authority\)/);
  assert.match(route,/feePayer:buyer/);assert.match(modal,/sendTransaction/);assert.match(modal,/Approve Devnet purchase/);assert.match(modal,/confirmTransaction/);
});
test("sandbox pricing is separate from simulated market intelligence",()=>{
  const modal=read("app/components/devnet-market/DevnetBuyModal.tsx"),script=read("scripts/deploy-devnet-market.mjs");
  assert.match(modal,/market cap, liquidity and volume are simulated/);assert.match(modal,/do not set this sandbox price/);
  assert.match(script,/priceLamports:1_000_000/);assert.match(script,/lotTokens:1000/);
});
test("all 24 launch fixtures have deterministic Devnet deployment definitions",()=>{
  const fixtures=read("app/data/synthetic/launches.ts"),script=read("scripts/deploy-devnet-market.mjs");
  const ids=[...fixtures.matchAll(/\{id:"([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,24);
  for(const id of ids)assert.match(script,new RegExp(`\\["${id.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}"`));
});
test("Devnet metadata is explicit about synthetic non-monetary assets",()=>{
  const metadata=read("app/api/devnet-market/metadata/[tokenId]/route.ts"),artwork=read("app/api/devnet-market/artwork/[tokenId]/route.ts");
  assert.match(metadata,/synthetic Aladdin trading-sandbox token/);assert.match(metadata,/no monetary value/);assert.match(artwork,/ALADDIN DEVNET/);
});
test("Launches opens the real Devnet purchase modal instead of the future-execution toast",()=>{
  const launches=read("app/components/launches/LaunchesExperience.tsx");
  assert.match(launches,/DevnetBuyModal/);assert.match(launches,/selectedBuy/);assert.doesNotMatch(launches,/future Devnet transaction/);
});

