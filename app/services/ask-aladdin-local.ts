"use client";
import type {AnswerMode,AuthenticatedUserProfile,ConsentSettings,QuerySession,SubscriptionEntitlements} from "@/app/types/ask-aladdin";
const PROFILE="aladdin-intelligence-profile",SESSIONS="aladdin-ask-sessions",LAST_ACTIVE="aladdin-last-active";
export const defaultEntitlements:SubscriptionEntitlements={plan:"Pro",historyDays:90,queryLimit:250,historicalMatchLimit:83,exports:true,sharedWorkspaces:false};
export function loadProfile():AuthenticatedUserProfile|null{try{const raw=localStorage.getItem(PROFILE);return raw?JSON.parse(raw):null}catch{return null}}
export function saveProfile(primaryProfile:AnswerMode,defaultAnswerMode=primaryProfile){const profile:AuthenticatedUserProfile={id:"demo-user",primaryProfile,defaultAnswerMode,timezone:"Europe/London",displayName:localStorage.getItem("aladdin-display-name")||"La_Crrypt"};localStorage.setItem(PROFILE,JSON.stringify(profile));return profile}
export function loadSessions():QuerySession[]{try{return JSON.parse(localStorage.getItem(SESSIONS)||"[]")}catch{return[]}}
export function saveSession(session:QuerySession){const next=[session,...loadSessions().filter(s=>s.id!==session.id)].slice(0,12);localStorage.setItem(SESSIONS,JSON.stringify(next))}
export function loadLastActive(){const raw=localStorage.getItem(LAST_ACTIVE);return raw?new Date(raw):new Date(Date.now()-8*60*60*1000)}
export function markActive(){localStorage.setItem(LAST_ACTIVE,new Date().toISOString())}
export function loadConsent():ConsentSettings{try{return JSON.parse(localStorage.getItem("aladdin-consent")||"")}catch{return{personalisation:true,memory:true,retentionDays:90,updatedAt:new Date().toISOString()}}}
