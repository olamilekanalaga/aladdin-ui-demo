"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {Filter,SlidersHorizontal} from "lucide-react";
import {launchTokens} from "@/app/data/synthetic/launches";
import type {LaunchFilters as LaunchFilterState,LaunchSortKey} from "@/app/types/launches";
import {clearLaunchFilter,defaultLaunchFilters,filterLaunchTokens,lifecycleForTab,sortLaunchTokens} from "@/app/utils/launches";
import {LaunchActiveFilters} from "@/app/components/launches/LaunchActiveFilters";
import {LaunchFilters} from "@/app/components/launches/LaunchFilters";
import {LaunchTokenCard} from "@/app/components/launches/LaunchTokenCard";
import {LaunchFeedRow} from "@/app/components/launches/LaunchFeedRow";

const STORAGE_KEY="aladdin-launches-view-v2";const tabs=["New","Almost Bonded","Migrated","Trending"] as const;type Tab=(typeof tabs)[number];interface StoredLaunchView{tab:Tab;filters:LaunchFilterState;sort:LaunchSortKey;scrollY:number}
export function LaunchesExperience(){
  const [tab,setTab]=useState<Tab>("New");const [filters,setFilters]=useState<LaunchFilterState>(defaultLaunchFilters);const [sort,setSort]=useState<LaunchSortKey>("newest");const [filtersOpen,setFiltersOpen]=useState(false);const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{try{const stored=JSON.parse(sessionStorage.getItem(STORAGE_KEY)??"null") as Partial<StoredLaunchView>|null;if(stored?.tab&&tabs.includes(stored.tab))setTab(stored.tab);if(stored?.filters)setFilters({...defaultLaunchFilters,...stored.filters});if(stored?.sort)setSort(stored.sort);requestAnimationFrame(()=>window.scrollTo({top:stored?.scrollY??0}))}catch{}setHydrated(true)},[]);
  useEffect(()=>{if(!hydrated)return;const save=()=>sessionStorage.setItem(STORAGE_KEY,JSON.stringify({tab,filters,sort,scrollY:window.scrollY}));save();window.addEventListener("pagehide",save);return()=>window.removeEventListener("pagehide",save)},[filters,hydrated,sort,tab]);
  const visible=useMemo(()=>{const tabLifecycle=lifecycleForTab(tab);const tabbed=tabLifecycle.length?launchTokens.filter(token=>tabLifecycle.includes(token.lifecycle)):launchTokens;return sortLaunchTokens(filterLaunchTokens(tabbed,filters),sort)},[filters,sort,tab]);
  const removeFilter=useCallback((key:keyof LaunchFilterState)=>setFilters(current=>clearLaunchFilter(current,key)),[]);
  return <><div className="pageTitle"><div><span className="eyebrow">MARKET DISCOVERY</span><h1>Launches</h1><p>Find activity, then investigate the behaviour underneath it.</p></div><div className="titleStats"><span><b>{launchTokens.length}</b> tracked</span><span><b>{launchTokens.filter(x=>x.lifecycle==="almost-bonded").length}</b> almost bonded</span><span><b>{launchTokens.filter(x=>x.lifecycle==="migrated").length}</b> migrated</span></div></div>
    <div className="toolbar launchesToolbar"><div className="tabs">{tabs.map(item=><button onClick={()=>setTab(item)} className={tab===item?"active":""} key={item}>{item}</button>)}</div><label className="launchSort"><SlidersHorizontal size={14}/><select aria-label="Sort launches" value={sort} onChange={event=>setSort(event.target.value as LaunchSortKey)}><option value="newest">Newest</option><option value="market-cap">Market Cap</option><option value="liquidity">Liquidity</option><option value="volume">1H Volume</option><option value="volume-change">1H Volume Change</option><option value="bonding">Bonding Progress</option><option value="migration-specialists">Migration Specialists</option></select></label><button type="button" aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(true)}><Filter size={14}/>Filters</button></div>
    <LaunchActiveFilters filters={filters} onRemove={removeFilter} onClear={()=>setFilters(defaultLaunchFilters)}/><div className="launchResultMeta"><span>{visible.length} {tab.toLowerCase()} token{visible.length===1?"":"s"}</span><span>MS and SC are deterministic fixture identities · FW is current wallet context</span></div>
    {visible.length?<div className="launchCardGrid">{visible.map(token=><div className="launchResponsiveItem" key={token.id}><LaunchTokenCard token={token}/><LaunchFeedRow token={token}/></div>)}</div>:<div className="launchEmpty"><b>No launches match these filters.</b><span>Try widening the market or behaviour conditions.</span><button onClick={()=>setFilters(defaultLaunchFilters)}>Clear filters</button></div>}<div className="footnote">Simulated launch records · not live market activity</div>
    <LaunchFilters open={filtersOpen} filters={filters} onApply={setFilters} onClose={()=>setFiltersOpen(false)}/></>;
}
