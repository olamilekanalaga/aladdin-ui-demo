"use client";
import {useState} from "react";
import Link from "next/link";
import {TradesTable} from "@/app/components/tables/TradesTable";
import {wallets} from "@/app/data/wallets";
import type {Token} from "@/app/types";

const tabs=["Trades","Participants","Most Profitable","Largest Holders","First 100","Holders","Live State","Historical Match"] as const;
type Tab=(typeof tabs)[number];
const descriptions:Record<Tab,string>={Trades:"Wallet context and position state for live transactions.",Participants:"Active participant cohorts and their current positioning.","Most Profitable":"Realised and unrealised performance behind the strongest wallets.","Largest Holders":"Largest observed balances and concentration risk.","First 100":"Early-buyer retention and position changes.",Holders:"Current holder distribution and behavioural state.","Live State":"What changed recently that matters to the trade.","Historical Match":"Similar observed formations and their subsequent outcomes."};

export function TerminalInvestigation({token,initialView="Trades"}:{token:Token;initialView?:string}){
  const validInitial=tabs.includes(initialView as Tab)?initialView as Tab:"Trades";
  const [active,setActive]=useState<Tab>(validInitial);
  return <div className="investigate"><div className="tabs" role="tablist" aria-label="Terminal evidence views">{tabs.map(tab=><button type="button" role="tab" aria-selected={active===tab} className={active===tab?"active":""} onClick={()=>setActive(tab)} key={tab}>{tab}</button>)}</div><div className="tableHeading"><div><h2>{active}</h2><p>{descriptions[active]}</p></div><Link href={`/ask-aladdin?context=token:${token.id}&label=${encodeURIComponent(`$${token.symbol}`)}`}>Ask Aladdin about ${token.symbol} {"\u2192"}</Link></div><EvidencePanel tab={active} token={token}/></div>
}

function EvidencePanel({tab,token}:{tab:Tab;token:Token}){
  if(tab==="Trades")return <TradesTable/>;
  if(tab==="Participants")return <EvidenceTable headers={["WALLET","BEHAVIOUR","TRADES","POSITION","STATE"]} rows={wallets.map(w=>[w.short,w.behaviour,String(w.trades),w.holding,Number.parseInt(w.holding)>=80?"Holding":"Reduced"])}/>;
  if(tab==="Most Profitable")return <EvidenceTable headers={["WALLET","30D PNL","WIN RATE","ENTRY","POSITION"]} rows={[...wallets].sort((a,b)=>b.pnl-a.pnl).map(w=>[w.short,`+$${w.pnl.toLocaleString()}`,`${w.winRate}%`,w.entry,w.holding])}/>;
  if(tab==="Largest Holders")return <EvidenceTable headers={["RANK","WALLET","SUPPLY","CHANGE 15M","OBSERVED STATE"]} rows={wallets.map((w,i)=>[`#${i+1}`,w.short,["4.8%","3.7%","2.9%","2.2%","1.8%"][i],["+0.4%","0.0%","-0.3%","+0.2%","-0.8%"][i],i===4?"Distributing":"Holding"])}/>;
  if(tab==="First 100")return <EvidenceTable headers={["COHORT","WALLETS","HOLDING","SUPPLY LEFT","READ"]} rows={[["Buyers 1-20","20","85%","78%","Strong retention"],["Buyers 21-50","30","77%","69%","Holding"],["Buyers 51-100","50","70%","61%","Moderate exits"]]}/>;
  if(tab==="Holders")return <EvidenceTable headers={["SEGMENT","WALLETS","SUPPLY","5M CHANGE","RISK"]} rows={[["Top 10","10",`${token.top10}%`,"+0.7 pts",token.top10>35?"Elevated":"Contained"],["Top 50","50","48.6%","+0.3 pts","Stable"],["Remaining",String(Math.max(token.holders-50,0)),"51.4%","-1.0 pts","Broad"]]}/>;
  if(tab==="Live State")return <EvidenceTable headers={["CHANGE","WINDOW","EVIDENCE","TRADE RELEVANCE"]} rows={[["Profitable wallets entered","5m",`+${token.profitable} observed`,`Supports demand quality`],["First-100 retention","15m",`${token.retention}% holding`,`Tests early conviction`],["Top-10 concentration","15m",`${token.top10}% supply`,token.top10>35?"Position-size caution":"No immediate concentration break"],["Formation","Current",token.formation,"Monitor for transition"]]}/>;
  return <EvidenceTable headers={["MATCH","SIMILARITY","FORMATION","OUTCOME","KEY DIFFERENCE"]} rows={[["ML-042","87%",token.formation,"2.8x / 6h","Lower concentration"],["ML-119","81%",token.formation,"1.6x / 3h","Fewer profitable wallets"],["ML-208","76%",token.formation,"-34% / 2h","Creator distribution"]]}/>;
}
function EvidenceTable({headers,rows}:{headers:string[];rows:string[][]}){return <div className="terminalEvidenceTable" role="table"><div className="terminalEvidenceHead" role="row">{headers.map(header=><span role="columnheader" key={header}>{header}</span>)}</div>{rows.map((row,i)=><div className="terminalEvidenceRow" role="row" key={i}>{row.map((cell,j)=><span role="cell" key={`${i}-${j}`}>{cell}</span>)}</div>)}</div>}