export type Behaviour = 'Migration Specialist'|'Scalper'|'Creator'|'Cluster Wallet'|'Fresh Wallet'|'Unknown'|'Bundle Specialist'|'Insider';
export type TokenTab = 'trades'|'participants'|'profitable'|'largest-holders'|'first-100'|'holders'|'live'|'formation'|'historical';

export type Token = {
  id:string; symbol:string; name:string; contract:string; contractSnippet:string; marketCap:number; liquidity:number;
  volume5m:number; volume24h:number; age:string; migration:number; buys:number; sells:number; holders:number;
  holderGrowth:number; netFlow:number; labelledWallets:number; migrated:boolean; color:string; tokenExplorerUrl:string;
};
export type Wallet = {
  address:string; snippet:string; avatarUrl?:string; behaviours:Behaviour[]; firstSeen:string; lastActive:string;
  pnl7d:number; pnl30d:number; pnlAll:number; roi:number; winRate:number; trades:number; tokensTraded:number;
  walletExplorerUrl:string;
};
export type Trade = {
  id:string; tokenId:string; walletAddress:string; time:string; side:'Buy'|'Sell'; sizeSol:number; pnl:number; roi:number;
  behaviour:Behaviour; signature:string; transactionExplorerUrl:string; walletExplorerUrl:string;
};
export type ParticipantCohort = {behaviour:Behaviour;wallets:number;buys:number;sells:number;net:number;holding:number;underlyingWallets:string[]};
export type WalletTokenEvidence = {
  tokenId:string; walletAddress:string; behaviour:Behaviour; entryRank:number; entryTime:string; buySizeUsd:number; buySizeSol:number;
  supplyAcquired:number; sold:number; remaining:number; pnl:number; timeline:{label:string;time:string;value:string}[];
};

const glippyContract='5NgDxD1en3YXvS9amAtgb15nc4oRfuGxomcAfu4wpump';
export const tokens:Token[]=[
  {id:'glippy',symbol:'GLIPPY',name:'Glippy',contract:glippyContract,contractSnippet:'5NgD…pump',marketCap:269871,liquidity:41588,volume5m:53700,volume24h:1240000,age:'12h 24m',migration:100,buys:12542,sells:11201,holders:2543,holderGrowth:142,netFlow:12430,labelledWallets:142,migrated:true,color:'#42c98d',tokenExplorerUrl:`https://solscan.io/token/${glippyContract}`},
  {id:'aurel',symbol:'AUR',name:'Aurel',contract:'7xD3tNw3mX2Sgw8WfH6VgJqRjGmJe6R2R1g4Nqpump',contractSnippet:'7xD3…pump',marketCap:1840000,liquidity:187000,volume5m:112000,volume24h:3120000,age:'42m',migration:84,buys:642,sells:416,holders:1382,holderGrowth:97,netFlow:8900,labelledWallets:88,migrated:false,color:'#7c5cff',tokenExplorerUrl:'https://solscan.io/token/7xD3tNw3mX2Sgw8WfH6VgJqRjGmJe6R2R1g4Nqpump'},
  {id:'nova',symbol:'NOVA',name:'Nova Signal',contract:'4Qm8aX9zY7vT3wP5sD2nK6jL1hG8fR4cB9mE7qpump',contractSnippet:'4Qm8…pump',marketCap:34900,liquidity:12100,volume5m:27600,volume24h:91300,age:'47s',migration:36,buys:75,sells:31,holders:188,holderGrowth:61,netFlow:4200,labelledWallets:31,migrated:false,color:'#69a7ff',tokenExplorerUrl:'https://solscan.io/token/4Qm8aX9zY7vT3wP5sD2nK6jL1hG8fR4cB9mE7qpump'},
  {id:'kite',symbol:'KITE',name:'Kite Protocol',contract:'B1v6Qp9Ym3tL8sN2wH5xG7jF4rE6cD1kA9zM8pump',contractSnippet:'B1v6…pump',marketCap:15300,liquidity:6600,volume5m:8100,volume24h:22100,age:'1m',migration:12,buys:28,sells:19,holders:94,holderGrowth:29,netFlow:1300,labelledWallets:15,migrated:false,color:'#e9b949',tokenExplorerUrl:'https://solscan.io/token/B1v6Qp9Ym3tL8sN2wH5xG7jF4rE6cD1kA9zM8pump'},
  {id:'orb',symbol:'ORB',name:'Orbital',contract:'F7nL8sQ2mP4vX6zR1tK9wG3hB5cD7jE8aY2N6pump',contractSnippet:'F7nL…pump',marketCap:41800,liquidity:14700,volume5m:38200,volume24h:136000,age:'2m',migration:49,buys:94,sells:40,holders:247,holderGrowth:74,netFlow:6100,labelledWallets:44,migrated:false,color:'#f59e0b',tokenExplorerUrl:'https://solscan.io/token/F7nL8sQ2mP4vX6zR1tK9wG3hB5cD7jE8aY2N6pump'},
];

export const primaryWallet:Wallet={address:'CdoQKournsTERPHJwJowB7DrS2o4tvBywASHPuuumaow',snippet:'CdoQ…maow',behaviours:['Migration Specialist','Scalper'],firstSeen:'2025-12-14 10:21 UTC',lastActive:'1 min ago',pnl7d:54021,pnl30d:80785,pnlAll:214663,roi:186.7,winRate:47,trades:170,tokensTraded:63,walletExplorerUrl:'https://solscan.io/account/CdoQKournsTERPHJwJowB7DrS2o4tvBywASHPuuumaow'};
const otherWallets:Wallet[]=[
  {address:'9f8RzQx3fJ6vW2mNc7Pk1TgY4Hs8Ld5Ea2UbXK4n',snippet:'9f8R…XK4n',behaviours:['Scalper'],firstSeen:'2026-01-08',lastActive:'3m ago',pnl7d:18420,pnl30d:36780,pnlAll:88200,roi:72,winRate:41,trades:217,tokensTraded:49,walletExplorerUrl:'https://solscan.io/account/9f8RzQx3fJ6vW2mNc7Pk1TgY4Hs8Ld5Ea2UbXK4n'},
  {address:'7BKqT4mX8vY2nP6sR1cD9wF3hG5jL7aE4uZM1Ea',snippet:'7BKq…M1Ea',behaviours:['Fresh Wallet'],firstSeen:'2026-06-18',lastActive:'5m ago',pnl7d:11300,pnl30d:15900,pnlAll:15900,roi:54,winRate:62,trades:46,tokensTraded:11,walletExplorerUrl:'https://solscan.io/account/7BKqT4mX8vY2nP6sR1cD9wF3hG5jL7aE4uZM1Ea'},
];
export const wallets=[primaryWallet,...otherWallets];

export const participants:ParticipantCohort[]=[
  {behaviour:'Migration Specialist',wallets:174,buys:546,sells:32,net:514,holding:95,underlyingWallets:wallets.map(w=>w.address)},
  {behaviour:'Scalper',wallets:112,buys:415,sells:224,net:191,holding:54,underlyingWallets:[otherWallets[0].address,primaryWallet.address]},
  {behaviour:'Creator',wallets:66,buys:68,sells:42,net:26,holding:99,underlyingWallets:[otherWallets[1].address]},
  {behaviour:'Cluster Wallet',wallets:230,buys:387,sells:6,net:381,holding:6,underlyingWallets:[primaryWallet.address]},
  {behaviour:'Fresh Wallet',wallets:15,buys:46,sells:37,net:9,holding:85,underlyingWallets:[otherWallets[1].address]},
  {behaviour:'Unknown',wallets:131,buys:416,sells:150,net:266,holding:39,underlyingWallets:[otherWallets[0].address]},
];

export const trades:Trade[]=Array.from({length:18},(_,i)=>{const w=wallets[i%wallets.length],token=tokens[i%tokens.length],side:'Buy'|'Sell'=i%4===0?'Sell':'Buy';return{id:`trade-${i}`,tokenId:token.id,walletAddress:w.address,time:`${i+1}m ago`,side,sizeSol:Number((1.2+i*.37).toFixed(2)),pnl:(i%4===0?-1:1)*(320+i*87),roi:(i%4===0?-18:1)*(24+i*3.2),behaviour:w.behaviours[i%w.behaviours.length],signature:`5X7d${i}Qp3n8vY2kLm9a1b2`,transactionExplorerUrl:`https://solscan.io/tx/5X7d${i}Qp3n8vY2kLm9a1b2`,walletExplorerUrl:w.walletExplorerUrl}});

export const walletTokenEvidence:WalletTokenEvidence={tokenId:'glippy',walletAddress:primaryWallet.address,behaviour:'Migration Specialist',entryRank:1,entryTime:'3m after launch',buySizeUsd:1400,buySizeSol:28.56,supplyAcquired:1.64,sold:26,remaining:74,pnl:31400,timeline:[{label:'Initial buy',time:'3m after launch',value:'28.56 SOL'},{label:'Added position',time:'11m after launch',value:'8.20 SOL'},{label:'Partial exit',time:'2h ago',value:'26% sold'},{label:'Position observed',time:'13s ago',value:'74% remaining'}]};

export const topTokens=[{tokenId:'glippy',pnl:80332,roi:1869,behaviour:'Migration Specialist' as Behaviour},{tokenId:'aurel',pnl:13604,roi:542,behaviour:'Scalper' as Behaviour},{tokenId:'nova',pnl:8797,roi:161,behaviour:'Fresh Wallet' as Behaviour}];
export const behaviourColors:Record<Behaviour,string>={'Migration Specialist':'#E9B949','Scalper':'#F06A70','Creator':'#69A7FF','Cluster Wallet':'#50C8E8','Fresh Wallet':'#42C98D','Unknown':'#8E96A3','Bundle Specialist':'#A78BFA','Insider':'#F59E0B'};
export const candles=Array.from({length:48},(_,i)=>{const base=72+Math.sin(i/3)*7+i*.28;const up=i%5!==1;return{o:base,c:base+(up?2.1:-3.4),h:base+3.8,l:base-3.7,v:18+(i*7)%42}});
export const money=(v:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
