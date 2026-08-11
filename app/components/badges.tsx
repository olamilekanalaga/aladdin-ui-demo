import type { ReactNode } from "react";
import type { Confidence } from "@/app/types";

export function behaviourClass(value: string) {
  const key = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
  return `behaviour behaviour-${key}`;
}

export function BehaviourBadge({ value }: { value: string }) {
  return <span className={behaviourClass(value)}>{value}</span>;
}

export function ConfidenceBadge({ value }: { value: Confidence }) {
  const labels: Record<Confidence, string> = { verified: "Verified", partial: "Partial", demo_only: "Evidence", unavailable: "Unavailable" };
  return <span className={`confidence ${value}`}>{labels[value]}</span>;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "purple" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
