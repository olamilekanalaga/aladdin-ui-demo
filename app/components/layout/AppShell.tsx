"use client";
import {ReactNode} from "react";
import {usePathname} from "next/navigation";
import {Sidebar} from "./Sidebar";
import {TopBar} from "./TopBar";
import {SyntheticDisclosure} from "@/app/components/ask-aladdin/SyntheticDisclosure";

export function AppShell({children}:{children:ReactNode}){
  const path=usePathname();
  if(path==="/")return <>{children}</>;
  return <div className="shell"><Sidebar/><div className="workspace"><TopBar/><SyntheticDisclosure compact/><main>{children}</main></div></div>
}