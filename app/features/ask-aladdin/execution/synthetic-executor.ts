import type {QueryPlan,ResultDataset} from "@/app/types/analytics/query";
import {barkFrogComparison,barkMigrationSpecialists,comparisonColumns,tokenColumns,tokenResultRows,walletColumns} from "@/app/data/synthetic/ask-aladdin/query-fixtures";

export function executeSyntheticQuery(plan:QueryPlan):ResultDataset{
 const unavailable=plan.filters.some(filter=>filter.field==="marketCap"&&Number(filter.value)>=1_000_000);
 const rows=unavailable?[]:plan.kind==="wallets"?barkMigrationSpecialists:plan.kind==="comparison"?barkFrogComparison:tokenResultRows;
 const columns=plan.kind==="wallets"?walletColumns:plan.kind==="comparison"?comparisonColumns:tokenColumns;
 const displayedRows=Math.min(rows.length,plan.limit||10);
 return{columns,rows,totalRows:rows.length,displayedRows,availability:rows.length?"available":"unavailable"};
}
