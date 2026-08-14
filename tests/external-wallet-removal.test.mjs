import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("production layout has no external-wallet provider",()=>{
  const layout=read("app/layout.tsx"),pkg=JSON.parse(read("package.json"));
  assert.doesNotMatch(layout,/SolanaProvider|wallet-connect\.css/);
  assert.equal(pkg.dependencies["@solana/wallet-adapter-react"],undefined);
  assert.equal(pkg.dependencies["@solana/wallet-adapter-base"],undefined);
});
test("landing and account remain usable without Phantom or Solflare",()=>{
  const page=read("app/page.tsx"),entry=read("app/components/landing/EntryModal.tsx"),account=read("app/components/account/AccountControl.tsx");
  assert.match(page,/Launch Aladdin/);assert.match(page,/Explore Demo/);assert.match(entry,/Continue with Google/);assert.match(entry,/Continue with Telegram/);
  for(const source of [page,entry,account])assert.doesNotMatch(source,/Phantom|Solflare|Backpack|Connect Wallet|Wallet Standard/);
});
test("visible research surfaces expose no obsolete Buy or signing flow",()=>{
  const launches=read("app/components/launches/LaunchesExperience.tsx"),card=read("app/components/launches/LaunchTokenCard.tsx"),feed=read("app/components/launches/LaunchFeedRow.tsx"),actions=read("app/components/ask-aladdin/ContextualActions.tsx");
  for(const source of [launches,card,feed,actions])assert.doesNotMatch(source,/DevnetBuyModal|openWalletModal|onBuy|>Buy<|signTransaction|sendTransaction/);
  assert.match(card,/Ask Aladdin/);assert.match(actions,/Open Terminal/);
});
test("read-only Devnet token assets remain available",()=>{
  const manifest=JSON.parse(read("app/data/devnet-market-manifest.json")),mapping=read("app/data/devnet-market.ts"),metadata=read("app/api/devnet-market/metadata/[tokenId]/route.ts"),artwork=read("app/api/devnet-market/artwork/[tokenId]/route.ts");
  assert.equal(Object.keys(manifest).length,24);for(const token of Object.values(manifest)){assert.ok(token.mint);assert.ok(token.mintSignature);assert.ok(token.metadataSignature);assert.equal(token.priceLamports,undefined);assert.equal(token.lotTokens,undefined)}
  assert.match(mapping,/getDevnetTokenMarket/);assert.match(metadata,/synthetic Aladdin Devnet token/);assert.match(artwork,/ALADDIN DEVNET/);
});
test("no public purchase endpoint or server authority remains",()=>{
  assert.equal(fs.existsSync(new URL("../app/api/devnet-market/prepare/route.ts",import.meta.url)),false);
  const env=read(".env.example"),all=[read("app/data/devnet-market.ts"),read("app/types/devnet-market.ts"),env].join("\n");
  assert.doesNotMatch(all,/ALADDIN_DEVNET_MINT_AUTHORITY|priceLamports|lotTokens/);
});
