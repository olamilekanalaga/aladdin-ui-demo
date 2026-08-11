import { Metric } from "@/app/components/ui";

export function DemoIfaPreview({ compact = false }: { compact?: boolean }) {
  return <article className={compact ? "public-ifa-preview compact" : "public-ifa-preview"}>
    <div className="ifa-line user"><b>USER</b><p>Which first 100 buyers are still holding?</p></div>
    <div className="ifa-line ifa"><b>IFÁ</b><p>38 of the first 100 buyers still hold a position.</p></div>
    <div className="ifa-proof-grid">
      <Metric label="Fully exited" value="62" />
      <Metric label="Partial position" value="27" />
      <Metric label="Majority retained" value="11" />
    </div>
    <div className="preview-table small">
      <span>Wallet</span><span>Entry</span><span>Remaining</span>
      <b>8xA...</b><b>#12</b><b>28%</b>
      <b>3Df...</b><b>#19</b><b>59%</b>
    </div>
    {!compact && <div className="evidence-actions"><button>Chart</button><button>Full Table</button><button>Open in Terminal</button><button>Export</button></div>}
  </article>;
}
