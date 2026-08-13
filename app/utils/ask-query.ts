import type {AnswerMode,AskAladdinAnswer,AskResultRow,ResolvedAnalysisPeriod} from "@/app/types/ask-aladdin";
import {askAladdinSnapshot,briefingEvents} from "@/app/data/ask-aladdin";
import {barkFrogComparison,barkMigrationSpecialists,comparisonColumns,tokenColumns,tokenResultRows,walletColumns} from "@/app/data/ask-query";

const profileSummary=(mode:AnswerMode,kind:"wallets"|"tokens"|"comparison"|"briefing")=>{
 if(mode==="Trader")return kind==="wallets"?"Specialist retention remains high, but every listed wallet has already reduced part of its entry. Monitor remaining supply and the pace of further selling.":"Retention and liquidity separate the stronger rows from weaker migrations; concentration remains the main material risk.";
 if(mode==="Analyst")return kind==="wallets"?"Five of six classified specialists remain in the cohort. The table is ranked by remaining BARK quantity; classification coverage is synthetic and limited to the observed fixture.":"Lifecycle retention and liquidity deterioration explain most of the difference in this synthetic cohort; the sample is descriptive, not causal.";
 return kind==="wallets"?"Specialist participation is still visible, while partial reductions should be communicated factually rather than framed as unanimous conviction.":"Sustained participation and liquidity are the strongest factual communication points; concentration and exits require transparent context.";
};

const followUps=(question:string)=>/migration specialist|wallets.*holding/i.test(question)?["Show their previous profitable tokens.","Which wallet holds the most BARK?","When did these wallets start reducing?","Compare these wallets with BARK’s Scalpers."]:/compare|differently|frog/i.test(question)?["Which early BARK wallets are still holding?","Show the liquidity changes by lifecycle stage.","Compare creator-linked selling."]:/woke up|today|while i was away/i.test(question)?["Which tokens retained the most early buyers?","Show profitable wallets that entered today.","Which migrations lost liquidity fastest?"]:["Which Migration Specialists are still holding BARK?","Compare BARK with FROG.","Show the strongest retention tokens."];

export function buildStructuredAnswer(question:string,mode:AnswerMode,period:ResolvedAnalysisPeriod):AskAladdinAnswer{
 const walletQuery=/migration specialist|wallets.*holding|which wallet/i.test(question);
 const comparison=/compare|differently|bark.*frog|frog.*bark/i.test(question);
 const briefing=/woke up|today|while i was away|overnight/i.test(question);
 const noResults=/above \$1m|over \$1m|no matches/i.test(question);
 let rows:AskResultRow[]=walletQuery?barkMigrationSpecialists:comparison?barkFrogComparison:tokenResultRows;
 const columns=walletQuery?walletColumns:comparison?comparisonColumns:tokenColumns;
 if(noResults)rows=[];
 const direct=noResults?"No synthetic records match the resolved filters.":walletQuery?"5 of 6 Migration Specialists are still holding BARK. Showing the five wallets ranked by remaining BARK quantity.":comparison?"BARK retained more early buyers and experienced a smaller liquidity decline after migration.":briefing?`${briefingEvents.length} material synthetic market changes were identified in the analysed period.`:`${rows.length} structured records match this query.`;
 const kind=walletQuery?"wallets":comparison?"comparison":briefing?"briefing":"tokens";
 return{mode,direct_answer:direct,query_definition:question,result_columns:columns,result_rows:rows,result_count:rows.length,displayed_count:Math.min(rows.length,10),sort_definition:walletQuery?"Still holding, descending":comparison?"Decision relevance":"Market cap, descending",active_filters:noResults?["Market cap above $1M","Synthetic fixture"]:walletQuery?["Token: BARK","Behaviour: Migration Specialist","Current holding > 0"]:["Synthetic token universe","Available structured fields"],analysis_period:period,currency_display:walletQuery?"SOL":null,profile_summary:profileSummary(mode,kind),generated_follow_ups:followUps(question),full_query_link:"/queries",export_options:["CSV","JSON"],data_details:{evidenceSnapshotId:askAladdinSnapshot.id,evidenceHash:askAladdinSnapshot.hash,coverage:noResults?"No eligible rows":"Synthetic fixture coverage",limitations:noResults?["Widen the market-cap filter or remove a condition."]:['Synthetic demo data only. Correlation does not establish causation.']},availability:rows.length?"available":"unavailable",synthetic:true,evidenceSnapshotId:askAladdinSnapshot.id,evidenceHash:askAladdinSnapshot.hash};
}
