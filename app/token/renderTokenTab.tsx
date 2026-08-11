import { Trades } from "./Trades";
import { Participants } from "./Participants";
import { MostProfitable } from "./MostProfitable";
import { LargestHolders } from "./LargestHolders";
import { First100 } from "./First100";
import { Holders } from "./Holders";
import { Overview } from "./Overview";
import type { TokenBundle } from "@/app/types";

export function renderTokenTab(bundle: TokenBundle, tab: string) {
  if (tab === "participants") return <Participants rows={bundle.participants} />;
  if (tab === "most-profitable") return <MostProfitable bundle={bundle} />;
  if (tab === "largest-holders") return <LargestHolders bundle={bundle} />;
  if (tab === "first-100") return <First100 bundle={bundle} />;
  if (tab === "holders") return <Holders bundle={bundle} />;
  if (tab === "overview") return <Overview bundle={bundle} />;
  return <Trades rows={bundle.trades} />;
}
