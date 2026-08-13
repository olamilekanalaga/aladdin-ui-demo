"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {ArrowRight,BookOpen,MessageCircle,Wallet} from "lucide-react";

export default function Home(){
  const [notice,setNotice]=useState("");
  const connect=(method:string)=>{setNotice(`${method} connection is simulated in this frontend.`);setTimeout(()=>setNotice(""),2400)};
  return <div className="publicLanding">
    <header className="landingNav"><Link href="/" className="landingBrand"><Image src="/aladdin-logo.jpg" width={38} height={38} alt="Aladdin" priority/><span>ALADDIN<small>INTELLIGENCE</small></span></Link><nav><Link href="#product">Product</Link><Link href="/settings?section=developer">API</Link></nav><Link className="enterProduct" href="/launches">Open Product <ArrowRight/></Link></header>
    <main className="publicHero" id="product"><div className="heroCopy"><span className="eyebrow">SOLANA TRADING INTELLIGENCE</span><h1>Trade the behaviour<br/>underneath the market.</h1><p>Aladdin resolves tokens, wallets and transactions into decision-ready evidence—then gives traders a structured Terminal and Ask IF{"\u00c1"} reasoning layer.</p><div className="connectLabel">CONNECT OR CONTINUE WITH</div><div className="connectOptions"><button className="phantom" onClick={()=>connect("Phantom")}><Wallet/>Phantom</button><button onClick={()=>connect("Google")}><b>G</b>Google</button><button onClick={()=>connect("Telegram")}><MessageCircle/>Telegram</button></div>{notice&&<p className="landingNotice">{notice}</p>}<small className="mockNote">Frontend preview—authentication and wallet connection are not live yet.</small></div><div className="heroVisual"><Image src="/aladdin-logo.jpg" width={430} height={430} alt="Aladdin Intelligence" priority/><div><span>SEARCH</span><i/ ><span>TERMINAL</span><i/><span>ASK IF{"\u00c1"}</span></div></div></main>
    <footer className="landingFooter"><span>Behaviour-first. Evidence-first. Trader-first.</span><Link href="/settings?section=developer"><BookOpen/>Developer API</Link></footer>
  </div>
}