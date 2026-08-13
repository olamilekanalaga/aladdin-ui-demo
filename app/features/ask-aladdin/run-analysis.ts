import type {ActivityEvent,AnalysisRequest,AnalyticalRunResult,QueryOperation} from "@/app/types/analytics/query";
import {planAskAladdinQuery} from "./planning/query-planner";
import {executeSyntheticQuery} from "./execution/synthetic-executor";
import {interpretDataset} from "./interpretation/profile-interpreter";
import {formatAnalyticalAnswer} from "./formatting/answer-formatter";
import {generateFollowUps} from "./follow-ups/generate-follow-ups";

type ActivityListener=(events:ActivityEvent[])=>void;
const pause=()=>new Promise(resolve=>setTimeout(resolve,180));

export async function runAskAladdinAnalysis(request:AnalysisRequest,onActivity:ActivityListener=()=>{}):Promise<AnalyticalRunResult>{
 const events:ActivityEvent[]=[];
 async function operate(operation:QueryOperation,message:string,work:()=>void){
  const event:ActivityEvent={id:`${operation}-${events.length}`,message,operation,status:"active",timestamp:new Date().toISOString()};events.push(event);onActivity([...events]);await pause();work();event.status="complete";onActivity([...events]);
 }
 let plan!:ReturnType<typeof planAskAladdinQuery>,dataset!:ReturnType<typeof executeSyntheticQuery>,profileSummary="",answer!:ReturnType<typeof formatAnalyticalAnswer>;
 await operate("resolving","Understanding the requested entity and filters.",()=>{plan=planAskAladdinQuery(request)});
 const filterMessage=plan.kind==="wallets"?"Identifying Migration Specialist wallets that traded BARK.":"Filtering the matching synthetic records.";
 await operate("filtering",filterMessage,()=>{dataset=executeSyntheticQuery(plan)});
 if(plan.kind==="wallets")await operate("calculating","Calculating how much each wallet bought, sold and still holds.",()=>{dataset={...dataset,rows:dataset.rows.map(row=>({...row,values:{...row.values}}))}});
 await operate("ranking",dataset.totalRows?`${dataset.totalRows} matching ${plan.entityType}${dataset.totalRows===1?"":"s"} found. Ranking the result.`:"No matching rows found. Preparing the availability details.",()=>{dataset={...dataset,rows:[...dataset.rows]}});
 await operate("formatting","Preparing the final table and short profile summary.",()=>{profileSummary=interpretDataset(request.mode,plan,dataset);answer=formatAnalyticalAnswer(request.question,request.mode,plan,dataset,profileSummary,generateFollowUps(request.question))});
 return{answer,queryPlan:plan,dataset,activityEvents:events};
}
