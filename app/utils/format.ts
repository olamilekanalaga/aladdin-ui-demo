export const money=(v:number)=>v>=1e6?`$${(v/1e6).toFixed(2)}M`:v>=1e3?`$${(v/1e3).toFixed(v<1e4?1:0)}K`:`$${v}`;
export const pct=(v:number)=>`${v>0?"+":""}${v.toFixed(1)}%`;
