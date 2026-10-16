(function(){
'use strict';
const E=window.BcpPort,D=E.master,$=id=>document.getElementById(id),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const scenarioNames={EQTS:'地震・津波',TCSS:'台風・高潮',TCHW:'高波・暴風'},severityNames={LIGHT:'軽度',MODERATE:'中程度',SEVERE:'重度',EXTREME:'甚大'};
const metricNames={portRecovery:'港湾機能回復率',supportTransport:'支援輸送機能',cargoHandling:'荷役機能',hinterlandLogistics:'背後物流機能',residualRisk:'残留リスク'};
let sim=null,startedAt=0,timer=null,locked=false,lastPrint='';
const timeText=seconds=>{const left=600-seconds,abs=Math.abs(left);return (left<0?'＋':'')+String(Math.floor(abs/60)).padStart(2,'0')+':'+String(abs%60).padStart(2,'0');};
function stopTimer(){if(timer!==null)clearInterval(timer);timer=null;}
function updateTimer(){const elapsed=sim?Math.floor((Date.now()-startedAt)/1000):0;$('timerLabel').textContent=timeText(elapsed);$('timerLabel').classList.toggle('overtime',elapsed>600);}
function message(parent,name,text,type='system',right=false){const row=el('div','msg-row '+(right?'right':'left'));const box=el('div','msg '+type);box.append(el('div','name',name),el('div','body',text));row.append(box);parent.append(row);return row;}
function resultNodes(parent){
 const m=E.metrics(sim),c=E.comments(sim,m);
 message(parent,'判断品質','判断得点 '+m.scores.decisionScore.toFixed(1)+' / 100\n実施 '+m.scores.completedPhaseCount+'判断 ／ 初期 '+severityNames[sim.initialSeverity]+' ／ 最終対応 '+severityNames[sim.responseLevel],'score');
 const grid=el('div','metric-grid');
 for(const [key,label]of Object.entries(metricNames)){const card=el('div','metric-card');card.append(el('div','metric-name',label),el('strong','metric-value',m[key].toFixed(1)),el('span','metric-unit',' / 100'));grid.append(card);}
 parent.append(grid);
 message(parent,'全体評価',c.overall,'result');
 for(const [key,label]of [['review','振り返り'],['missingActions','不足していた行動'],['improvements','改善の方向'],['eventReview','追加EVENTの振り返り']])message(parent,label,c[key].length?c[key].map((x,i)=>(i+1)+'. '+x).join('\n'):'該当する項目はありません。','result');
 const exportRow=el('div','pdf-export-row');const button=el('button','pdf-export-button','結果をPDF・印刷');button.type='button';button.id='pdfButton';button.addEventListener('click',printReport);exportRow.append(button);parent.append(exportRow);
 message(parent,'訓練上の留意事項','本結果は訓練用の内部設定による参考値です。実災害では現地状況と最新情報に基づいて判断してください。時間は採点に使用していません。','system');
}
function render(){
 if(!sim)return;
 const chat=$('chat');chat.replaceChildren();$('startScreen').hidden=true;chat.style.display='block';$('controlWrap').style.display='block';
 $('scenarioLabel').textContent=D.ROLE_META[sim.role].displayName+' ／ '+scenarioNames[sim.scenario]+' ／ 初期 '+severityNames[sim.initialSeverity]+' ／ 対応 '+severityNames[sim.responseLevel];
 $('turnLabel').textContent='判断 '+sim.completedPhaseIds.length+' / '+sim.targetPhaseCount;
 $('progressBar').style.width=(100*sim.completedPhaseIds.length/sim.targetPhaseCount)+'%';
 for(const h of sim.history){message(chat,h.title,h.situation,'phase');message(chat,D.ROLE_META[sim.role].displayName,h.textCore,'player',true);for(const e of sim.additionalEvents.filter(e=>e.occurredAfterPhaseId===h.phaseId))message(chat,'追加EVENT',e.eventId+'\n基本影響 '+e.baseImpact+' ／ 判断による増幅 '+e.amplification+' ／ 最終影響 '+e.finalImpact,'event');}
 const choices=$('choiceList');choices.replaceChildren();
 if(sim.finished){stopTimer();resultNodes(chat);$('promptText').textContent='シミュレーション終了';$('restartButton').hidden=false;buildPrintReport();}
 else {const p=E.byId[sim.currentPhaseId];message(chat,p.title,p.situationVariants[sim.scenario],'phase');const details=el('details','runtime-detail');details.append(el('summary','','現在の機能・需要・共有情報'),el('pre','',E.runtimeDetail(sim,p.id)));chat.append(details);$('promptText').textContent='あなたの役割として、次の対応を選択してください。';for(const choice of E.displayedChoices(p.id,sim.scenario)){const btn=el('button','choice-button');btn.type='button';btn.dataset.choiceId=choice.id;btn.append(el('span','choice-label',choice.position),el('span','choice-core',choice.textCore),el('small','choice-context',choice.context));btn.addEventListener('click',()=>choose(p.id,choice.id));choices.append(btn);} $('restartButton').hidden=true;}
 const stamp=el('div','chat-end');chat.append(stamp);requestAnimationFrame(()=>stamp.scrollIntoView({block:'end',behavior:'instant'}));
}
function choose(phaseId,choiceId){
 if(locked)return;locked=true;$('errorBox').hidden=true;
 try{sim=E.answer(sim,phaseId,choiceId);render();}
 catch(error){showError(error);}
 finally{locked=false;}
}
function showError(error){$('errorBox').textContent='処理を完了できませんでした：'+error.message;$('errorBox').hidden=false;console.error(error);}
function begin(config,options={}){
 stopTimer();locked=false;$('errorBox').hidden=true;sim=E.start(config.role,config.scenario,config.severity,options);startedAt=Date.now();$('timerLabel').textContent='10:00';timer=setInterval(updateTimer,1000);updateTimer();$('printReport').replaceChildren();lastPrint='';document.body.classList.remove('pdf-printing');render();return E.clone(sim);
}
function reset(){
 stopTimer();sim=null;startedAt=0;locked=false;lastPrint='';$('chat').replaceChildren();$('chat').style.display='none';$('controlWrap').style.display='none';$('startScreen').hidden=false;$('printReport').replaceChildren();$('errorBox').hidden=true;$('scenarioLabel').textContent='役割・災害条件を選択';$('turnLabel').textContent='判断 -- / --';$('progressBar').style.width='0%';$('timerLabel').textContent='10:00';document.body.classList.remove('pdf-printing');
}
function buildPrintReport(){
 if(!sim?.finished)return;
 const section=$('printReport');section.replaceChildren();section.setAttribute('aria-hidden','false');section.append(el('h1','','港湾BCPシミュレーション Ver.1.0'));
 const m=E.metrics(sim),c=E.comments(sim,m);const info=el('p','pdf-summary',D.ROLE_META[sim.role].displayName+' ／ '+scenarioNames[sim.scenario]+'\n初期規模：'+severityNames[sim.initialSeverity]+' ／ 最終対応：'+severityNames[sim.responseLevel]+'\n実施判断：'+sim.completedPhaseIds.length+' ／ 判断得点：'+m.scores.decisionScore.toFixed(1)+' / 100');section.append(info);
 function row(name,text,type){const wrap=el('div','pdf-message '+(type||''));wrap.append(el('div','pdf-name',name),el('div','pdf-body',text));section.append(wrap);}
 row('最終5指標',Object.entries(metricNames).map(([key,label])=>label+'：'+m[key].toFixed(1)+' / 100').join('\n'),'result');
 row('全体評価',c.overall,'result');
 for(const [key,label]of [['review','振り返り'],['missingActions','不足していた行動'],['improvements','改善の方向'],['eventReview','EVENTの振り返り']])row(label,c[key].length?c[key].map((x,i)=>(i+1)+'. '+x).join('\n'):'該当なし','result');
 section.append(el('h2','','判断の記録'));
 for(const h of sim.history){row(h.title,h.situation,'phase');row(D.ROLE_META[sim.role].displayName,h.textCore+'\n判断得点：'+h.score+' / 10','player');}
 row('留意事項','訓練用内部設定による参考結果です。時間は採点に使用していません。','');
 lastPrint=section.innerHTML;
}
function printReport(){buildPrintReport();document.body.classList.add('pdf-printing');window.print();}
$('startForm').addEventListener('change',()=>{$('startButton').disabled=!document.querySelector('input[name=role]:checked');});
$('startForm').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget);try{begin({role:form.get('role'),scenario:form.get('scenario'),severity:form.get('severity')});}catch(error){showError(error);}});
$('restartButton').addEventListener('click',reset);
$('newSessionButton').addEventListener('click',reset);
window.addEventListener('afterprint',()=>document.body.classList.remove('pdf-printing'));
window.BcpApp={start:begin,choose,render,reset,getState:()=>sim?E.clone(sim):null,buildPrintReport,printReport,reportHTML:()=>lastPrint,stopTimer};
window.runBcpPortStaticQA=E.staticQA;
})();
