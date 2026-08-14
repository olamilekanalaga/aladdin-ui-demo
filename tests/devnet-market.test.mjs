import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("all deployed Devnet definitions remain deterministic and read-only",()=>{
  const manifest=JSON.parse(read("app/data/devnet-market-manifest.json")),fixtures=read("app/data/synthetic/launches.ts"),script=read("scripts/devnet-assets/deploy-token-assets.mjs");
  const ids=[...fixtures.matchAll(/\{id:"([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,24);assert.equal(Object.keys(manifest).length,24);
  for(const id of ids){assert.ok(manifest[id]);assert.ok(manifest[id].mint);assert.match(script,new RegExp(`\\["${id.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}"`))}
});
test("Devnet metadata explicitly identifies synthetic non-monetary assets",()=>{
  const metadata=read("app/api/devnet-market/metadata/[tokenId]/route.ts"),artwork=read("app/api/devnet-market/artwork/[tokenId]/route.ts"),docs=read("docs/devnet-token-assets.md");
  assert.match(metadata,/synthetic Aladdin Devnet token/);assert.match(metadata,/no monetary value/);assert.match(artwork,/ALADDIN DEVNET/);assert.match(docs,/Solana Devnet/);
});
test("asset tooling stays operational and outside browser application code",()=>{
  const script=read("scripts/devnet-assets/deploy-token-assets.mjs");assert.match(script,/TOKEN_2022_PROGRAM_ID/);assert.match(script,/clusterApiUrl\("devnet"\)/);assert.doesNotMatch(script,/updateLocalEnvironment|ALADDIN_DEVNET_MINT_AUTHORITY/);
});
