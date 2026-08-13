import type {AnalysisRequest,QueryPlan} from "@/app/types/analytics/query";
import {comparisonColumns,tokenColumns,walletColumns} from "@/app/data/synthetic/ask-aladdin/query-fixtures";

export function planAskAladdinQuery({question,period}:AnalysisRequest):QueryPlan{
 const walletQuery=/migration specialist|wallets.*holding|which wallet/i.test(question);
 const comparison=/compare|differently|bark.*frog|frog.*bark/i.test(question);
 const briefing=/woke up|today|while i was away|overnight/i.test(question);
 const noResults=/above \$1m|over \$1m|no matches/i.test(question);
 const kind=walletQuery?"wallets":comparison?"comparison":briefing?"briefing":"tokens";
 const columns=(walletQuery?walletColumns:comparison?comparisonColumns:tokenColumns).map(column=>column.key);
 return{kind,entityType:walletQuery?"wallet":comparison?"cohort":"token",entityId:walletQuery||comparison?"bark":undefined,filters:noResults?[{field:"marketCap",operator:">",value:1_000_000}]:walletQuery?[{field:"token",operator:"=",value:"BARK"},{field:"behaviour",operator:"=",value:"Migration Specialist"},{field:"stillHolding",operator:">",value:0}]:[{field:"universe",operator:"=",value:"synthetic tokens"}],columns,sort:walletQuery?{field:"stillHolding",direction:"desc"}:{field:"marketCap",direction:"desc"},limit:10,analysisPeriod:period};
}
