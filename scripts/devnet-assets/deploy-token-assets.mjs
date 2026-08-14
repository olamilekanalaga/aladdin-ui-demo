import fs from "node:fs";
import path from "node:path";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  getMintLen,
  tokenMetadataInitializeWithRentTransfer,
} from "@solana/spl-token";

const tokens = [
  ["mochi", "MOCHI", "Mochi Inu"], ["orbit", "ORBIT", "Orbit Cat"],
  ["pixel", "PIXEL", "Pixel Pup"], ["sprout", "SPROUT", "Sol Sprout"],
  ["neon", "NEON", "Neon Gecko"], ["crumb", "CRUMB", "Crumb Club"],
  ["squid", "SQUID", "Squid Mode"], ["dust", "DUST", "Cosmic Dust"],
  ["bullz", "BULLZ", "BullZ"], ["milo-launch", "MILO", "Milo on Sol"],
  ["quack", "QUACK", "Quack Stack"], ["zen", "ZEN", "Zen Frog"],
  ["toast", "TOAST", "Burnt Toast"], ["wisp", "WISP", "Purple Wisp"],
  ["capy", "CAPY", "Capybara CTO"], ["jolt", "JOLT", "Jolt Bot"],
  ["nova", "NOVA", "Nova Token"], ["bark-launch", "BARK", "Bark Protocol"],
  ["glow", "GLOW", "Glow Fish"], ["rune", "RUNE", "Rune Cat"],
  ["mew", "MEW", "Mew Matrix"], ["beam", "BEAM", "Beam Machine"],
  ["tide", "TIDE", "Purple Tide"], ["void", "VOID", "Void Arcade"],
];

const root = process.cwd();
const authorityPath = path.join(root, ".devnet-market-authority.json");
const manifestPath = path.join(root, "app/data/devnet-market-manifest.json");
const endpoint = process.env.SOLANA_DEVNET_RPC_URL || clusterApiUrl("devnet");
const origin = process.env.ALADDIN_DEVNET_METADATA_ORIGIN || "https://aladdin-ui-alpha.vercel.app";
const connection = new Connection(endpoint, "confirmed");

function loadAuthority() {
  if (fs.existsSync(authorityPath)) {
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(authorityPath, "utf8"))));
  }
  const keypair = Keypair.generate();
  fs.writeFileSync(authorityPath, JSON.stringify(Array.from(keypair.secretKey)));
  return keypair;
}

async function ensureFunding(authority) {
  const balance = await connection.getBalance(authority.publicKey, "confirmed");
  if (balance >= 0.05 * LAMPORTS_PER_SOL) return;
  const signature = await connection.requestAirdrop(authority.publicKey, LAMPORTS_PER_SOL);
  const latest = await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction({ signature, ...latest }, "confirmed");
}

async function createToken(authority, [tokenId, symbol, name]) {
  const mint = Keypair.generate();
  const decimals = 6;
  const uri = `${origin}/api/devnet-market/metadata/${encodeURIComponent(tokenId)}`;
  const mintLength = getMintLen([ExtensionType.MetadataPointer]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLength);
  const transaction = new Transaction().add(
    SystemProgram.createAccount({ fromPubkey: authority.publicKey, newAccountPubkey: mint.publicKey, space: mintLength, lamports, programId: TOKEN_2022_PROGRAM_ID }),
    createInitializeMetadataPointerInstruction(mint.publicKey, authority.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID),
    createInitializeMint2Instruction(mint.publicKey, decimals, authority.publicKey, null, TOKEN_2022_PROGRAM_ID),
  );
  const mintSignature = await sendAndConfirmTransaction(connection, transaction, [authority, mint], { commitment: "confirmed" });
  const metadataSignature = await tokenMetadataInitializeWithRentTransfer(
    connection, authority, mint.publicKey, authority.publicKey, authority, name, symbol, uri, [],
    { commitment: "confirmed" }, TOKEN_2022_PROGRAM_ID,
  );
  return { tokenId, mint: mint.publicKey.toBase58(), decimals, mintSignature, metadataSignature };
}

const authority = loadAuthority();
await ensureFunding(authority);
const existing = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
for (const token of tokens) {
  if (existing[token[0]]) continue;
  const asset = await createToken(authority, token);
  existing[token[0]] = asset;
  fs.writeFileSync(manifestPath, `${JSON.stringify(existing, null, 2)}\n`);
  process.stdout.write(`deployed ${token[1]} ${asset.mint}\n`);
  await new Promise((resolve) => setTimeout(resolve, 2500));
}
process.stdout.write(`Devnet token assets ready: ${Object.keys(existing).length} tokens; authority ${authority.publicKey.toBase58()}\n`);
