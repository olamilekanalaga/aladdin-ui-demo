"use client";
import Link from "next/link";
import {useState} from "react";
import type {AnswerMode,AskAladdinAnswer,LegacyAskAladdinAnswer,ResolvedAnalysisPeriod} from "@/app/types/ask-aladdin";
import {buildStructuredAnswer} from "@/app/utils/ask-query";
import {QueryResultTable} from "./QueryResultTable";

export function StructuredAnswer({answer,question,period,onExport}:{answer:AskAladdinAnswer|LegacyAskAladdinAnswer;question:string;period:ResolvedAnalysisPeriod;onExport:()=>void}){
 const structured="result_rows" in answer?answer:buildStructuredAnswer(question,answer.mode as AnswerMode,period);
 const [currency,setCurrency]=useState<"SOL"|"USD">(structured.currency_display||"SOL");
 if(structured.has_data===false)return <div className="conversationReply"><p>{structured.direct_answer}</p></div>;
 return <div className="structuredQueryAnswer"><h2>{structured.direct_answer}</h2>{structured.availability==="available"?<QueryResultTable rows={structured.result_rows.slice(0,structured.displayed_count)} columns={structured.result_columns} currency={structured.currency_display?currency:null} onCurrencyChange={setCurrency}/>:<div className="noQueryResults"><b>No matching rows</b><p>Resolved filters: {structured.active_filters.join(" · ")}</p><p>Period: {structured.analysis_period.label}</p><p>{structured.data_details.limitations[0]}</p></div>}<p className="profileSummary">{structured.profile_summary}</p><div className="resultActions"><Link href={`${structured.full_query_link}?definition=${encodeURIComponent(structured.query_definition)}`}>View all results</Link>{structured.export_options.length>0&&<button type="button" onClick={onExport}>Export full result</button>}{structured.result_rows[0]?.tokenId&&<Link href={`/live/${structured.result_rows[0].tokenId}?view=${encodeURIComponent(structured.result_rows[0].terminalView||"Live State")}`}>View all in Terminal</Link>}</div><details className="dataDetails"><summary>Data details</summary>{structured.synthetic&&structured.result_rows.length?<p>Source: Simulated data</p>:null}<p>Coverage: {structured.data_details.coverage}</p>{structured.data_details.limitations.map(item=><p key={item}>{item}</p>)}</details></div>;
}
