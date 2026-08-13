import type {AnswerMode,AskAladdinAnswer,ResolvedAnalysisPeriod} from "@/app/types/ask-aladdin";
import {planAskAladdinQuery} from "@/app/features/ask-aladdin/planning/query-planner";
import {executeSyntheticQuery} from "@/app/features/ask-aladdin/execution/synthetic-executor";
import {interpretDataset} from "@/app/features/ask-aladdin/interpretation/profile-interpreter";
import {formatAnalyticalAnswer} from "@/app/features/ask-aladdin/formatting/answer-formatter";
import {generateFollowUps} from "@/app/features/ask-aladdin/follow-ups/generate-follow-ups";

/** Compatibility adapter for persisted legacy turns. New runs use runAskAladdinAnalysis. */
export function buildStructuredAnswer(question:string,mode:AnswerMode,period:ResolvedAnalysisPeriod):AskAladdinAnswer{
 const plan=planAskAladdinQuery({question,mode,period}),dataset=executeSyntheticQuery(plan);
 return formatAnalyticalAnswer(question,mode,plan,dataset,interpretDataset(mode,plan,dataset),generateFollowUps(question));
}
