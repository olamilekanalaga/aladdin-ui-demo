/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Activity,Bell,BrainCircuit,ChartNoAxesCombined,ChevronDown,Command,Eye,Flame,History,House,LayoutList,Radio,ShieldAlert,Sparkles,Users} from "lucide-react";
import {GlobalSearch} from "@/app/components/search/GlobalSearch";
import {AccountControl} from "@/app/components/account/AccountControl";

const market=[["/launches","Launches",Radio],["/movers","Movers + Why",ChartNoAxesCombined],["/narratives","Narratives",Flame],["/og","Established / OG",LayoutList]] as const;
const intelligence=[["/smart-money","Smart Money",Sparkles],["/formation","Market Formation",Activity],["/insiders","Insider Activity",ShieldAlert],["/clusters","Coordinated Wallets",Users]] as const;

export function Sidebar(){
  const path=usePathname();
  const active=(href:string)=>path===href||path.startsWith(`${href}/`);
  return <header className="appNav">
    <Link href="/" className="brand"><img className="brandLogo" src="/aladdin-logo.jpg" alt="Aladdin"/><span>ALADDIN<small>INTELLIGENCE</small></span></Link>
    <nav className="desktopNav"><Menu label="Market" items={market} active={active}/><Menu label="Intelligence" items={intelligence} active={active}/><Link className={active("/historical")?"active":""} href="/historical"><History/>Historical</Link><Link className={active("/ask-ifa")?"active":""} href="/ask-ifa"><BrainCircuit/>Ask IFÁ</Link><Link className={active("/live")?"active":""} href="/live/bark"><Command/>Terminal</Link><Link className={active("/watchlist")?"active":""} href="/watchlist"><Eye/>Watchlist</Link><Link className={active("/alerts")?"active":""} href="/alerts"><Bell/>Alerts</Link></nav>
    <GlobalSearch/><AccountControl/>
    <div className="mobileDock"><Dock active={path==="/"} href="/" icon={House} label="Home"/><Dock active={active("/launches")} href="/launches" icon={Radio} label="Launches"/><Dock active={active("/live")} href="/live/bark" icon={Command} label="Terminal"/><Dock active={active("/ask-ifa")} href="/ask-ifa" icon={BrainCircuit} label="Ask IFÁ"/><Dock active={active("/alerts")} href="/alerts" icon={ShieldAlert} label="Alerts"/></div>
  </header>
}
function Menu({label,items,active}:{label:string;items:typeof market|typeof intelligence;active:(href:string)=>boolean}){return <div className={`navMenu ${items.some(([href])=>active(href))?"active":""}`}><button>{label}<ChevronDown/></button><div className="navMenuPanel">{items.map(([href,itemLabel,Icon])=><Link className={active(href)?"active":""} href={href} key={href}><Icon/>{itemLabel}</Link>)}</div></div>}
function Dock({active,href,icon:Icon,label}:{active:boolean;href:string;icon:typeof Radio;label:string}){return <Link className={active?"active":""} href={href}><Icon/><span>{label}</span></Link>}