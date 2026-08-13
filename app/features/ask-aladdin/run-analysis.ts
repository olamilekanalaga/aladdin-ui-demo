import type {ActivityEvent,AnalysisRequest,AnalyticalRunResult,QueryOperation,ResultDataset} from "@/app/types/analytics/query";
import type {AskAladdinAnswer} from "@/app/types/ask-aladdin";
import {resolveAskIntent} from "./routing/intent-router";
import {planAskAladdinQuery} from "./planning/query-planner";
import {executeSyntheticQuery} from "./execution/synthetic-executor";
import {interpretDataset} from "./interpretation/profile-interpreter";
import {formatAnalyticalAnswer} from "./formatting/answer-formatter";
import {generateFollowUps} from "./follow-ups/generate-follow-ups";

type ActivityListener=(events:ActivityEvent[])=>void;
const pause=(duration=420)=>new Promise(resolve=>setTimeout(resolve,duration));
function conversationalAnswer(request:AnalysisRequest,intent:ReturnType<typeof resolveAskIntent>):AskAladdinAnswer{return{mode:request.mode,intent:intent.intent,has_data:false,direct_answer:intent.reply||"What would you like to investigate?",query_definition:request.question,result_columns:[],result_rows:[],result_count:0,displayed_count:0,sort_definition:"",active_filters:[],analysis_period:request.period,currency_display:null,profile_summary:"",generated_follow_ups:[],full_query_link:"/queries",export_options:[],data_details:{evidenceSnapshotId:"",evidenceHash:"",coverage:"",limitations:[]},availability:"unavailable",synthetic:true,evidenceSnapshotId:"",evidenceHash:""}}

export async function runAskAladdinAnalysis(request:AnalysisRequest,onActivity:ActivityListener=()=>{}):Promise<AnalyticalRunResult>{
 const resolved=resolveAskIntent(request),events:ActivityEvent[]=[];
 async function operate(operation:QueryOperation,message:string,work:()=>void,duration=420){const event:ActivityEvent={id:`${operation}-${events.length}`,message,operation,status:"active",timestamp:new Date().toISOString()};events.push(event);onActivity([...events]);await pause(duration);work();event.status="complete";onActivity([...events])}
 if(!["data_query","follow_up"].includes(resolved.intent)){await operate("resolving","Thinking",()=>{},650);const answer=conversationalAnswer(request,resolved),dataset:ResultDataset={columns:[],rows:[],totalRows:0,displayedRows:0,availability:"unavailable"};return{answer,queryPlan:null,dataset,activityEvents:events}}
 let plan!:ReturnType<typeof planAskAladdinQuery>,dataset!:ReturnType<typeof executeSyntheticQuery>,profileSummary="",answer!:ReturnType<typeof formatAnalyticalAnswer>;
 await operate("resolving","Understanding your question",()=>{plan=planAskAladdinQuery(request)});
 await operate("filtering","Translating request into a data query",()=>{dataset=executeSyntheticQuery(plan)});
 await operate("calculating","Engineering required features",()=>{dataset={...dataset,rows:dataset.rows.map(row=>({...row,values:{...row.values}}))}});
 await operate("ranking",plan.kind==="wallets"?"Analysing wallet behaviour":"Analysing matching market records",()=>{dataset={...dataset,rows:[...dataset.rows]}});
 await operate("formatting","Preparing the final table",()=>{profileSummary=interpretDataset(request.mode,plan,dataset);answer=formatAnalyticalAnswer(request.question,request.mode,plan,dataset,profileSummary,generateFollowUps(request.question))});
 answer.intent=resolved.intent;answer.has_data=true;return{answer,queryPlan:plan,dataset,activityEvents:events};
}