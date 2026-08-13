/* eslint-disable @next/next/no-img-element */
"use client";
import {useEffect,useRef} from "react";
import {WalletReadyState} from "@solana/wallet-adapter-base";
import {LoaderCircle,ShieldCheck,Wallet,X} from "lucide-react";
import {useAladdinWallet} from "@/app/hooks/useAladdinWallet";

const preferred=["Phantom","Solflare","Backpack"];
export function WalletConnectModal(){
  const state=useAladdinWallet(),closeRef=useRef<HTMLButtonElement>(null),{modalOpen,closeWalletModal}=state;
  useEffect(()=>{if(!modalOpen)return;closeRef.current?.focus();const key=(event:KeyboardEvent)=>{if(event.key==="Escape")closeWalletModal()};addEventListener("keydown",key);return()=>removeEventListener("keydown",key)},[modalOpen,closeWalletModal]);
  if(!state.modalOpen)return null;
  const ordered=state.wallets.toSorted((a,b)=>{const ai=preferred.indexOf(String(a.name)),bi=preferred.indexOf(String(b.name));return (ai<0?99:ai)-(bi<0?99:bi)});
  return <div className="walletModalBackdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)state.closeWalletModal()}}><section className="walletModal" role="dialog" aria-modal="true" aria-labelledby="wallet-modal-title"><header><div><small>SOLANA DEVNET</small><h2 id="wallet-modal-title">{state.modalReason?"Connect wallet to trade":"Connect Solana Wallet"}</h2></div><button ref={closeRef} type="button" aria-label="Close wallet selector" onClick={state.closeWalletModal}><X/></button></header>{state.modalReason?<p className="walletReason">{state.modalReason}</p>:null}<div className="walletProviderList">{ordered.length?ordered.map(option=><button type="button" onClick={()=>state.chooseWallet(option.name)} disabled={state.connecting} key={String(option.name)}>{option.icon?<img src={option.icon} alt=""/>:<Wallet/>}<span><b>{option.name}</b><small>{option.readyState===WalletReadyState.Installed?"Detected in this browser":"Open compatible wallet"}</small></span>{state.connecting?<LoaderCircle className="spin"/>:<span className="walletReady">{option.readyState===WalletReadyState.Installed?"Ready":"Connect"}</span>}</button>):<div className="walletUnavailable"><Wallet/><b>No compatible Solana wallet detected</b><p>Open Aladdin inside Phantom, Solflare or Backpack, or install a Wallet Standard-compatible wallet.</p></div>}</div>{state.error?<p className="walletError" role="alert">{state.error}<button type="button" onClick={()=>state.openWalletModal({reason:state.modalReason})}>Try again</button></p>:null}<footer><ShieldCheck/><span>Aladdin never asks for or stores your private key, seed phrase or recovery phrase.</span></footer></section></div>
}