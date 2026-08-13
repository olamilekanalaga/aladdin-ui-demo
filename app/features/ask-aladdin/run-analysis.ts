import type {ActivityEvent,AnalysisRequest,AnalyticalRunResult,QueryOperation,ResultDataset} from "@/app/types/analytics/query";
import type {AskAladdinAnswer} from "@/app/types/ask-aladdin";
import {resolveAskIntent} from "./routing/intent-router";
import {planAskAladdinQuery} from "./planning/query-planner";
import {executeSyntheticQuery} from "./execution/synthetic-executor";
import {interpretDataset} from "./interpretation/profile-interpreter";
import {formatAnalyticalAnswer} from "./formatting/answer-formatter";
import {generateFollowUps} from "./follow-ups/generate-follow-ups";

type ActivityListener=(events:ActivityEvent[])=>void;
const pause=()=>new Promise(resolve=>setTimeout(resolve,180));
function conversationalAnswer(request:AnalysisRequest,intent:ReturnType<typeof resolveAskIntent>):AskAladdinAnswer{return{mode:request.mode,intent:intent.intent,has_data:false,direct_answer:intent.reply||"What would you like to investigate?",query_definition:request.question,result_columns:[],result_rows:[],result_count:0,displayed_count:0,sort_definition:"",active_filters:[],analysis_period:request.period,currency_display:null,profile_summary:"",generated_follow_ups:[],full_query_link:"/queries",export_options:[],data_details:{evidenceSnapshotId:"",evidenceHash:"",coverage:"",limitations:[]},availability:"unavailable",synthetic:true,evidenceSnapshotId:"",evidenceHash:""}}

export async function runAskAladdinAnalysis(request:AnalysisRequest,onActivity:ActivityListener=()=>{}):Promise<AnalyticalRunResult>{
 const resolved=resolveAskIntent(request);
 if(!["data_query","follow_up"].includes(resolved.intent)){const answer=conversationalAnswer(request,resolved),dataset:ResultDataset={columns:[],rows:[],totalRows:0,displayedRows:0,availability:"unavailable"};return{answer,queryPlan:null,dataset,activityEvents:[]}}
 const events:ActivityEvent[]=[];
 async function operate(operation:QueryOperation,message:string,work:()=>void){const event:ActivityEvent={id:`${operation}-${events.length}`,message,operation,status:"active",timestamp:new Date().toISOString()};events.push(event);onActivity([...events]);await pause();work();event.status="complete";onActivity([...events])}
 let plan!:ReturnType<typeof planAskAladdinQuery>,dataset!:ReturnType<typeof executeSyntheticQuery>,profileSummary="",answer!:ReturnType<typeof formatAnalyticalAnswer>;
 await operate("resolving","Understanding the requested entity and filters.",()=>{plan=planAskAladdinQuery(request)});
 await operate("filtering",plan.kind==="wallets"?"Identifying Migration Specialist wallets that traded BARK.":"Filtering the available records.",()=>{dataset=executeSyntheticQuery(plan)});
 if(plan.kind==="wallets")await operate("calculating","Calculating how much each wallet bought, sold and still holds.",()=>{dataset={...dataset,rows:dataset.rows.map(row=>({...row,values:{...row.values}}))}});
 await operate("ranking",dataset.totalRows?`${dataset.totalRows} matching ${plan.entityType}${dataset.totalRows===1?"":"s"} found. Ranking the result.`:"No matching rows found. Preparing the availability details.",()=>{dataset={...dataset,rows:[...dataset.rows]}});
 await operate("formatting","Preparing the final table and short profile summary.",()=>{profileSummary=interpretDataset(request.mode,plan,dataset);answer=formatAnalyticalAnswer(request.question,request.mode,plan,dataset,profileSummary,generateFollowUps(request.question))});
 answer.intent=resolved.intent;answer.has_data=true;return{answer,queryPlan:plan,dataset,activityEvents:events};
}
