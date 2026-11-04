const {ctx}=require('./mock');
ctx.setup(); ctx.register({username:'benz',password:'secret1',name:'b'}); const a=ctx.login({username:'benz',password:'secret1'});
for (const [g,date,nums] of [['th','2026-11-01',['357846','123485']],['n3','2026-11-01',['422','224','738']],['lao','2026-10-30',['3206','1234']]]) {
  nums.forEach(n=>ctx.addTicket(a.token,{game:g,date,number:n,qty:2}));
  ctx.addTicket(a.token,{game:g,date,number:nums[0],qty:3}); // merge
  const l=ctx.listTickets?null:null;
  const d=ctx.getDashboard(a.token,g); console.log('\n==',g, d.tickets.map(t=>t.number+'x'+t.qty+' '+t.status+' '+t.total).join(' | '));
  const f=ctx.getFollow(a.token,g);
  console.log('date',f.date,'next',f.next,'totalNext',f.totalNext);
  f.items.forEach(x=>console.log(x.number,'x'+x.qty,x.verdict.text,x.score,JSON.stringify(x.why),'simAll',JSON.stringify(x.simAll),'recent',x.simRecent.hits,x.simRecent.back,'s2',JSON.stringify(x.s2r),'match',x.match.join(';'),'my',JSON.stringify(x.my)));
}
const id=ctx.getDashboard(a.token,'th').tickets[0].id; console.log(ctx.setTicketQty(a.token,id,5,'th')[0].qty);
console.log(ctx.resultText_('n3', ctx.readN3_().pop(), [{num:'422',qty:3,res:ctx.checkN3_('422',ctx.readN3_().pop())}]));
