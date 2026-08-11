import type { ReactNode } from "react";
import { solscanWallet } from "@/app/utils/links";
import type { IfaMessage } from "./ifa-types";

export const WALLET_RESULTS_ROWS: ReactNode[][] = [
  [<a className="text-link" href={solscanWallet("8xA92pMf7YQdrm14LdzQdK9nLXbz72pK3vMGRqfE9az")} target="_blank" rel="noreferrer">8xA...9az</a>, "#12", "4.2 SOL", "72%", "28%"],
  [<a className="text-link" href={solscanWallet("3Df6Qe2SAqvBz5qTWVng4FCJTFm6cZ1rq9KoU6sH2Rkt")} target="_blank" rel="noreferrer">3Df...Rkt</a>, "#19", "7.8 SOL", "41%", "59%"],
  [<a className="text-link" href={solscanWallet("Cw17Gk4QCLhGGVFgjhj7GNsuWAxtc6oE67bEJqm89wnP")} target="_blank" rel="noreferrer">Cw1...wnP</a>, "#24", "2.9 SOL", "0%", "100%"],
  [<a className="text-link" href={solscanWallet("Hf4CpM7DqkAd7WoY5ntPnK24dXBCiTbe27xtBz1KuBfA")} target="_blank" rel="noreferrer">Hf4...BfA</a>, "#31", "5.1 SOL", "88%", "12%"]
];

export const REFINED_WALLET_ROWS: ReactNode[][] = [
  [<a className="text-link" href={solscanWallet("3Df6Qe2SAqvBz5qTWVng4FCJTFm6cZ1rq9KoU6sH2Rkt")} target="_blank" rel="noreferrer">3Df...Rkt</a>, "#19", "7.8 SOL", "41%", "59%"],
  [<a className="text-link" href={solscanWallet("Cw17Gk4QCLhGGVFgjhj7GNsuWAxtc6oE67bEJqm89wnP")} target="_blank" rel="noreferrer">Cw1...wnP</a>, "#24", "2.9 SOL", "0%", "100%"],
  [<a className="text-link" href={solscanWallet("9pVNQ1kmgA68Mq3HQhN6eknW2iJGTd9M9LLoV6zF1SxP")} target="_blank" rel="noreferrer">9pV...SxP</a>, "#38", "6.4 SOL", "54%", "46%"]
];

export const DEMO_IFA_MESSAGES: IfaMessage[] = [
  {
    role: "user",
    text: "Which wallets bought this token before migration and were still holding 10 minutes after migration?",
    timestamp: "Investigation start"
  },
  {
    role: "ifa",
    text: "I found 47 wallets meeting those conditions. The cohort is mixed: most exited, but a small group retained meaningful supply after migration.",
    timestamp: "Demo evidence",
    provenance: ["Observation period: pre-migration to 10 minutes after migration", "Coverage: 47 matching wallets", "Freshness: mock state for frontend demonstration"],
    blocks: [
      {
        kind: "metrics",
        title: "Cohort summary",
        metadata: "Mock values; backend will supply verified counts later.",
        items: [
          { label: "Fully exited", value: "31", detail: "Sold 95%+ of acquired supply" },
          { label: "Partial position", value: "11", detail: "Still hold less than 50%" },
          { label: "Retained 50%+", value: "5", detail: "Higher-conviction holders" }
        ]
      },
      {
        kind: "table",
        title: "Wallet results",
        subtitle: "47 wallets",
        columns: ["Wallet", "Entry", "Bought", "Sold", "Remaining"],
        rows: WALLET_RESULTS_ROWS,
        actions: ["Chart", "Full Table", "Open in Terminal", "Export"]
      },
      {
        kind: "chart",
        title: "Retention distribution",
        subtitle: "Mock split of retained supply after migration",
        points: [
          { label: "Exited", value: 66, detail: "31 wallets" },
          { label: "Partial", value: 24, detail: "11 wallets" },
          { label: "50%+", value: 10, detail: "5 wallets" }
        ],
        actions: ["Open in Terminal", "Export"]
      }
    ]
  },
  {
    role: "user",
    text: "Now only show wallets that have done this on 5+ tokens.",
    timestamp: "Follow-up"
  },
  {
    role: "ifa",
    text: "That reduces the cohort from 47 to 8 wallets. These look more like repeated behaviour patterns than one-off participation.",
    timestamp: "Refined cohort",
    provenance: ["Context preserved from the previous question", "Filter added: matching pattern on 5+ tokens", "Result count: 8 wallets"],
    blocks: [
      {
        kind: "metrics",
        title: "Refined cohort",
        metadata: "Same investigation, narrower wallet history filter.",
        items: [
          { label: "Remaining wallets", value: "8", detail: "Previously 47" },
          { label: "Median repeats", value: "7", detail: "Tokens with same behaviour" },
          { label: "High retention", value: "3", detail: "Held 50%+ after migration" }
        ]
      },
      {
        kind: "table",
        title: "Repeated wallet pattern",
        subtitle: "8 wallets",
        columns: ["Wallet", "Entry", "Bought", "Sold", "Remaining"],
        rows: REFINED_WALLET_ROWS,
        actions: ["Full Table", "Open in Terminal", "Export"]
      }
    ]
  }
];

export function downloadIfaCsv() {
  const csv = [
    "wallet,entry,bought,sold,remaining",
    "8xA...9az,#12,4.2 SOL,72%,28%",
    "3Df...Rkt,#19,7.8 SOL,41%,59%",
    "Cw1...wnP,#24,2.9 SOL,0%,100%"
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ask_ifa_wallet_results_demo.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function createMockIfaResponse(question: string): IfaMessage {
  const lower = question.toLowerCase();
  const tokenIntent = /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(question) || lower.includes("token") || lower.includes("contract");
  const walletIntent = lower.includes("wallet") || lower.includes("holder") || lower.includes("first 100");
  const historicalIntent = lower.includes("historical") || lower.includes("formation") || lower.includes("compare");

  if (historicalIntent) {
    return {
      role: "ifa",
      text: "I can structure this as a historical formation search. This mock answer shows where matched cohorts, observation windows and descriptive outcomes will render once the backend supplies evidence.",
      timestamp: "Mock response",
      provenance: ["Historical sample: demo only", "No prediction returned", "Use Terminal for manual inspection"],
      blocks: [
        { kind: "metrics", title: "Historical comparison", metadata: "Demo values only.", items: [
          { label: "Similar formations", value: "126", detail: "Matched by behaviour mix" },
          { label: "Exceeded 5x", value: "17%", detail: "Descriptive outcome, not a forecast" },
          { label: "Failed below entry", value: "42%", detail: "Risk context" }
        ]},
        { kind: "timeline", title: "Formation timeline", events: [
          { time: "T+0", label: "Launch detected", detail: "Token entered observation set" },
          { time: "T+4m", label: "Fresh Wallet surge", detail: "Behaviour concentration increased" },
          { time: "T+18m", label: "Migration Specialist entries", detail: "Repeated-wallet cohort appeared" }
        ]}
      ]
    };
  }

  if (walletIntent) {
    return {
      role: "ifa",
      text: "I found a wallet cohort that can be reviewed as evidence. This prototype keeps the answer descriptive and leaves the trading decision to the user.",
      timestamp: "Mock response",
      provenance: ["Wallet evidence: demo only", "Coverage: 47 wallets", "Export available for manual research"],
      blocks: [
        { kind: "metrics", title: "Wallet cohort", metadata: "Mock values only.", items: [
          { label: "Wallets", value: "47", detail: "Matched current filter" },
          { label: "Repeated pattern", value: "8", detail: "Seen on 5+ tokens" },
          { label: "Retained 50%+", value: "5", detail: "After migration" }
        ]},
        { kind: "table", title: "Wallet results", subtitle: "47 wallets", columns: ["Wallet", "Entry", "Bought", "Sold", "Remaining"], rows: WALLET_RESULTS_ROWS, actions: ["Full Table", "Open in Terminal", "Export"] }
      ]
    };
  }

  return {
    role: "ifa",
    text: tokenIntent ? "I treated this as a token intelligence query. The response can combine token facts, wallet cohorts, charts and terminal actions when live evidence is available." : "I can turn this into an Aladdin evidence query. This mock response demonstrates the response structure that the backend will later populate.",
    timestamp: "Mock response",
    provenance: ["Demo response", "Backend integration pending", "No buy/sell recommendation generated"],
    blocks: [
      { kind: "metrics", title: "Token evidence shell", metadata: "Placeholder architecture for future verified data.", items: [
        { label: "Matched wallets", value: "47", detail: "Demo cohort" },
        { label: "Known behaviours", value: "5", detail: "Fresh, Creator, Migration, Scalper, Sniper" },
        { label: "Terminal handoff", value: "Ready", detail: "Open deeper view" }
      ]},
      { kind: "chart", title: "Evidence trend", subtitle: "Mock chart response block", points: [
        { label: "Launch", value: 26, detail: "Baseline" },
        { label: "Pre-mig", value: 58, detail: "Buyer activity" },
        { label: "Migration", value: 74, detail: "Wallet retention" },
        { label: "+10m", value: 46, detail: "Post-migration" }
      ], actions: ["Open in Terminal", "Export"] }
    ]
  };
}
