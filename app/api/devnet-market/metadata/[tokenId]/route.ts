import {NextResponse} from "next/server";
import {launchTokens} from "@/app/data/synthetic/launches";

export async function GET(request:Request,{params}:{params:Promise<{tokenId:string}>}){
  const {tokenId}=await params;const token=launchTokens.find(item=>item.id===tokenId);
  if(!token)return NextResponse.json({error:"Unknown token"},{status:404});
  const origin=new URL(request.url).origin;
  return NextResponse.json({name:token.name,symbol:token.symbol,description:`${token.name} is a synthetic Aladdin Devnet token on Solana Devnet. It has no monetary value.`,image:`${origin}/api/devnet-market/artwork/${encodeURIComponent(token.id)}`,external_url:origin,attributes:[{trait_type:"Environment",value:"Solana Devnet"},{trait_type:"Data",value:"Synthetic"},{trait_type:"Lifecycle",value:token.lifecycle}]},{headers:{"cache-control":"public, max-age=3600"}});
}

