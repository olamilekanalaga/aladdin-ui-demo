import type { ComponentType, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export function Avatar({ token, large = false }: { token: { symbol: string }; large?: boolean }) {
  return <div className={`avatar ${large ? "large" : ""}`}>{token.symbol.slice(0, 2)}</div>;
}

export function Metric({ label, value }: { label: string; value: ReactNode }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

export function Panel({ title, icon: Icon, children }: { title: string; icon: ComponentType<{ size?: number }>; children: ReactNode }) {
  return <section className="panel"><h2><Icon size={18} />{title}</h2>{children}</section>;
}

export function Table({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  if (!rows.length) return <Empty text="No rows available." />;
  return <div className="table-wrap"><table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={`${i}-${j}`}>{c}</td>)}</tr>)}</tbody></table></div>;
}

export function Empty({ text }: { text: string }) {
  return <div className="empty"><AlertTriangle size={18} />{text}</div>;
}

export function List({ items }: { items: string[] }) {
  return items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">No missing inputs reported.</p>;
}
