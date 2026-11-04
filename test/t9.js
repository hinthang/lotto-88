const {ctx}=require('./mock');
console.log(ctx.setup()); ctx.register({username:'benz',password:'secret1',name:'b'}); const a=ctx.login({username:'benz',password:'secret1'});
const d=ctx.getDashboard(a.token,'n3');
console.log('total',d.total,'latest',JSON.stringify(d.latest[0]),'dates',d.dates.length,d.dates[0],'pay',d.n3pay.length);
console.log(JSON.stringify(ctx.checkNumber(a.token,'n3','2026-11-01','224').result));
console.log(JSON.stringify(ctx.checkNumber(a.token,'n3','2026-11-01','242').result));
console.log(JSON.stringify(ctx.checkNumber(a.token,'n3','2026-11-01','185').result));
console.log(JSON.stringify(ctx.checkNumber(a.token,'n3','2026-11-01','224000002001').result));
const s=ctx.search(a.token,'n3','85'); console.log('search85',s.hits.length,s.hits.map(h=>h.date+h.where).join(';'));
const s3=ctx.search(a.token,'n3','422'); console.log('search422',s3.hits.map(h=>h.date+h.where).join(';'));
ctx.addTicket(a.token,{game:'n3',date:'2026-11-01',number:'422'});
ctx.addTicket(a.token,{game:'n3',date:'2026-11-16',number:'123'});
const d2=ctx.getDashboard(a.token,'n3'); console.log('tix',JSON.stringify(d2.tickets));
const t=ctx.getTips(a.token,'n3'); console.log('tips',t.game,t.target,t.three.map(x=>x.n).join(','));
console.log(ctx.addDraw(a.token,{game:'n3',date:'2026-10-16',p3:'2191',psw:'339',p2:'557',sp:'781000004657',psp:'765516'}));
try{ctx.addTicket(a.token,{game:'n3',date:'2026-11-01',number:'4220'})}catch(e){console.log('err ok',e.message)}
console.log(ctx.parseN3Text_('<p>ผลสลาก N3 3 ตัวตรง เลข 224 รับเงินรางวัล 4,564 บาท 3 ตัวสลับหลัก 242, 422 รับ 2,490 บาท 2 ตัวตรง เลข 85 รับ 326 บาท รางวัลพิเศษ 224000002001 รับ 886,662 บาท</p>'));
