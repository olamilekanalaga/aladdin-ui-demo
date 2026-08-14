import {NextResponse} from "next/server";
import {createAssociatedTokenAccountIdempotentInstruction,createMintToCheckedInstruction,getAssociatedTokenAddressSync,TOKEN_2022_PROGRAM_ID} from "@solana/spl-token";
import {Connection,Keypair,PublicKey,SystemProgram,Transaction,clusterApiUrl} from "@solana/web3.js";
import {getDevnetTokenMarket} from "@/app/data/devnet-market";

export const runtime="nodejs";
const endpoint=process.env.SOLANA_DEVNET_RPC_URL||process.env.NEXT_PUBLIC_SOLANA_RPC_URL||clusterApiUrl("devnet");

function authorityFromEnvironment(){
  const encoded=process.env.ALADDIN_DEVNET_MINT_AUTHORITY;
  if(!encoded)throw new Error("The Devnet market authority is not configured.");
  const secret=JSON.parse(encoded) as number[];
  if(!Array.isArray(secret)||secret.length!==64)throw new Error("The Devnet market authority is invalid.");
  return Keypair.fromSecretKey(Uint8Array.from(secret));
}

export async function POST(request:Request){
  try{
    const input=await request.json() as {tokenId?:string;buyer?:string};
    if(!input.tokenId||!input.buyer)return NextResponse.json({error:"Token and buyer wallet are required."},{status:400});
    const market=getDevnetTokenMarket(input.tokenId);
    if(!market)return NextResponse.json({error:"This token has not been deployed to the Devnet sandbox yet."},{status:404});
    const buyer=new PublicKey(input.buyer),mint=new PublicKey(market.mint),authority=authorityFromEnvironment();
    const connection=new Connection(endpoint,"confirmed");
    const mintInfo=await connection.getAccountInfo(mint,"confirmed");
    if(!mintInfo||!mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID))return NextResponse.json({error:"The configured Devnet mint is unavailable."},{status:503});
    const buyerTokenAccount=getAssociatedTokenAddressSync(mint,buyer,false,TOKEN_2022_PROGRAM_ID);
    const rawAmount=BigInt(market.lotTokens)*BigInt(10)**BigInt(market.decimals);
    const latest=await connection.getLatestBlockhash("confirmed");
    const transaction=new Transaction({feePayer:buyer,recentBlockhash:latest.blockhash}).add(
      SystemProgram.transfer({fromPubkey:buyer,toPubkey:authority.publicKey,lamports:market.priceLamports}),
      createAssociatedTokenAccountIdempotentInstruction(buyer,buyerTokenAccount,buyer,mint,TOKEN_2022_PROGRAM_ID),
      createMintToCheckedInstruction(mint,buyerTokenAccount,authority.publicKey,rawAmount,market.decimals,[],TOKEN_2022_PROGRAM_ID),
    );
    transaction.partialSign(authority);
    return NextResponse.json({transaction:transaction.serialize({requireAllSignatures:false,verifySignatures:true}).toString("base64"),blockhash:latest.blockhash,lastValidBlockHeight:latest.lastValidBlockHeight,tokenId:market.tokenId,mint:market.mint,tokenAmount:market.lotTokens,priceLamports:market.priceLamports});
  }catch(cause){
    const message=cause instanceof Error?cause.message:"The Devnet purchase could not be prepared.";
    return NextResponse.json({error:message},{status:400});
  }
}

