// node render.js <html> <part> <fps> <scale> <worker> <nworkers> <outdir>
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const [html,part,fps,scale,wk,nw,out]=process.argv.slice(2);
 const b=await chromium.launch();const H=process.env.ORIENT==='h';const p=await b.newPage({viewport:H?{width:1024,height:576}:{width:576,height:1024},deviceScaleFactor:+scale});
 await p.goto('file://'+html+'?render=1&part='+part+(process.env.ORIENT==='h'?'&orient=h':''));await p.evaluate(async()=>{await document.fonts.load('900 40px Cinzel');await document.fonts.ready});
 const total=await p.evaluate(()=>getTotal());const N=Math.ceil(total*fps);
 const per=Math.ceil(N/nw), a=wk*per, e=Math.min(N,a+per);
 fs.mkdirSync(out,{recursive:true});
 for(let i=a;i<e;i++){await p.evaluate(t=>renderAt(t),i/fps);await p.screenshot({path:`${out}/${String(i).padStart(6,'0')}.jpg`,type:'jpeg',quality:88});}
 await b.close();console.log('done',wk,a,e);
})();
