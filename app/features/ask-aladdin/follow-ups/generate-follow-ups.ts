export function generateFollowUps(question:string){
 if(/migration specialist|wallets.*holding/i.test(question))return["Show their previous profitable tokens.","Which wallet holds the most BARK?","When did these wallets start reducing?","Compare these wallets with BARK’s Scalpers."];
 if(/compare|differently|frog/i.test(question))return["Which early BARK wallets are still holding?","Show the liquidity changes by lifecycle stage.","Compare creator-linked selling."];
 if(/woke up|today|while i was away/i.test(question))return["Which tokens retained the most early buyers?","Show profitable wallets that entered today.","Which migrations lost liquidity fastest?"];
 return["Which Migration Specialists are still holding BARK?","Compare BARK with FROG.","Show the strongest retention tokens."];
}
