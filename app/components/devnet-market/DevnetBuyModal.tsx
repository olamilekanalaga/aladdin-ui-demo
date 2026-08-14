"use client";
import {useEffect,useState} from "react";
import {useConnection,useWallet} from "@solana/wallet-adapter-react";
import {CircleCheck,ExternalLink,FlaskConical,LoaderCircle,X} from "lucide-react";
import type {LaunchToken} from "@/app/types/launches";
import type {DevnetPurchaseStatus} from "@/app/types/devnet-market";
import {getDevnetTokenMarket} from "@/app/data/devnet-market";
import {prepareDevnetPurchase} from "@/app/services/devnet-market";

const busyStatuses=new Set<DevnetPurchaseStatus>(["loading","signing","confirming"]);

export function DevnetBuyModal({token,onClose}:{token:LaunchToken|null;onClose:()=>void}){
  const {connection}=useConnection(),{publicKey,sendTransaction}=useWallet();
  const [status,setStatus]=useState<DevnetPurchaseStatus>("review"),[signature,setSignature]=useState<string|null>(null),[error,setError]=useState<string|null>(null);
  useEffect(()=>{setStatus("review");setSignature(null);setError(null)},[token?.id]);
  if(!token||!publicKey)return null;
  const market=getDevnetTokenMarket(token.id),busy=busyStatuses.has(status);
  const submit=async()=>{
    if(!market){setStatus("error");setError("This token has not been deployed to the Devnet sandbox yet.");return}
    try{
      setError(null);setStatus("loading");
      const prepared=await prepareDevnetPurchase(token.id,publicKey.toBase58());
      setStatus("signing");
      const nextSignature=await sendTransaction(prepared.transactionObject,connection,{skipPreflight:false,preflightCommitment:"confirmed"});
      setSignature(nextSignature);setStatus("confirming");
      const confirmation=await connection.confirmTransaction({signature:nextSignature,blockhash:prepared.blockhash,lastValidBlockHeight:prepared.lastValidBlockHeight},"confirmed");
      if(confirmation.value.err)throw new Error("Devnet returned a transaction error.");
      setStatus("confirmed");
    }catch(cause){setStatus("error");setError(cause instanceof Error?cause.message:"The Devnet purchase did not complete.")}
  };
  return <div className="walletModalBackdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget&&!busy)onClose()}}><section className="devnetBuyModal" role="dialog" aria-modal="true" aria-labelledby="devnet-buy-title">
    <header><div><small>TRADING SANDBOX · SOLANA DEVNET</small><h2 id="devnet-buy-title">Buy ${token.symbol} with Devnet SOL</h2></div><button type="button" onClick={onClose} disabled={busy} aria-label="Close Devnet Buy"><X/></button></header>
    {status==="confirmed"?<div className="devnetBuyResult"><CircleCheck/><h3>Devnet purchase confirmed</h3><p>{market?.lotTokens.toLocaleString()} ${token.symbol} were delivered to your connected wallet.</p></div>:<>
      <div className="devnetBuyAsset"><FlaskConical/><div><b>{token.name}</b><span>${token.symbol} · synthetic Devnet asset</span></div></div>
      <dl><div><dt>You receive</dt><dd>{market?`${market.lotTokens.toLocaleString()} ${token.symbol}`:"Unavailable"}</dd></div><div><dt>Sandbox price</dt><dd>{market?`${(market.priceLamports/1_000_000_000).toFixed(3)} Devnet SOL`:"Unavailable"}</dd></div><div><dt>Network</dt><dd>Solana Devnet</dd></div><div><dt>Delivery</dt><dd>Atomic with payment</dd></div></dl>
      <p className="devnetBuyWarning">The card’s market cap, liquidity and volume are simulated intelligence fixtures. They do not set this sandbox price. Devnet SOL and this token have no monetary value.</p>
    </>}
    {busy?<p className="devnetTransactionProgress" role="status"><LoaderCircle className="spin"/>{status==="loading"?"Preparing the atomic Devnet purchase…":status==="signing"?"Approve the purchase in your wallet…":"Waiting for Devnet confirmation…"}</p>:null}
    {error?<p className="walletError" role="alert">{error}</p>:null}
    {signature?<a className="devnetExplorerLink" href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noreferrer">View on Solana Explorer <ExternalLink/></a>:null}
    <footer>{status!=="confirmed"?<button className="devnetSubmit" type="button" onClick={()=>void submit()} disabled={busy||!market}>{status==="error"?"Try again":"Approve Devnet purchase"}</button>:null}<button type="button" onClick={onClose} disabled={busy}>{status==="confirmed"?"Done":"Cancel"}</button></footer>
  </section></div>
}
