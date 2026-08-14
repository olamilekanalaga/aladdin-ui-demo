import Link from "next/link";
import type {AdaptivePresentation} from "@/app/types/ask-aladdin/adaptive";
export function ContextualActions({presentation}:{presentation:AdaptivePresentation}){if(!presentation.token)return null;return <div className="adaptiveActions"><Link href={`/live/${presentation.token.id}?view=${encodeURIComponent(presentation.terminalView||"Live State")}`}>Open Terminal</Link></div>}
