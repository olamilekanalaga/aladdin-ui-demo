export type AladdinAccountMode="demo"|"google"|"telegram"|null;
export const ALADDIN_ACCOUNT_KEY="aladdin-account-mode-v1";
export function beginLocalAccount(mode:Exclude<AladdinAccountMode,null>){localStorage.setItem(ALADDIN_ACCOUNT_KEY,mode);dispatchEvent(new Event("aladdin-account-change"))}
export function readLocalAccount():AladdinAccountMode{const value=localStorage.getItem(ALADDIN_ACCOUNT_KEY);return value==="demo"||value==="google"||value==="telegram"?value:null}
export function endLocalAccount(){localStorage.removeItem(ALADDIN_ACCOUNT_KEY);dispatchEvent(new Event("aladdin-account-change"))}
