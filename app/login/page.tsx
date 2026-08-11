"use client";

import { Lock } from "lucide-react";
import { PublicNav } from "../components/PublicNav";
import { DemoIfaPreview } from "../components/DemoIfaPreview";
import { useGo } from "../utils/navigation";
import { ALADDIN_LOGO } from "../utils/assets";

export default function Login() {
  const go = useGo();
  const enter = (provider: "google" | "telegram") => {
    sessionStorage.setItem("aladdin-demo-auth", `demo-${provider}`);
    if (localStorage.getItem("aladdin-demo-onboarded") === "1") go("/live");
    else go("/onboarding");
  };
  return <main className="login account-entry"><PublicNav /><section className="login-layout"><form className="login-card account-card" onSubmit={(e) => { e.preventDefault(); enter("google"); }}><img className="login-logo" src={ALADDIN_LOGO} alt="Aladdin" /><p className="eyebrow">Account entry</p><h1>Welcome to Aladdin</h1><p>Access Terminal, Ask IFÁ and your investigations from one account.</p><button className="auth-button" type="button" onClick={() => enter("google")}><span>G</span>Continue with Google</button><button className="auth-button" type="button" onClick={() => enter("telegram")}><span>T</span>Continue with Telegram</button><div className="auth-lock"><Lock size={15} />Mock account entry only. Real OAuth will replace these handlers later.</div><p className="login-fineprint">New to Aladdin? Your account will be created automatically.</p><div className="login-links"><button type="button">Terms of Service</button><button type="button">Privacy Policy</button></div></form><div className="login-preview"><DemoIfaPreview compact /></div></section></main>;
}
