/* bcp-port engine. All scenario content and configuration come from the immutable master. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./bcp_port_master_data_v1_0.js'));else root.BcpPort=factory(BCP_PORT_MASTER_DATA);})(typeof globalThis!=='undefined'?globalThis:this,function(D){
'use strict';
const clone=v=>JSON.parse(JSON.stringify(v)),clamp=(v,a=0,b=100)=>Math.min(b,Math.max(a,v));
const phases=Object.values(D.ROLE_PHASES).flat(),byId=Object.fromEntries(phases.map(p=>[p.id,p]));
const physical=D.CAPACITY.physicalEffective, allCap=physical.concat(D.CAPACITY.support);
const rank=D.RESPONSE_LEVEL.rank, levels=Object.keys(rank).sort((a,b)=>rank[a]-rank[b]);
const finalId=s=>D.ROLE_PHASES[s.role].at(-1).id;
const completed=s=>new Set(s.completedPhaseIds);
const active=s=>s.activeEffects.filter(e=>e.active);
const eventDef=id=>D.EVENTS.find(e=>e.id===id);
function band(value,bands){return bands.find(b=>value>=b.minInclusive);}
function response(s){
 const impact=Math.max(0,...s.additionalEvents.map(e=>e.finalImpact)), vals=physical.map(k=>s.capacities[k]);
 const match=rule=>rule.conditions.some(c=>c.finalImpactGte!==undefined?impact>=c.finalImpactGte:c.anyPhysicalCapacityLt!==undefined?vals.some(v=>v<c.anyPhysicalCapacityLt):vals.filter(v=>v<c.physicalCapacityCountLt.threshold).length>=c.physicalCapacityCountLt.count);
 if(s.responseLevel==='LIGHT'&&match(D.RESPONSE_LEVEL.fromLight))s.responseLevel='MODERATE';
 if(s.responseLevel==='MODERATE'&&match(D.RESPONSE_LEVEL.fromModerate))s.responseLevel='SEVERE';
 s.targetPhaseCount=D.RESPONSE_LEVEL.targetPhaseCount[s.responseLevel];
}
function promote(s,minimum){while(s.targetPhaseCount<minimum){const i=levels.indexOf(s.responseLevel);if(i===levels.length-1)throw Error('PHASE_FRAME_OVERFLOW');s.responseLevel=levels[i+1];s.targetPhaseCount=D.RESPONSE_LEVEL.targetPhaseCount[s.responseLevel];}}
function field(s,key){return key.split('.').reduce((v,k)=>v?.[k],s);}
function predicate(s,node){
 if(node?.field)return field(s,node.field);
 if(node===null||typeof node!=='object')return node;
 const impact=e=>e.finalImpact>=(node.minimumFinalImpact||1);
 switch(node.op){
 case 'TRUE':return true;case 'FALSE':return false;
 case 'AND':return node.args.every(a=>predicate(s,a));case 'OR':return node.args.some(a=>predicate(s,a));
 case 'LT':return predicate(s,node.args[0])<predicate(s,node.args[1]);case 'GTE':return predicate(s,node.args[0])>=predicate(s,node.args[1]);
 case 'PHASE_COMPLETED':return !!s.phaseResults[node.phaseId]?.completed;
 case 'PHASE_PLANNED_OR_COMPLETED':return s.plannedPhaseIds.includes(node.phaseId)||!!s.phaseResults[node.phaseId]?.completed;
 case 'BEFORE_FINAL_PHASE':return s.currentPhaseId!==finalId(s)&&!s.phaseResults[finalId(s)]?.completed;
 case 'FLAG_TRUE':return s.coordinationFlags[node.key]===true;
 case 'CAPACITY_COUNT_BELOW':return node.keys.filter(k=>s.capacities[k]<node.threshold).length>=node.minimumCount;
 case 'CAPACITY_DROP_SINCE_PHASE':{const old=s.phaseResults[node.phaseId]?.capacitySnapshotAfterMutation;return !!old&&node.keys.some(k=>old[k]-s.capacities[k]>=node.minimumDrop);}
 case 'EVENT_EXISTS':return s.additionalEvents.some(e=>(!node.ids||node.ids.includes(e.eventId))&&impact(e));
 case 'RELATED_EVENT_EXISTS':return s.additionalEvents.some(e=>D.RELEVANCE.definitions[node.phaseId].relatedEventIds.includes(e.eventId)&&impact(e));
 case 'ACTIVE_EFFECT_EXISTS':return active(s).some(e=>node.types.includes(e.type)&&impact(e));
 case 'UNRESOLVED_EFFECT_EXISTS':return active(s).some(impact);
 case 'ACTIVE_EFFECT_COUNT_AT_LEAST':return new Set(active(s).filter(impact).map(e=>e.type)).size>=node.minimumCount;
 default:throw Error('UNKNOWN_PREDICATE '+node.op);
 }
}
function relevance(s,id){
 const c=D.RELEVANCE.definitions[id];if(!c)throw Error('CORE_HAS_NO_RELEVANCE '+id);
 const min=c.relatedCapacityKeys.length?Math.min(...c.relatedCapacityKeys.map(k=>s.capacities[k])):100;
 const pressure=c.relatedPressureKeys.length?Math.max(...c.relatedPressureKeys.map(k=>s.pressures[k])):0;
 const hasEvent=s.additionalEvents.some(e=>c.relatedEventIds.includes(e.eventId));
 const effCount=new Set(active(s).filter(e=>c.relatedEffectTypes.includes(e.type)).map(e=>e.type)).size;
 const prior=c.relatedPriorPhaseIds.filter(p=>s.phaseResults[p]?.completed).map(p=>s.phaseResults[p].score);
 const priorMin=prior.length?Math.min(...prior):10;
 const flag=c.relatedCoordinationFlags.some(f=>s.coordinationFlags[f]===true);
 const hard=!!predicate(s,c.hardTrigger);
 const capBonus=D.RELEVANCE.capacityBonus.find(b=>b.maxExclusive!==undefined?min<b.maxExclusive:min>=b.minInclusive).value;
 const pressBonus=D.RELEVANCE.pressureBonus.find(b=>pressure>=b.minInclusive).value;
 const hazard=Math.min(D.RELEVANCE.hazardBonus.maximum,(hasEvent?D.RELEVANCE.hazardBonus.relatedEvent:0)+(effCount>=2?D.RELEVANCE.hazardBonus.relatedActiveEffects.atLeast2:D.RELEVANCE.hazardBonus.relatedActiveEffects[effCount]));
 const evidence=min<80||hasEvent||effCount>0||pressure>=40||priorMin<=3||flag;
 const selected=s.plannedPhaseIds.concat(s.completedPhaseIds).filter(x=>x!==id);
 const redundant=selected.some(p=>D.COMMENTS.themeFamilyByPhase[p]===c.themeFamily);
 const parts={basePriority:c.basePriority,scenarioAffinity:c.scenarioAffinity[s.scenario],severityBonus:D.RELEVANCE.severityBonus[s.initialSeverity],capacityBonus:capBonus,hazardBonus:hazard,pressureBonus:pressBonus,priorDecisionBonus:D.RELEVANCE.priorDecisionBonus[priorMin],coordinationBonus:flag?D.RELEVANCE.coordinationBonus:0,retentionBonus:s.plannedPhaseIds.includes(id)&&!s.phaseResults[id]?.completed?D.RELEVANCE.retentionBonus:0,noEvidencePenalty:byId[id].phaseClass==='EXPANSION'&&!evidence?D.RELEVANCE.noEvidencePenalty:0,redundancyPenalty:redundant&&!hard&&!hasEvent&&pressure<60?D.RELEVANCE.redundancyPenalty:0};
 const total=Object.entries(parts).reduce((n,[k,v])=>n+(k.endsWith('Penalty')?-v:v),0);
 return {id,score:clamp(total,...D.RELEVANCE.range),hard,basePriority:c.basePriority,canonicalOrder:byId[id].canonicalOrder,parts};
}
function closure(ids,s){
 const result=new Set(ids);let changed=true;
 while(changed){changed=false;for(const id of [...result])for(const dep of byId[id].dependencies){
  if(dep.type==='CONDITIONAL'&&!predicate(s,dep.condition))continue;
  let sources=dep.sources;
  if(dep.type==='ONE_OF'){const included=sources.filter(p=>result.has(p));sources=[included[0]||sources.slice().sort((a,b)=>byId[a].canonicalOrder-byId[b].canonicalOrder||a.localeCompare(b))[0]];}
  for(const source of sources)if(!result.has(source)){if(byId[source].roleOwner!==s.role)throw Error('CROSS_ROLE_DEPENDENCY');result.add(source);changed=true;}
 }}
 return result;
}
function plan(s){
 const ps=D.ROLE_PHASES[s.role],core=ps.filter(p=>p.phaseClass==='CORE').map(p=>p.id);
 const locked=new Set(s.completedPhaseIds.concat(s.currentPhaseId?[s.currentPhaseId]:[]));
 let mandatory=closure(new Set([...core,...locked]),s),previous='';
 for(let step=0;step<40;step++){
  const candidates=ps.filter(p=>p.phaseClass!=='CORE').map(p=>relevance(s,p.id));
  for(const c of candidates)if(c.hard)mandatory.add(c.id);
  mandatory=closure(mandatory,s);promote(s,mandatory.size);
  let selected=new Set(mandatory);
  const sorted=candidates.sort((a,b)=>b.score-a.score||Number(b.hard)-Number(a.hard)||b.basePriority-a.basePriority||a.canonicalOrder-b.canonicalOrder||(a.id<b.id?-1:1));
  for(const c of sorted){if(selected.size>=s.targetPhaseCount)break;if(selected.has(c.id))continue;const trial=closure(new Set([...selected,c.id]),s);if(trial.size<=s.targetPhaseCount)selected=trial;}
  if(selected.size!==s.targetPhaseCount)throw Error('CANNOT_FILL_PHASE_FRAME');
  const order=[...selected].sort((a,b)=>byId[a].canonicalOrder-byId[b].canonicalOrder||(a<b?-1:1));
  const key=order.join('|');s.plannedPhaseIds=order;s.relevanceScores=Object.fromEntries(candidates.map(c=>[c.id,c]));
  if(key===previous)return order;
  previous=key;
 }
 throw Error('PLAN_DID_NOT_CONVERGE');
}
function resolve(s,phaseId=null,score=null){
 for(const e of active(s)){
  let rule=null;
  if(e.type==='RECHECK_FACILITIES'&&phaseId==='PMX01'&&[10,7].includes(score))rule='PMX01';
  for(const r of D.ACTIVE_EFFECT_POLICY.resolutionRules)if(r.type===e.type&&r.when.pressure&&s.pressures[r.when.pressure]<=r.when.lte)rule=r.resolvedBy;
  if(rule){e.active=false;e.resolvedBy=rule;e.resolvedAtPhaseId=phaseId||s.lastCompletedPhaseId||null;}
 }
}
function mutate(s,p,c){
 const result=s.phaseResults[p.id];if(result.stateMutationApplied)return;
 for(const o of p.actionMutation.operations)for(const key of o.targets){const map=o.mutationClass==='PRESSURE_MITIGATION'?s.pressures:s.capacities;map[key]=clamp(map[key]+D.PHASE_ACTION_MUTATION.amountByScore[o.mutationClass][c.score]*o.multiplier);}
 s.coordinationFlags[p.successFlag]=c.score>=7;
 if(c.score>=7)for(const flag of p.actionMutation.flagsOnSuccess)s.coordinationFlags[flag]=true;
 result.capacitySnapshotAfterMutation=clone(s.capacities);result.pressureSnapshotAfterMutation=clone(s.pressures);result.coordinationSnapshotAfterMutation=clone(s.coordinationFlags);result.stateMutationApplied=true;
 resolve(s,p.id,c.score);
}
function schedule(s,rng){
 const draw=()=>{const v=rng();if(!Number.isFinite(v)||v<0||v>=1)throw Error('INVALID_RNG');return v;};
 const rows=D.EVENTS.filter(e=>e.scenario===s.scenario).map(e=>{const willOccur=draw()<e.probability[s.initialSeverity];return {eventId:e.id,willOccur,triggerProgress:willOccur?e.minProgress+draw()*(e.maxProgress-e.minProgress):null,selectedForRun:false,triggered:false,triggeredAtProgress:null,finalImpact:null};});
 rows.filter(e=>e.willOccur).sort((a,b)=>a.triggerProgress-b.triggerProgress||(a.eventId<b.eventId?-1:1)).slice(0,D.EVENT_DRAW.maxEvents).forEach(e=>e.selectedForRun=true);
 s.eventSchedule=rows;s.eventScheduleInitialized=true;
}
function fire(s,rec){
 if(rec.triggered)return;
 const def=eventDef(rec.eventId),sourceSnapshot=clone(s.phaseResults),details=def.amplificationSources[s.role].map(id=>({phaseId:id,completed:!!sourceSnapshot[id]?.completed,score:sourceSnapshot[id]?.completed?sourceSnapshot[id].score:null,contribution:sourceSnapshot[id]?.completed?D.EVENT_AMPLIFICATION.scoreContribution[sourceSnapshot[id].score]:0}));
 const amplification=Math.min(2,details.reduce((n,x)=>n+x.contribution,0)),baseImpact=D.EVENT_AMPLIFICATION.baseImpact[s.initialSeverity],finalImpact=clamp(baseImpact+amplification,1,4);
 rec.triggered=true;rec.triggeredAtProgress=s.eventProgress;rec.finalImpact=finalImpact;
 const log={eventId:def.id,baseImpact,amplification,finalImpact,sourceDecisions:details,occurredAfterPhaseId:s.lastCompletedPhaseId,occurrenceIndex:s.additionalEvents.length,progress:s.eventProgress};
 s.additionalEvents.push(log);
 for(const type of def.effects){const m=D.EFFECT_CAPACITY_MAPPING[type];s.activeEffects.push({type,sourceEventId:def.id,finalImpact,active:true,resolvedBy:null,resolvedAtPhaseId:null});
  for(const [key,values]of Object.entries(m.capacityDeltas))s.capacities[key]=clamp(s.capacities[key]+values[finalImpact-1]);
  for(const [key,values]of Object.entries(m.pressureDeltas))s.pressures[key]=clamp(s.pressures[key]+values[finalImpact-1]);
 }
 resolve(s);response(s);plan(s);
}
function dependencyWarnings(s,id){
 const result=[];for(const dep of byId[id].dependencies){let sources=dep.sources;if(dep.type==='CONDITIONAL'&&!predicate(s,dep.condition))continue;if(dep.type==='ONE_OF'){const scored=sources.filter(x=>s.phaseResults[x]?.completed);sources=scored.length?[scored.sort((a,b)=>s.phaseResults[b].score-s.phaseResults[a].score)[0]]:sources.filter(x=>s.plannedPhaseIds.includes(x)).slice(0,1);}
 for(const source of sources){const r=s.phaseResults[source];if(!r?.completed)result.push({phaseId:source,status:'PENDING'});else if(r.score<=3)result.push({phaseId:source,status:r.score===0?'CRITICAL':'WARNING'});}
 }return result;
}
function start(role,scenario,severity,options={}){
 if(!D.ROLE_META[role]||!D.SCENARIOS.includes(scenario)||!D.CAPACITY.initialByScenarioSeverity[scenario]?.[severity])throw Error('INVALID_START');
 const responseLevel=D.RESPONSE_LEVEL.initialBySeverity[severity];
 const s={role,scenario,initialSeverity:severity,responseLevel,targetPhaseCount:D.RESPONSE_LEVEL.targetPhaseCount[responseLevel],capacities:clone(D.CAPACITY.initialByScenarioSeverity[scenario][severity].capacity),pressures:clone(D.CAPACITY.initialPressure),coordinationFlags:clone(D.STATE_SCHEMA.initialization.coordinationFlags),completedPhaseIds:[],phaseResults:{},history:[],additionalEvents:[],activeEffects:[],eventProgress:0,eventSchedule:[],eventScheduleInitialized:false,plannedPhaseIds:[],currentPhaseId:null,lastCompletedPhaseId:null,finished:false,mutationCount:0};
 if(options.forcedEvents){s.fixtureMode=true;s.eventSchedule=options.forcedEvents.map(e=>({eventId:e.eventId,afterPhaseId:e.afterPhaseId,willOccur:true,selectedForRun:true,triggerProgress:null,triggered:false,triggeredAtProgress:null,finalImpact:null}));s.eventScheduleInitialized=true;}else schedule(s,options.rng||Math.random);
 plan(s);s.currentPhaseId=s.plannedPhaseIds.find(id=>!s.phaseResults[id]?.completed);return s;
}
function answer(input,phaseId,choiceId){
 if(input.phaseResults[phaseId]?.completed)return input;
 if(input.finished||input.currentPhaseId!==phaseId)throw Error('STALE_PHASE');
 const s=clone(input),p=byId[phaseId],c=p.choices.find(x=>x.id===choiceId);if(!c)throw Error('UNKNOWN_CHOICE');
 const warnings=dependencyWarnings(s,phaseId),before=clone(s.capacities);
 s.phaseResults[phaseId]={phaseId,choiceId,score:c.score,actionTag:c.actionTag,completed:true,stateMutationApplied:false,dependencyWarnings:warnings,completedOrder:s.completedPhaseIds.length};
 s.completedPhaseIds.push(phaseId);s.lastCompletedPhaseId=phaseId;
 mutate(s,p,c);s.mutationCount++;s.phaseResults[phaseId].capacityImprovements=Object.fromEntries(allCap.map(k=>[k,Math.max(0,s.capacities[k]-before[k])]).filter(x=>x[1]>0));
 s.history.push({phaseId,title:p.title,choiceId,textCore:c.textCore,score:c.score,situation:p.situationVariants[s.scenario],runtimeDetail:runtimeDetail(input,phaseId),displayPosition:p.choiceDisplayOrder.indexOf(choiceId)});
 response(s);const previous=s.eventProgress;s.eventProgress=clamp(Math.max(previous,s.completedPhaseIds.length/s.targetPhaseCount),0,1);
 const due=s.eventSchedule.filter(e=>e.selectedForRun&&!e.triggered&&(s.fixtureMode?e.afterPhaseId===phaseId:previous<e.triggerProgress&&s.eventProgress>=e.triggerProgress)).sort((a,b)=>(a.triggerProgress??0)-(b.triggerProgress??0)||(a.eventId<b.eventId?-1:1));
 for(const rec of due)fire(s,rec);
 s.currentPhaseId=null;plan(s);
 if(s.phaseResults[finalId(s)]?.completed&&s.plannedPhaseIds.some(id=>!s.phaseResults[id]?.completed))throw Error('FINAL_PHASE_ESCALATION_CONFLICT');
 s.currentPhaseId=s.plannedPhaseIds.find(id=>!s.phaseResults[id]?.completed)||null;s.finished=!s.currentPhaseId;
 return s;
}
function displayedChoices(phaseId,scenario){const p=byId[phaseId],ctx=D.CHOICE_RENDERING.scenarioContexts[scenario];return p.choiceDisplayOrder.map((id,i)=>{const c=p.choices.find(c=>c.id===id);const context=[ctx.hazardContext,ctx.affectedObjectTerms.replaceAll('{decisionObject}',c.decisionObject),ctx.constraintContext].join(' ');return {...clone(c),position:'ABCD'[i],context,text:c.textCore+'\n【状況補足】'+context};});}
function runtimeDetail(s,id){
 const lines=[];
 for(const e of s.additionalEvents)lines.push('発生済みEVENT：'+e.eventId+'（影響 '+e.finalImpact+'）');
 const effects=active(s);if(effects.length)lines.push('継続中：'+[...new Set(effects.map(e=>e.type))].join('、'));
 lines.push('有効機能能力：'+allCap.map(k=>k+' '+Math.round(s.capacities[k])+'（'+band(s.capacities[k],D.CAPACITY.statusBands).status+'）').join(' / '));
 lines.push('需要pressure：berthDemand '+s.pressures.berthDemand+' / handlingDemand '+s.pressures.handlingDemand);
 const warnings=dependencyWarnings(s,id);if(warnings.length)lines.push('前提情報：'+warnings.map(w=>w.phaseId+' '+w.status).join('、'));
 const flags=Object.keys(s.coordinationFlags).filter(k=>s.coordinationFlags[k]);if(flags.length)lines.push('確定共有情報：'+flags.join('、'));
 return lines.join('\n');
}
function scoring(results){
 const rows=Array.isArray(results)?results:Object.values(results),completedRows=rows.filter(r=>r.completed!==false),n=completedRows.length;
 if(!n)return {completedPhaseCount:0,rawScore:0,maxRawScore:0,decisionScore:null,normalizedChoiceRisk:null,criticalFailureRate:0,decisionRisk:null};
 const rawScore=completedRows.reduce((v,r)=>v+r.score,0),normalizedChoiceRisk=100*completedRows.reduce((v,r)=>v+D.RESULT_ENGINE.choiceRisk[r.score],0)/(25*n),eligible=completedRows.filter(r=>r.criticalZero??byId[r.phaseId]?.criticalZero),criticalFailureRate=eligible.length?100*eligible.filter(r=>r.score===0).length/eligible.length:0;
 return {completedPhaseCount:n,rawScore,maxRawScore:n*10,decisionScore:100*rawScore/(n*10),normalizedChoiceRisk,criticalFailureRate,decisionRisk:clamp(Math.max(normalizedChoiceRisk,(normalizedChoiceRisk+criticalFailureRate)/2))};
}
function metrics(s){
 const out={},bottlenecks={};
 for(const [id,m]of Object.entries(D.RESULT_ENGINE.metricDefinitions)){
  const total=Object.values(m.weights).reduce((a,b)=>a+b,0),weighted=Object.entries(m.weights).reduce((n,[k,w])=>n+s.capacities[k]*w,0)/total;
  const min=Math.min(...Object.keys(m.weights).map(k=>s.capacities[k]));bottlenecks[id]={value:min,keys:Object.keys(m.weights).filter(k=>s.capacities[k]===min)};
  let penalty=0;
  if(id==='portRecovery')penalty=m.penaltyBands.find(b=>b.maxExclusive!==undefined?min<b.maxExclusive:min>=b.minInclusive).subtract;
  else penalty=clamp(s.pressures[m.demandPressure]/100*m.maxDemandPenalty,0,m.maxDemandPenalty);
  out[id]=clamp(weighted-penalty);
 }
 const maxByType={};
 for(const e of active(s)){const keys=D.RESULT_ENGINE.activeEffectRisk.relatedCapacityKeys[e.type],mean=keys.reduce((n,k)=>n+s.capacities[k],0)/keys.length,persistence=D.RESULT_ENGINE.activeEffectRisk.persistenceBands.find(b=>mean>=b.minInclusive).persistence,contribution=D.RESULT_ENGINE.activeEffectRisk.weights[e.type]*(e.finalImpact/4)*persistence;maxByType[e.type]=Math.max(maxByType[e.type]||0,contribution);}
 const scores=scoring(s.phaseResults),physicalRisk=clamp(100-out.portRecovery),activeEffectRisk=clamp(Object.values(maxByType).reduce((a,b)=>a+b,0)),pressureRisk=clamp(Math.max(...Object.values(s.pressures)));
 out.residualRisk=clamp(.4*physicalRisk+.3*activeEffectRisk+.2*(scores.decisionRisk??0)+.1*pressureRisk);
 return {...out,physicalRisk,activeEffectRisk,pressureRisk,bottlenecks,scores};
}
function comments(s,m=metrics(s)){
 const rows=Object.values(s.phaseResults),lowest=Object.keys(D.RESULT_ENGINE.metricDefinitions).sort((a,b)=>m[a]-m[b])[0],label=D.RESULT_ENGINE.metricDefinitions[lowest].label;
 const status=band(m[lowest],D.RESULT_ENGINE.positiveStatusBands),riskStatus=band(m.residualRisk,D.RESULT_ENGINE.residualRiskStatusBands);
 const template=rows.length===0?D.COMMENTS.overallRules[0].template:rows.every(r=>r.score===10)?D.COMMENTS.overallRules[m[lowest]<80?1:2].template:D.COMMENTS.overallRules[3].template;
 const vars={lowestFunctionLabel:label,lowestFunctionValue:m[lowest].toFixed(1),lowestFunctionStatus:status.label,residualRisk:m.residualRisk.toFixed(1),residualRiskStatus:riskStatus.code,decisionScore:(m.scores.decisionScore??0).toFixed(1)};
 const fill=(str,extra={})=>str.replace(/\{(\w+)\}/g,(_,k)=>({...vars,...extra})[k]??'');
 const candidates=[];
 for(const r of rows){const p=byId[r.phaseId],phaseTitle=p.title;
  if(p.criticalZero&&r.score===10)candidates.push({rank:1,p,text:fill(D.COMMENTS.reviewRule.priority[0].template,{phaseTitle})});
  const mitigation=s.additionalEvents.find(e=>e.sourceDecisions.some(q=>q.phaseId===p.id&&q.completed&&q.score>=7&&q.contribution===0));
  if(mitigation)candidates.push({rank:2,p,text:fill(D.COMMENTS.reviewRule.priority[1].template,{phaseTitle,event:mitigation.eventId})});
  const improved=Object.keys(r.capacityImprovements||{}).find(k=>Object.values(m.bottlenecks).some(b=>b.keys.includes(k)));
  if(improved)candidates.push({rank:3,p,text:fill(D.COMMENTS.reviewRule.priority[2].template,{phaseTitle,capacityKey:improved})});
  if(r.score===10)candidates.push({rank:4,p,text:fill(D.COMMENTS.reviewRule.priority[3].template,{phaseTitle})});
 }
 candidates.sort((a,b)=>a.rank-b.rank||a.p.canonicalOrder-b.p.canonicalOrder);
 const families=new Set(),review=[];
 for(const c of candidates){const family=D.COMMENTS.themeFamilyByPhase[c.p.id];if(families.has(family))continue;families.add(family);review.push(c.text);if(review.length>=D.COMMENTS.limits.review)break;}
 const weak=rows.filter(r=>r.score<=3).map(r=>({r,p:byId[r.phaseId],rank:r.score===0?(byId[r.phaseId].criticalZero?1:2):(rows.some(q=>q.dependencyWarnings?.some(w=>w.phaseId===r.phaseId))?3:4)})).sort((a,b)=>a.rank-b.rank||a.p.canonicalOrder-b.p.canonicalOrder);
 const missingActions=weak.slice(0,D.COMMENTS.limits.missingActions).map(x=>D.COMMENTS.phaseMapping[x.p.id].missingActions);
 const improvements=weak.slice(0,D.COMMENTS.limits.improvements).map(x=>{const map=D.COMMENTS.actionTagMappings[x.r.actionTag];if(!map||map.roleOwner!==s.role)throw Error('COMMENT_ROLE_MISMATCH');return map.improvementText;});
 const eventReview=s.additionalEvents.slice().sort((a,b)=>b.finalImpact-a.finalImpact||a.occurrenceIndex-b.occurrenceIndex).slice(0,D.COMMENTS.limits.eventReview).map(e=>fill(D.COMMENTS.eventReviewRule.template,{event:e.eventId,baseImpact:e.baseImpact,amplification:e.amplification,finalImpact:e.finalImpact,priorSourceDecisions:e.sourceDecisions.map(r=>r.phaseId+':'+(r.completed?r.score+'点':'未実施（増幅0）')).join('、')}));
 return {overall:fill(template),review,missingActions,improvements,eventReview};
}
function staticQA(){
 const errors=[],counts={roles:Object.keys(D.ROLE_META).length,phases:phases.length,basicChoices:phases.reduce((n,p)=>n+p.choices.length,0),effectiveChoices:0,situations:0,events:D.EVENTS.length,actionTags:0,relevanceCandidates:Object.keys(D.RELEVANCE.definitions).length,hardTriggers:Object.keys(D.RELEVANCE.definitions).length,roleContamination:0};
 const ids=new Set(),choiceIds=new Set(),tags=new Set(),balance={A:0,B:0,C:0,D:0};
 for(const p of phases){if(ids.has(p.id))errors.push('DUPLICATE_PHASE '+p.id);ids.add(p.id);if(!D.ROLE_META[p.roleOwner])errors.push('UNKNOWN_ROLE');
  if(p.choices.map(c=>c.score).slice().sort((a,b)=>a-b).join()!=='0,3,7,10')errors.push('SCORE_SET '+p.id);
  balance['ABCD'[p.choiceDisplayOrder.indexOf(p.choices.find(c=>c.score===10).id)]]++;
  for(const c of p.choices){if(choiceIds.has(c.id))errors.push('DUPLICATE_CHOICE');choiceIds.add(c.id);if(!c.textCore.trim()||!c.actionTag.trim())errors.push('BLANK_CHOICE');tags.add(c.actionTag);if(c.roleOwner!==p.roleOwner||c.authorityScope!==p.authorityScope||c.authorityAction!==p.authorityAction)counts.roleContamination++;}
  for(const sc of D.SCENARIOS){if(!p.situationVariants[sc]?.trim())errors.push('BLANK_SITUATION');else counts.situations++;const rendered=displayedChoices(p.id,sc);counts.effectiveChoices+=rendered.length;for(const r of rendered)if(r.roleOwner!==p.roleOwner)counts.roleContamination++;}
 }
 counts.actionTags=tags.size;
 for(const [k,v]of Object.entries({roles:3,phases:51,basicChoices:204,effectiveChoices:612,situations:153,events:12,actionTags:204,relevanceCandidates:27,hardTriggers:27,roleContamination:0}))if(counts[k]!==v)errors.push(k+'='+counts[k]);
 if(JSON.stringify(balance)!==JSON.stringify({A:13,B:13,C:13,D:12}))errors.push('DISPLAY_BALANCE');
 return {counts,balance,errors,ERROR:errors.length,status:errors.length?'FAIL':'PASS'};
}
return {master:D,phases,byId,start,answer,plan,predicate,relevance,closure,response,promote,resolve,fire,metrics,scoring,comments,displayedChoices,runtimeDetail,dependencyWarnings,staticQA,clone};
});
