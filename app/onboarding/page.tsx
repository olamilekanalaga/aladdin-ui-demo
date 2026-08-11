"use client";

import { useState } from "react";
import { useGo } from "../utils/navigation";
import { ALADDIN_LOGO } from "../utils/assets";

export default function Onboarding() {
  const go = useGo();
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState("Trading");
  const finish = (path: string) => {
    localStorage.setItem("aladdin-demo-onboarded", "1");
    go(path);
  };
  return <main className="login onboarding-page"><section className="onboarding-card">
    <img className="login-logo" src={ALADDIN_LOGO} alt="Aladdin" />
    {step === 1 ? <><p className="eyebrow">First setup</p><h1>Welcome to Aladdin</h1><p>How do you primarily use on-chain data?</p><div className="onboarding-options">{["Trading", "Research", "Analysis", "Protocol / Team", "Other"].map((item) => <button key={item} className={useCase === item ? "selected" : ""} onClick={() => setUseCase(item)}>{item}</button>)}</div><div className="onboarding-actions"><button className="ghost" onClick={() => finish("/live")}>Skip for now</button><button className="primary" onClick={() => setStep(2)}>Continue</button></div></> : <><p className="eyebrow">Start point</p><h1>Where would you like to start?</h1><p>Your selected use case: {useCase}. You can change direction anytime.</p><div className="start-choice-grid"><button onClick={() => finish("/ask-ifa")}><b>Ask IFÁ</b><span>Ask blockchain questions in natural language and receive structured evidence.</span></button><button onClick={() => finish("/live")}><b>Terminal</b><span>Investigate tokens, wallets and historical evidence directly.</span></button></div><button className="settings-subtle-button" onClick={() => finish("/live")}>Skip for now</button></>}
  </section></main>;
}
