import type { ReactNode } from "react";

export type IfaMetric = {
  label: string;
  value: string;
  detail?: string;
};

export type IfaEvidenceBlock =
  | { kind: "metrics"; title: string; metadata?: string; items: IfaMetric[] }
  | { kind: "table"; title: string; subtitle: string; columns: string[]; rows: ReactNode[][]; actions?: string[] }
  | { kind: "chart"; title: string; subtitle: string; points: { label: string; value: number; detail: string }[]; actions?: string[] }
  | { kind: "timeline"; title: string; events: { time: string; label: string; detail: string }[] };

export type IfaMessage = {
  role: "user" | "ifa";
  text: string;
  timestamp?: string;
  provenance?: string[];
  blocks?: IfaEvidenceBlock[];
};
