import {launchTokens} from "@/app/data/synthetic/launches";

function escape(value:string){return value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&apos;"}[character]!))}
export async function GET(_:Request,{params}:{params:Promise<{tokenId:string}>}){
  const {tokenId}=await params;const token=launchTokens.find(item=>item.id===tokenId);
  if(!token)return new Response("Unknown token",{status:404});
  const symbol=escape(token.symbol.slice(0,6)),color=escape(token.color);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#6f45e8"/></linearGradient></defs><rect width="512" height="512" rx="96" fill="url(#g)"/><circle cx="256" cy="230" r="146" fill="#090811" fill-opacity=".76"/><text x="256" y="267" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-weight="800" font-size="78">${symbol}</text><text x="256" y="425" text-anchor="middle" fill="white" fill-opacity=".78" font-family="Arial,sans-serif" font-size="27">ALADDIN DEVNET</text></svg>`;
  return new Response(svg,{headers:{"content-type":"image/svg+xml","cache-control":"public, max-age=86400"}});
}

