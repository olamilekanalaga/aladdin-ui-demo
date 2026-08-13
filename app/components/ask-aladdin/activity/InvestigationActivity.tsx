"use client";
import type {InvestigationRunState} from "@/app/types/analytics/query";

export function InvestigationActivity({run,resultCount=0}:{run:InvestigationRunState;resultCount?:number}){
 if(run.status==="idle")return null;
 const current=run.events.at(-1);
 if(run.status==="running")return <div className="investigationActivity active" role="status" aria-live="polite"><span className="activitySpinner" aria-hidden="true"/><p>{current?.message||"Preparing the investigation."}</p></div>;
 if(run.status==="error")return <div className="investigationActivity error" role="alert"><p>{run.errorMessage||"The investigation could not be completed."}</p></div>;
 return <details className="investigationActivity complete"><summary>Investigation complete · {resultCount} matching {resultCount===1?"row":"rows"}</summary><div>{run.events.map(event=><p key={event.id}>{event.message}</p>)}</div></details>;
}
