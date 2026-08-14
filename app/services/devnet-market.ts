import {Transaction} from "@solana/web3.js";
import type {PreparedDevnetPurchase} from "@/app/types/devnet-market";

export async function prepareDevnetPurchase(tokenId:string,buyer:string){
  const response=await fetch("/api/devnet-market/prepare",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({tokenId,buyer})});
  const body=await response.json() as PreparedDevnetPurchase|{error?:string};
  if(!response.ok||!("transaction" in body)){const message="error" in body?body.error:null;throw new Error(message||"The Devnet purchase could not be prepared.")}
  const bytes=Uint8Array.from(atob(body.transaction),character=>character.charCodeAt(0));
  return {...body,transactionObject:Transaction.from(bytes)};
}

