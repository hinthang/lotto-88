const {ctx,linePushes}=require('./mock');
ctx.setup(); ctx.register({username:'benz',password:'secret1',name:'b'}); const a=ctx.login({username:'benz',password:'secret1'});
ctx.PropertiesService.getScriptProperties().setProperty('LINE_CHANNEL_TOKEN','x');
const m=ctx.findMember_('benz'); ctx.memberSheet_().getRange(m.row,9).setValue('Uabc');
const say=t=>{ linePushes.length=0; ctx.doPost({postData:{contents:JSON.stringify({events:[{type:'message',replyToken:'r',source:{userId:'Uabc'},message:{type:'text',text:t}}]})}}); const r=linePushes[0]; console.log('\n>>> '+t+'\n'+(r?r.body.messages[0].text:'(no reply)')); };
say('วิธีใช้');
say('357846 x2\nN3 422 x5\nลาว 1234 3 ใบ\n846');
say('งบ 300');
say('เลขของฉัน');
say('ลบ 846'); say('ลบ 1234');
say('เลขเด็ด'); say('เลขเด็ด N3'); say('ผล N3'); say('ผล ลาว');
say('ควรตาม');
say('สวัสดี');
say('เตือน ปิด'); say('เตือน เปิด');
// unlinked user
linePushes.length=0; ctx.doPost({postData:{contents:JSON.stringify({events:[{type:'message',replyToken:'r',source:{userId:'Uzzz'},message:{type:'text',text:'357846'}}]})}}); console.log('\n>>> unlinked\n'+linePushes[0].body.messages[0].text);
console.log('\nMONEY',JSON.stringify(ctx.getMoney(a.token)).slice(0,600));
// reminder: pretend today is 2026-11-15
ctx.today_=()=> '2026-11-15';
linePushes.length=0; console.log(ctx.remindDraws()); console.log(linePushes[0]&&linePushes[0].body.messages[0].text);
console.log(ctx.remindDraws());
ctx.today_=()=> '2026-12-31'; console.log(ctx.remindDraws().slice(0,60)); ctx.today_=()=> '2026-12-30'; console.log(ctx.remindDraws().slice(0,60));
console.log(ctx.nextDrawDate_('th','2026-12-16'));
