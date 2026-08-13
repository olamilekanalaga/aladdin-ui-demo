"use client";
import Link from "next/link";
import {useEffect} from "react";
import {Activity,ChartNoAxesCombined,Eye,History,LayoutList,Settings,ShieldAlert,Sparkles,Users,X} from "lucide-react";

const groups=[
  {label:"MARKET",items:[["/movers","Movers + Why",ChartNoAxesCombined],["/og","Established / OG",LayoutList]]},
  {label:"INTELLIGENCE",items:[["/formation","Market Formation",Activity],["/smart-money","Smart Money",Sparkles],["/insiders","Insider Activity",ShieldAlert],["/clusters","Coordinated Wallets",Users],["/historical","Historical",History]]},
  {label:"TRADING",items:[["/watchlist","Watchlist",Eye]]},
  {label:"ACCOUNT",items:[["/settings","Settings",Settings]]},
] as const;
export const moreRoutes=groups.flatMap(group=>group.items.map(item=>item[0]));
export function MobileMoreDrawer({open,path,onClose}:{open:boolean;path:string;onClose:()=>void}){
  useEffect(()=>{if(!open)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose()};addEventListener("keydown",close);return()=>removeEventListener("keydown",close)},[open,onClose]);
  if(!open)return null;
  return <div className="mobileDrawerBackdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section className="mobileMoreDrawer" role="dialog" aria-modal="true" aria-label="More Aladdin destinations"><header><div><small>MOBILE NAVIGATION</small><b>More</b></div><button type="button" aria-label="Close navigation" onClick={onClose}><X/></button></header><nav>{groups.map(group=><div className="mobileDrawerGroup" key={group.label}><small>{group.label}</small>{group.items.map(([href,label,Icon])=>{const active=path===href||path.startsWith(`${href}/`);return <Link className={active?"active":""} href={href} onClick={onClose} key={href}><Icon/><span>{label}</span></Link>})}</div>)}</nav></section></div>
}