"use client";import {ReactNode} from "react";import {Sidebar} from "./Sidebar";import {TopBar} from "./TopBar";
export function AppShell({children}:{children:ReactNode}){return <div className="shell"><Sidebar/><div className="workspace"><TopBar/><main>{children}</main></div></div>}
