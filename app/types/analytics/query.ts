import type {AnswerMode,AskAladdinAnswer,AskResultRow,ResultColumn,ResolvedAnalysisPeriod} from "@/app/types/ask-aladdin";

export type QueryOperation="resolving"|"filtering"|"joining"|"calculating"|"ranking"|"formatting";
export type ActivityStatus="active"|"complete"|"error";
export interface QueryFilter{field:string;operator:string;value:string|number|boolean}
export interface QuerySort{field:string;direction:"asc"|"desc"}
export interface QueryPlan{kind:"wallets"|"tokens"|"comparison"|"briefing";entityType:string;entityId?:string;filters:QueryFilter[];columns:string[];sort?:QuerySort;limit?:number;analysisPeriod:ResolvedAnalysisPeriod}
export interface ActivityEvent{id:string;message:string;operation:QueryOperation;status:ActivityStatus;timestamp:string;resultCount?:number}
export interface ResultDataset{columns:ResultColumn[];rows:AskResultRow[];totalRows:number;displayedRows:number;availability:"available"|"unavailable"}
export interface InvestigationRunState{status:"idle"|"running"|"complete"|"error";events:ActivityEvent[];startedAt?:string;completedAt?:string;errorMessage?:string}

export interface AnalysisRequest{question:string;mode:AnswerMode;period:ResolvedAnalysisPeriod}
export interface AnalyticalRunResult{answer:AskAladdinAnswer;queryPlan:QueryPlan;dataset:ResultDataset;activityEvents:ActivityEvent[]}
