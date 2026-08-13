export const answerModes=["Trader","Analyst","Researcher","Token Creator"] as const;
export type AnswerMode=(typeof answerModes)[number];
export type Availability="available"|"unknown"|"unavailable"|"not_observed";
export type EvidenceKind="fact"|"calculated_metric"|"behaviour_observation"|"historical_comparison"|"inference"|"uncertainty"|"missing_evidence";

export interface AuthenticatedUserProfile{id:string;primaryProfile:AnswerMode;defaultAnswerMode:AnswerMode;timezone:string;displayName:string}
export interface ConsentSettings{personalisation:boolean;memory:boolean;retentionDays:number|null;updatedAt:string}
export interface SubscriptionEntitlements{plan:"Free"|"Basic"|"Pro"|"Research or Team";historyDays:number;queryLimit:number;historicalMatchLimit:number;exports:boolean;sharedWorkspaces:boolean}
export interface MemoryItem{id:string;kind:"entity"|"preference"|"question"|"hypothesis";value:string;createdAt:string;expiresAt:string|null}
export interface EvidenceValue{value:string|number|null;unit?:string;availability:Availability}
export interface EvidenceObject{id:string;kind:EvidenceKind;label:string;value:EvidenceValue;detail:string;source:string;observedAt:string;freshness:string;coverage:string;ruleVersion:string;limitations?:string;terminalView?:string}
export interface EvidenceSnapshot{id:string;hash:string;tokenId:string;tokenSymbol:string;capturedAt:string;evidence:EvidenceObject[];comparisons:{id:string;label:string;outcome:string;similarity:number;difference:string}[]}
export interface ResolvedAnalysisPeriod{start:string;end:string;timezone:string;label:string;resolution:"today"|"since_last_active"|"since_last_checked"|"current_snapshot"}
export interface QuerySession{id:string;title:string;primaryProfile:AnswerMode;answerMode:AnswerMode;entityId:string;entityLabel:string;analysisPeriod:ResolvedAnalysisPeriod|null;questions:string[];createdAt:string;updatedAt:string}
export interface AnswerClaim{id:string;kind:EvidenceKind;title:string;body:string;evidenceIds:string[];terminalView?:string}
export interface AskAladdinAnswer{mode:AnswerMode;headline:string;summary:string;sections:{title:string;claims:AnswerClaim[]}[];limitations:string[];followUps:string[];evidenceSnapshotId:string;evidenceHash:string}

// Production-facing contracts. Phase 1 supplies deterministic local implementations.
export interface UserProfileRepository{get():AuthenticatedUserProfile|null;save(profile:AuthenticatedUserProfile):void}
export interface MemoryRepository{list():MemoryItem[];delete(id:string):void;clear():void}
export interface ConsentRepository{get():ConsentSettings;save(settings:ConsentSettings):void}
export interface EntitlementService{get():SubscriptionEntitlements}
export interface ConversationRepository{list():QuerySession[];save(session:QuerySession):void;delete(id:string):void}
export interface ProductionTimezoneResolver{resolve(query:string,queryTimestamp:string,timezone:string,lastActive:string,lastChecked:string):ResolvedAnalysisPeriod}
