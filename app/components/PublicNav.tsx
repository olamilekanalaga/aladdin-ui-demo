"use client";

import { useGo } from "@/app/utils/navigation";
import { ALADDIN_LOGO } from "@/app/utils/assets";

export function PublicNav() {
  const go = useGo();
  return <header className="public-nav">
    <button className="public-brand" onClick={() => go("/")}><img src={ALADDIN_LOGO} alt="Aladdin" /><span>Aladdin</span></button>
    <nav>
      <a href="#product">Product</a>
      <a href="#access">Pricing</a>
      <a href="#api">API</a>
      <a href="#telegram">Telegram</a>
    </nav>
    <div className="public-nav-actions">
      <button className="ghost" onClick={() => go("/login")}>Sign in</button>
      <button className="primary" onClick={() => go("/login")}>Get started</button>
    </div>
  </header>;
}
