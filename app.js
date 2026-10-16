(function(){
'use strict';
const E=window.BcpPort,D=E.master,$=id=>document.getElementById(id),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const scenarioNames={EQTS:'地震・津波',TCSS:'台風・高潮',TCHW:'高波・暴風'},severityNames={LIGHT:'軽度',MODERATE:'中程度',SEVERE:'重度',EXTREME:'甚大'};
const metricNames={portRecovery:'港湾機能回復率',supportTransport:'支援輸送機能',cargoHandling:'荷役機能',hinterlandLogistics:'背後物流機能',residualRisk:'残留リスク'};

// Presentation vocabulary only. Canonical IDs, state, scores and comment generation remain unchanged.
const eventPresentation={"EQ_AFTERSHOCK":["余震による再確認","余震により、施設の状態を再確認する必要が生じています。"],"EQ_TSUNAMI_REENTRY":["津波の再来による現地立入り制限","津波の再来により、現地へ立ち入れる範囲が制約されています。"],"EQ_FLOATING_DEBRIS":["漂流物による航路の制約","漂流物により、航路・泊地の利用可能能力が低下しています。"],"EQ_SECONDARY_SETTLEMENT":["追加の地盤沈下","追加の地盤沈下により、ヤードの利用可能能力が低下しています。"],"TC_REINUNDATION":["再浸水","再浸水により、ヤードと背後交通への接続に制約が生じています。"],"TC_POWER_LONG":["停電の長期化","停電が続き、利用可能な電力に制約が生じています。"],"TC_CARGO_DRIFT":["貨物の流出・漂流","貨物の流出・漂流により、航路とヤードの利用可能能力が低下しています。"],"TC_ROAD_CLOSURE":["背後道路の通行止め","背後道路の通行止めにより、港と背後交通の接続に制約が生じています。"],"HW_WIND_REINTENSIFY":["風の再強化","風の再強化により、屋外作業とヤード運用に制約が生じています。"],"HW_OVERTOPPING":["越波による船舶運用の制約","越波により、航路と岸壁を利用した船舶運用に制約が生じています。"],"HW_EQUIPMENT_DAMAGE":["荷役設備の損傷","荷役設備の損傷により、荷役能力が低下しています。"],"HW_VESSEL_DELAY":["船舶の到着遅延・需要集中","船舶の到着遅延により、岸壁利用と荷役の需要が集中しています。"]},displayLabels={"berth":"岸壁","channel":"航路・泊地","yard":"ヤード","handling":"荷役","power":"電力","landAccess":"背後交通への接続","workforce":"作業員体制","fieldAccess":"現地への立入り","survey":"調査体制","coordination":"調整体制","recovery":"復旧支援体制","berthDemand":"岸壁利用の集中度","handlingDemand":"荷役需要の集中度","RECHECK_FACILITIES":"施設の再確認要求","FIELD_ACCESS_RESTRICTED":"現地立入り制限","CHANNEL_RISK_UP":"航路利用の制約","YARD_CAPACITY_DOWN":"ヤード能力低下","LAND_ACCESS_DOWN":"背後交通への接続能力低下","POWER_CAPACITY_DOWN":"電力供給能力低下","OUTDOOR_OPERATION_RESTRICTED":"屋外作業制限","VESSEL_OPERATION_RESTRICTED":"船舶運用制限","HANDLING_CAPACITY_DOWN":"荷役能力低下","BERTH_DEMAND_UP":"岸壁利用の需要集中","HANDLING_DEMAND_UP":"荷役需要の集中","NORMAL":"通常","LIMITED":"利用に制約あり","SEVERE":"大きな制約","CRITICAL":"著しい制約","LOW":"低い","MODERATE":"中程度","HIGH":"高い","VERY_HIGH":"非常に高い","PENDING":"前提となる判断が未実施","WARNING":"前提となる対応に不足あり","altPortCoordinationRequested":"代替港の調整要請済み","technicalSupportRequested":"技術支援要請済み","landTransportCoordinationRequested":"陸上輸送の調整要請済み","emergencyCargoPriorityShared":"緊急貨物の優先方針共有済み"};
for(const p of E.phases){displayLabels[p.id]=p.title;displayLabels[p.successFlag]=p.title+'（対応確認済み）';}
for(const [id,p]of Object.entries(eventPresentation))displayLabels[id]=p[0];
function displayText(text){return String(text).replace(/\b((?:PM|ML|TO)X?\d{2}) CRITICAL\b/g,'$1 前提となる判断に重大な不足あり').replace(/\b[A-Za-z][A-Za-z0-9_]*\b/g,key=>displayLabels[key]||key).replaceAll('EVENT','追加事象').replaceAll('需要pressure：','需要の集中度：').replaceAll('確定共有情報：','対応・共有の確認状況：').replaceAll('発生済みEVENT：','発生済みの追加事象：');}
function displayComments(){const c=E.comments(sim),view=Object.fromEntries(Object.entries(c).map(([key,value])=>[key,Array.isArray(value)?value.map(displayText):displayText(value)]));if(view.eventReview.length)view.eventReview[0]+=' 影響段階は1～4の訓練用尺度です。増幅0は事前判断による影響の上乗せがないことを示します。';return view;}

let sim=null,startedAt=0,timer=null,locked=false,lastPrint='';
// Presentation-only state; never stored in or consulted by the simulation engine.
let introTimer=null,introActive=false,introPlays=0,eventAnimations=0,shownNotifications=new Set();
function finishIntro(){
 if(introTimer!==null)clearTimeout(introTimer);introTimer=null;
 if(!introActive)return;introActive=false;$('scenarioIntro').hidden=true;
 $('chat').style.visibility='';$('controlWrap').style.visibility='';$('controlWrap').inert=false;
 if(sim&&!sim.finished){startedAt=Date.now();timer=setInterval(updateTimer,1000);updateTimer();}
}
function clearPresentation(){if(introTimer!==null)clearTimeout(introTimer);introTimer=null;introActive=false;introPlays=0;eventAnimations=0;shownNotifications=new Set();$('scenarioIntro').hidden=true;$('chat').style.visibility='';$('controlWrap').style.visibility='';$('controlWrap').inert=false;}
function playIntro(){
 introActive=true;introPlays++;const overlay=$('scenarioIntro');overlay.dataset.scenario=sim.scenario;$('introTitle').textContent=scenarioNames[sim.scenario];overlay.hidden=false;
 $('chat').style.visibility='hidden';$('controlWrap').style.visibility='hidden';$('controlWrap').inert=true;
 // A wall-clock fallback, independent of CSS animation support or animationend.
 introTimer=setTimeout(finishIntro,matchMedia('(prefers-reduced-motion: reduce)').matches?350:2400);
}
function eventMessage(parent,event){
 const info=eventPresentation[event.eventId];const row=message(parent,'状況更新 · 追加事象',info[0]+'\n'+info[1]+'\n影響段階 '+event.finalImpact+' / 4（基本 '+event.baseImpact+'、事前判断による増幅 '+event.amplification+'）\n影響は訓練用の4段階です。発生自体は回答の正誤とは独立しています。','event');
 const key=event.eventId+':'+event.occurrenceIndex;row.dataset.eventId=event.eventId;
 if(!shownNotifications.has(key)){shownNotifications.add(key);eventAnimations++;row.querySelector('.msg').classList.add('event-notification');}
}

const timeText=seconds=>{const left=600-seconds,abs=Math.abs(left);return (left<0?'＋':'')+String(Math.floor(abs/60)).padStart(2,'0')+':'+String(abs%60).padStart(2,'0');};
function stopTimer(){if(timer!==null)clearInterval(timer);timer=null;}
function updateTimer(){const elapsed=sim?Math.floor((Date.now()-startedAt)/1000):0;$('timerLabel').textContent=timeText(elapsed);$('timerLabel').classList.toggle('overtime',elapsed>600);}
function message(parent,name,text,type='system',right=false){const row=el('div','msg-row '+(right?'right':'left'));const box=el('div','msg '+type);box.append(el('div','name',name),el('div','body',text));row.append(box);parent.append(row);return row;}
function resultNodes(parent){
 const m=E.metrics(sim),c=displayComments();
 message(parent,'判断品質','判断得点 '+m.scores.decisionScore.toFixed(1)+' / 100\n実施 '+m.scores.completedPhaseCount+'判断 ／ 初期 '+severityNames[sim.initialSeverity]+' ／ 最終対応 '+severityNames[sim.responseLevel],'score');
 const grid=el('div','metric-grid');
 for(const [key,label]of Object.entries(metricNames)){const card=el('div','metric-card');card.append(el('div','metric-name',label),el('strong','metric-value',m[key].toFixed(1)),el('span','metric-unit',' / 100'));grid.append(card);}
 parent.append(grid);message(parent,'指標の読み方','機能の4指標は高いほど良く、残留リスクは低いほど良い値です。いずれも0～100の訓練用参考指標です。','system');
 message(parent,'全体評価',c.overall,'result');
 for(const [key,label]of [['review','振り返り'],['missingActions','不足していた行動'],['improvements','改善の方向'],['eventReview','追加事象の振り返り']])message(parent,label,c[key].length?c[key].map((x,i)=>(i+1)+'. '+x).join('\n'):'該当する項目はありません。','result');
 const exportRow=el('div','pdf-export-row');const button=el('button','pdf-export-button','結果をPDF・印刷');button.type='button';button.id='pdfButton';button.addEventListener('click',printReport);exportRow.append(button);parent.append(exportRow);
 message(parent,'訓練上の留意事項','本結果は訓練用の内部設定による参考値です。実災害では現地状況と最新情報に基づいて判断してください。時間は採点に使用していません。','system');
}
function render(){
 if(!sim)return;
 const chat=$('chat');chat.replaceChildren();$('startScreen').hidden=true;chat.style.display='block';$('controlWrap').style.display='block';
 $('scenarioLabel').textContent=D.ROLE_META[sim.role].displayName+' ／ '+scenarioNames[sim.scenario]+' ／ 初期 '+severityNames[sim.initialSeverity]+' ／ 対応 '+severityNames[sim.responseLevel];
 $('turnLabel').textContent='判断 '+sim.completedPhaseIds.length+' / '+sim.targetPhaseCount;
 $('progressBar').style.width=(100*sim.completedPhaseIds.length/sim.targetPhaseCount)+'%';
 for(const h of sim.history){message(chat,h.title,h.situation,'phase');message(chat,D.ROLE_META[sim.role].displayName,h.textCore,'player',true);for(const e of sim.additionalEvents.filter(e=>e.occurredAfterPhaseId===h.phaseId))eventMessage(chat,e);}
 const choices=$('choiceList');choices.replaceChildren();
 if(sim.finished){stopTimer();resultNodes(chat);$('promptText').textContent='シミュレーション終了';$('restartButton').hidden=false;buildPrintReport();}
 else {const p=E.byId[sim.currentPhaseId];message(chat,p.title,p.situationVariants[sim.scenario],'phase');$('promptText').textContent='あなたの役割として、次の対応を選択してください。';for(const choice of E.displayedChoices(p.id,sim.scenario)){const btn=el('button','choice-button');btn.type='button';btn.dataset.choiceId=choice.id;btn.append(el('span','choice-label',choice.position),el('span','choice-core',choice.textCore),el('small','choice-context',choice.context));btn.addEventListener('click',()=>choose(p.id,choice.id));choices.append(btn);} $('restartButton').hidden=true;}
 const stamp=el('div','chat-end');chat.append(stamp);requestAnimationFrame(()=>stamp.scrollIntoView({block:'end',behavior:'instant'}));
}
function choose(phaseId,choiceId){
 if(locked)return;if(introActive)finishIntro();locked=true;$('errorBox').hidden=true;
 try{sim=E.answer(sim,phaseId,choiceId);render();}
 catch(error){showError(error);}
 finally{locked=false;}
}
function showError(error){$('errorBox').textContent='処理を完了できませんでした：'+error.message;$('errorBox').hidden=false;console.error(error);}
function begin(config,options={}){
 stopTimer();clearPresentation();locked=false;$('errorBox').hidden=true;sim=E.start(config.role,config.scenario,config.severity,options);startedAt=0;$('timerLabel').textContent='10:00';$('printReport').replaceChildren();lastPrint='';document.body.classList.remove('pdf-printing');render();playIntro();return E.clone(sim);
}
function reset(){
 stopTimer();clearPresentation();sim=null;startedAt=0;locked=false;lastPrint='';$('chat').replaceChildren();$('chat').style.display='none';$('controlWrap').style.display='none';$('startScreen').hidden=false;$('printReport').replaceChildren();$('errorBox').hidden=true;$('scenarioLabel').textContent='役割・災害条件を選択';$('turnLabel').textContent='判断 -- / --';$('progressBar').style.width='0%';$('timerLabel').textContent='10:00';document.body.classList.remove('pdf-printing');
}
function buildPrintReport(){
 if(!sim?.finished)return;
 const section=$('printReport');section.replaceChildren();section.setAttribute('aria-hidden','false');section.append(el('h1','','港湾BCPシミュレーション Ver.1.0'));
 const m=E.metrics(sim),c=displayComments();const info=el('p','pdf-summary',D.ROLE_META[sim.role].displayName+' ／ '+scenarioNames[sim.scenario]+'\n初期規模：'+severityNames[sim.initialSeverity]+' ／ 最終対応：'+severityNames[sim.responseLevel]+'\n実施判断：'+sim.completedPhaseIds.length+' ／ 判断得点：'+m.scores.decisionScore.toFixed(1)+' / 100');section.append(info);
 function row(name,text,type){const wrap=el('div','pdf-message '+(type||''));wrap.append(el('div','pdf-name',name),el('div','pdf-body',text));section.append(wrap);}
 row('最終5指標',Object.entries(metricNames).map(([key,label])=>label+'：'+m[key].toFixed(1)+' / 100').join('\n'),'result');
 row('指標の読み方','機能の4指標は高いほど良く、残留リスクは低いほど良い値です。0～100の訓練用参考指標です。','result');
 row('全体評価',c.overall,'result');
 for(const [key,label]of [['review','振り返り'],['missingActions','不足していた行動'],['improvements','改善の方向'],['eventReview','追加事象の振り返り']])row(label,c[key].length?c[key].map((x,i)=>(i+1)+'. '+x).join('\n'):'該当なし','result');
 section.append(el('h2','','判断の記録'));
 for(const h of sim.history){row(h.title,h.situation,'phase');row(D.ROLE_META[sim.role].displayName,h.textCore+'\n判断得点：'+h.score+' / 10','player');}
 row('留意事項','訓練用内部設定による参考結果です。時間は採点に使用していません。','');
 lastPrint=section.innerHTML;
}
function printReport(){buildPrintReport();document.body.classList.add('pdf-printing');window.print();}
$('startForm').addEventListener('change',()=>{$('startButton').disabled=!document.querySelector('input[name=role]:checked');});
$('startForm').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget);try{begin({role:form.get('role'),scenario:form.get('scenario'),severity:form.get('severity')});}catch(error){showError(error);}});
$('introContinue').addEventListener('click',finishIntro);
$('restartButton').addEventListener('click',reset);
$('newSessionButton').addEventListener('click',reset);
window.addEventListener('afterprint',()=>document.body.classList.remove('pdf-printing'));
window.BcpApp={start:begin,choose,render,reset,getState:()=>sim?E.clone(sim):null,buildPrintReport,printReport,reportHTML:()=>lastPrint,stopTimer,getPresentationState:()=>({introActive,introPlays,eventAnimations,shownNotifications:[...shownNotifications],timerRunning:timer!==null})};
window.runBcpPortStaticQA=E.staticQA;
})();
