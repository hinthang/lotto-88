const fs=require('fs'), vm=require('vm'), crypto=require('crypto');
function makeSheet(name){ const rows=[];
  const sh={rows,name,setName(n){this.name=n},getMaxRows:()=>1000,getLastColumn:()=>rows[0]?rows[0].length:0,
    getLastRow:()=>{let n=rows.length; while(n>0 && !(rows[n-1]||[]).some(v=>v!==''&&v!=null)) n--; return n;},
    getRange(a,b,c,d){ const r=a,col=b,nr=c||1,nc=d||1;
      return {
        setValues(v){ v.forEach((row,i)=>{ rows[r-1+i]=rows[r-1+i]||[]; row.forEach((x,j)=>rows[r-1+i][col-1+j]=String(x));}); return this;},
        setValue(x){ rows[r-1]=rows[r-1]||[]; rows[r-1][col-1]=String(x); return this;},
        getDisplayValues(){ const out=[]; for(let i=0;i<nr;i++){const row=[];for(let j=0;j<nc;j++)row.push((rows[r-1+i]||[])[col-1+j]??'');out.push(row);} return out;},
        getDisplayValue(){ return (rows[r-1]||[])[col-1]??''; },
        setNumberFormat(){return this}, setFontWeight(){return this},
        clearContent(){ for(let i=0;i<nr;i++){ if(rows[r-1+i]) for(let j=0;j<nc;j++) rows[r-1+i][col-1+j]=''; } return this;}};},
    setFrozenRows(){}, appendRow(v){ rows.splice(sh.getLastRow(),0,v.map(String)); }, deleteRow(i){rows.splice(i-1,1)} };
  return sh; }
const sheets={}; const props={}; const cacheStore={};
let calls=0;
const ss={getSheetByName:n=>Object.values(sheets).find(s=>s.name===n)||null,insertSheet:n=>{const s=makeSheet(n); sheets[n+Math.random()]=s; return s;}};
const ctx={
  SpreadsheetApp:{getActiveSpreadsheet:()=>ss},
  ScriptApp:{getService:()=>({getUrl:()=>'https://script.google.com/macros/s/XYZ/exec'}),getProjectTriggers:()=>[],deleteTrigger(){},newTrigger:()=>{const b={timeBased:()=>b,everyDays:()=>b,onMonthDay:()=>b,atHour:()=>b,nearMinute:()=>b,inTimezone:()=>b,create:()=>b};return b;}},
  Logger:{log:(...a)=>console.log('LOG',...a)},
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]??null,setProperty:(k,v)=>{props[k]=v},deleteProperty:k=>{delete props[k]},getProperties:()=>({...props})})},
  CacheService:{getScriptCache:()=>({get:k=>cacheStore[k]??null,put:(k,v)=>{cacheStore[k]=v},remove:k=>{delete cacheStore[k]}})},
  Utilities:{sleep(){},getUuid:()=>crypto.randomUUID(),base64Encode:b=>Buffer.from(b).toString('base64'),
    computeHmacSha256Signature:(v,k)=>[...crypto.createHmac('sha256',k).update(v,'utf8').digest()].map(x=>x>127?x-256:x),
    base64EncodeWebSafe:b=>Buffer.from(b.map(x=>x&255)).toString('base64url'),
    base64DecodeWebSafe:s=>[...Buffer.from(s,'base64url')].map(x=>x>127?x-256:x),
    computeDigest:(alg,s)=>[...crypto.createHash('sha256').update(s,'utf8').digest()],DigestAlgorithm:{SHA_256:1},Charset:{UTF_8:1},
    formatDate:(d,tz,f)=>{const b=new Date(d.getTime()+7*3600e3);const p=n=>String(n).padStart(2,'0');
     if(f==='H')return String(b.getUTCHours()); if(f==='yyyy-MM-dd')return b.getUTCFullYear()+'-'+p(b.getUTCMonth()+1)+'-'+p(b.getUTCDate());
     return b.toISOString().slice(0,16).replace('T',' ');}},
  UrlFetchApp:{fetchAll:reqs=>reqs.map(r=>fake(r)), fetch:(u,r)=>fake(Object.assign({url:u},r||{}))},
  ContentService:{createTextOutput:t=>({text:t})},
  console, JSON, Date, Math, Object, Array, String, Number, RegExp,
};
const linePushes=[];
function fake(req){ calls++;
  if(String(req.url||'').includes('api.line.me')){ linePushes.push({path:req.url.split('/').pop(),body:JSON.parse(req.payload)}); return {getResponseCode:()=>200,getContentText:()=>'{}'}; }
  if(String(req.url||'').includes('graph.sanook')) return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({data:{laoLottoes:{edges:[
     {node:{dateSlug:'02112569',prizeResult:{last4Prize:'4321'}}},{node:{dateSlug:'30102569',prizeResult:{last4Prize:'3206'}}},{node:{dateSlug:'03112569',prizeResult:{last4Prize:''}}}]}}})};
  const p=JSON.parse(req.payload); const date=p.year+'-'+p.month+'-'+p.date;
  const body= date==='2026-11-16'?{response:{result:{date,data:{first:{number:[{value:'111111'}]},second:{number:[{value:'357846'}]},last3f:{number:[{value:'357'},{value:'000'}]},last3b:{number:[{value:'999'},{value:'888'}]},last2:{number:[{value:'46'}]}}}}}:{response:{result:null}};
  return {getResponseCode:()=>200,getContentText:()=>JSON.stringify(body)}; }
vm.createContext(ctx); vm.runInContext(fs.readFileSync(process.argv[2]||__dirname+'/../src/Code.gs','utf8'),ctx);
module.exports={ctx,sheets,props,ss,linePushes};
