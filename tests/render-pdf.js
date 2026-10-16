'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
const root=process.argv[2],deps=process.argv[3];
const {createCanvas,DOMMatrix,ImageData,Path2D}=require(path.join(deps,'node_modules','@napi-rs','canvas'));Object.assign(globalThis,{DOMMatrix,ImageData,Path2D});
const pdfjs=await import(pathToFileURL(path.join(deps,'node_modules','pdfjs-dist','legacy','build','pdf.mjs')).href);
const output=path.join(root,'qa-artifacts');const pdfs=(await fs.readdir(output)).filter(f=>f.endsWith('.pdf'));let count=0;const images=[];
for(const f of pdfs){const task=pdfjs.getDocument({data:new Uint8Array(await fs.readFile(path.join(output,f))),useSystemFonts:true,standardFontDataUrl:pathToFileURL(path.join(deps,'node_modules','pdfjs-dist','standard_fonts')+path.sep).href});const doc=await task.promise;
for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n),vp=page.getViewport({scale:1.25}),canvas=createCanvas(Math.ceil(vp.width),Math.ceil(vp.height)),ctx=canvas.getContext('2d');await page.render({canvasContext:ctx,viewport:vp}).promise;const name=f.replace('.pdf','')+'-page'+n+'.png';await fs.writeFile(path.join(output,name),canvas.toBuffer('image/png'));images.push({canvas,name});count++;}if(typeof task.destroy==='function')await task.destroy();}
const contact=createCanvas(3*400,Math.ceil(images.length/3)*590),cx=contact.getContext('2d');cx.fillStyle='#dfe4e8';cx.fillRect(0,0,contact.width,contact.height);images.forEach((im,i)=>{const x=(i%3)*400,y=Math.floor(i/3)*590;cx.fillStyle='#1d2733';cx.font='11px sans-serif';cx.fillText(im.name,x+8,y+16);cx.drawImage(im.canvas,x+8,y+24,384,544);});await fs.writeFile(path.join(output,'pdf-contact.png'),contact.toBuffer('image/png'));console.log(JSON.stringify({renderedPages:count,pdfs:pdfs.length}));
})().catch(e=>{console.error(e);process.exitCode=1;});
