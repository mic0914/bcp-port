'use strict';
// データ検証専用。アプリ・UI・公開用simulation engineではない。
const assert=require('node:assert/strict');
const canonical=v=>Array.isArray(v)?v.map(canonical):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v);
const equalDeep=(a,b)=>assert.equal(JSON.stringify(canonical(a)),JSON.stringify(canonical(b)));
const fs=require('node:fs');
const path=require('node:path');
function verify(d) {
 const tests=[]; const check=(name,fn)=>{try{fn();tests.push({name,status:'PASS'});}catch(e){tests.push({name,status:'FAIL',error:e.message});}};
 const pp=Object.values(d.ROLE_PHASES).flat(), pm=Object.fromEntries(pp.map(p=>[p.id,p])), cc=pp.flatMap(p=>p.choices);
 const capKeys=d.CAPACITY.physicalEffective.concat(d.CAPACITY.support);
 const clamp=(x,a=0,b=100)=>Math.min(b,Math.max(a,x));
 function state(role='PORT_MANAGER',severity='MODERATE',scenario='EQTS') {
  const responseLevel=d.RESPONSE_LEVEL.initialBySeverity[severity];
  return {role,initialSeverity:severity,scenario,responseLevel,targetPhaseCount:d.RESPONSE_LEVEL.targetPhaseCount[responseLevel],capacities:structuredClone(d.CAPACITY.initialByScenarioSeverity[scenario][severity].capacity),pressures:{berthDemand:0,handlingDemand:0},coordinationFlags:structuredClone(d.STATE_SCHEMA.initialization.coordinationFlags),phaseResults:{},completedPhaseIds:[],activeEffects:[],additionalEvents:[],eventSchedule:[],eventScheduleInitialized:false,eventProgress:0,currentPhaseId:null};
 }
 function resolveEffects(s,phaseId=null,score=null) {
  for(const e of s.activeEffects) {
   if(!e.active)continue;
   let cause=null;
   if(e.type==='RECHECK_FACILITIES'&&phaseId==='PMX01'&&(score===10||score===7))cause='PMX01';
   if(e.type==='BERTH_DEMAND_UP'&&s.pressures.berthDemand<=20)cause='PRESSURE_THRESHOLD_BERTH_DEMAND';
   if(e.type==='HANDLING_DEMAND_UP'&&s.pressures.handlingDemand<=20)cause='PRESSURE_THRESHOLD_HANDLING_DEMAND';
   if(cause){e.active=false;e.resolvedBy=cause;e.resolvedAtPhaseId=phaseId||s.currentPhaseId;}
  }
 }
 function applyPhase(s,id,score) {
  if(s.phaseResults[id]?.stateMutationApplied)return false;
  const p=pm[id]; assert.equal(p.roleOwner,s.role);
  const cfg=d.PHASE_ACTION_MUTATION.definitions[id];
  const result={phaseId:id,score,completed:true,stateMutationApplied:false};
  for(const o of cfg.operations)for(const key of o.targets) {
   const v=d.PHASE_ACTION_MUTATION.amountByScore[o.mutationClass][score]*o.multiplier;
   const map=o.mutationClass==='PRESSURE_MITIGATION'?s.pressures:s.capacities;map[key]=clamp(map[key]+v);
  }
  s.coordinationFlags[p.successFlag]=score>=7;
  if(score>=7)for(const key of cfg.flagsOnSuccess)s.coordinationFlags[key]=true;
  s.currentPhaseId=id;
  s.completedPhaseIds.push(id);
  result.capacitySnapshotAfterMutation=structuredClone(s.capacities);
  result.pressureSnapshotAfterMutation=structuredClone(s.pressures);
  result.coordinationSnapshotAfterMutation=structuredClone(s.coordinationFlags);
  result.stateMutationApplied=true;s.phaseResults[id]=result;
  resolveEffects(s,id,score);
  return true;
 }
 function updateLevel(s) {
  const vals=d.RESPONSE_LEVEL.capacityKeys.map(k=>s.capacities[k]);
  const impact=Math.max(0,...s.additionalEvents.map(e=>e.finalImpact));
  if(s.responseLevel==='LIGHT'&&(impact>=3||vals.some(v=>v<60)||vals.filter(v=>v<80).length>=3))s.responseLevel='MODERATE';
  if(s.responseLevel==='MODERATE'&&(impact>=4||vals.some(v=>v<40)||vals.filter(v=>v<60).length>=2))s.responseLevel='SEVERE';
  s.targetPhaseCount=d.RESPONSE_LEVEL.targetPhaseCount[s.responseLevel];
 }
 function promoteForRequired(s,n) {
  if(n>17)throw Error('mandatory phase count exceeds library');
  if(n>s.targetPhaseCount&&s.responseLevel==='LIGHT'){s.responseLevel='MODERATE';s.targetPhaseCount=13;}
  if(n>s.targetPhaseCount){s.responseLevel='SEVERE';s.targetPhaseCount=17;}
 }
 function advance(s) {s.eventProgress=clamp(Math.max(s.eventProgress,s.completedPhaseIds.length/s.targetPhaseCount),0,1);return s.eventProgress;}
 function initSchedule(s,rng) {
  if(s.eventScheduleInitialized)return;
  s.eventSchedule=d.EVENTS.filter(e=>e.scenario===s.scenario).map(e=>{
   const u=rng();assert.ok(Number.isFinite(u)&&u>=0&&u<1);
   const willOccur=u<e.probability[s.initialSeverity];
   let triggerProgress=null;
   if(willOccur){const v=rng();assert.ok(Number.isFinite(v)&&v>=0&&v<1);triggerProgress=e.minProgress+v*(e.maxProgress-e.minProgress);}
   return {eventId:e.id,willOccur,triggerProgress,selectedForRun:false,triggered:false,triggeredAtProgress:null,finalImpact:null};
  });
  const accepted=s.eventSchedule.filter(e=>e.willOccur).sort((a,b)=>a.triggerProgress-b.triggerProgress||(a.eventId<b.eventId?-1:a.eventId>b.eventId?1:0)).slice(0,3);
  accepted.forEach(e=>e.selectedForRun=true);s.eventScheduleInitialized=true;
 }
 function applyEvent(s,rec) {
  if(rec.triggered)return false;
  const def=d.EVENTS.find(e=>e.id===rec.eventId);
  const snapshot=structuredClone(s.phaseResults);
  const amp=Math.min(2,def.amplificationSources[s.role].reduce((a,id)=>a+(snapshot[id]?.completed?d.EVENT_AMPLIFICATION.scoreContribution[snapshot[id].score]:0),0));
  const base=d.EVENT_AMPLIFICATION.baseImpact[s.initialSeverity],impact=clamp(base+amp,1,4);
  rec.triggered=true;rec.triggeredAtProgress=s.eventProgress;rec.finalImpact=impact;
  s.additionalEvents.push({eventId:def.id,baseImpact:base,amplification:amp,finalImpact:impact,priorResults:snapshot});
  for(const type of def.effects) {
   const map=d.EFFECT_CAPACITY_MAPPING[type];
   for(const [key,values]of Object.entries(map.capacityDeltas))s.capacities[key]=clamp(s.capacities[key]+values[impact-1]);
   for(const [key,values]of Object.entries(map.pressureDeltas))s.pressures[key]=clamp(s.pressures[key]+values[impact-1]);
   s.activeEffects.push({type,sourceEventId:def.id,finalImpact:impact,active:true,resolvedBy:null,resolvedAtPhaseId:null});
  }
  resolveEffects(s);updateLevel(s);return true;
 }
 function fireCrossed(s,previous) {
  const eligible=s.eventSchedule.filter(e=>e.selectedForRun&&!e.triggered&&previous<e.triggerProgress&&s.eventProgress>=e.triggerProgress).sort((a,b)=>a.triggerProgress-b.triggerProgress||(a.eventId<b.eventId?-1:a.eventId>b.eventId?1:0));
  eligible.forEach(e=>applyEvent(s,e));return eligible.length;
 }
 function risk(s) {
  const maxByType={};
  for(const e of s.activeEffects) {
   if(!e.active)continue;
   const keys=d.RESULT_ENGINE.activeEffectRisk.relatedCapacityKeys[e.type];
   const avg=keys.reduce((n,k)=>n+s.capacities[k],0)/keys.length;
   const persist=avg>=80?.35:avg>=60?.6:avg>=40?.8:1;
   const c=d.RESULT_ENGINE.activeEffectRisk.weights[e.type]*(e.finalImpact/4)*persist;
   maxByType[e.type]=Math.max(maxByType[e.type]||0,c);
  }
  return clamp(Object.values(maxByType).reduce((a,b)=>a+b,0));
 }
 const physical=d.CAPACITY.physicalEffective,support=d.CAPACITY.support;
 check('counts_3_51_204_153_204',()=>equalDeep([Object.keys(d.ROLE_META).length,pp.length,cc.length,pp.reduce((n,p)=>n+Object.keys(p.situationVariants).length,0),new Set(cc.map(c=>c.actionTag)).size],[3,51,204,153,204]));
 for(const score of [10,7,3,0])check('score_count_'+score,()=>assert.equal(cc.filter(c=>c.score===score).length,51));
 check('stable_unique_IDs',()=>{assert.equal(new Set(pp.map(p=>p.id)).size,51);assert.equal(new Set(cc.map(c=>c.id)).size,204);});
 check('text_and_tag_nonblank',()=>{assert.ok(cc.every(c=>c.textCore.trim()&&c.actionTag.trim()));assert.ok(pp.every(p=>Object.values(p.situationVariants).every(t=>t.trim())));});
 check('role_authority_boundary_metadata',()=>assert.ok(pp.every(p=>p.choices.every(c=>c.roleOwner===p.roleOwner&&c.authorityScope===p.authorityScope&&c.authorityAction===p.authorityAction))));
 check('role_semantic_audit_records',()=>{assert.equal(d.CHOICE_ROLE_AUDIT.length,204);assert.ok(d.CHOICE_ROLE_AUDIT.every(a=>a.verdict==='ROLE_PURE'));assert.equal(d.SITUATION_AUDIT.length,153);assert.ok(d.SITUATION_AUDIT.every(a=>!a.roleMismatch&&!a.futureAssumption&&!a.unselectedOptionalAssumption&&!a.nonexistentEventAssumption&&!a.directAnswerLeakage));});
 check('display_balance_permutations',()=>{const pos={A:0,B:0,C:0,D:0};for(const p of pp){assert.equal(new Set(p.choiceDisplayOrder).size,4);assert.ok(p.choiceDisplayOrder.every(id=>p.choices.some(c=>c.id===id)));pos['ABCD'[p.choiceDisplayOrder.indexOf(p.choices.find(c=>c.score===10).id)]]++;}equalDeep(pos,{A:13,B:13,C:13,D:12});});
 check('effective_choices_612_immutable',()=>{let n=0;for(const p of pp)for(const sc of d.SCENARIOS)for(const c of p.choices){const overlay=d.CHOICE_RENDERING.scenarioContexts[sc];equalDeep(Object.keys(overlay).sort(),d.CHOICE_RENDERING.allowedOverlayFields.slice().sort());assert.ok(overlay.hazardContext&&c.textCore);n++;}assert.equal(n,612);});
 for(const [role,ps]of Object.entries(d.ROLE_PHASES))check('phase_classes_and_candidates_'+role,()=>{const counts={};ps.forEach(p=>counts[p.phaseClass]=(counts[p.phaseClass]||0)+1);equalDeep(counts,{CORE:8,EXPANSION:5,OPTIONAL_BASE:4});const actual=ps.filter(p=>p.phaseClass!=='CORE').map(p=>p.id).sort();const expected=d.RELEVANCE.candidateIds.filter(id=>pm[id].roleOwner===role).sort();assert.equal(actual.length,9);equalDeep(actual,expected);assert.ok(ps.filter(p=>p.phaseClass==='CORE').every(p=>p.relevance.applicable===false));});
 check('relevance_hardTriggers_27',()=>{assert.equal(Object.keys(d.RELEVANCE.definitions).length,27);assert.ok(Object.values(d.RELEVANCE.definitions).every(c=>c.hardTrigger?.op&&Number.isFinite(c.basePriority)&&d.SCENARIOS.every(sc=>Number.isFinite(c.scenarioAffinity[sc]))));});
 check('relevance_related_keys_valid',()=>assert.ok(Object.values(d.RELEVANCE.definitions).every(c=>c.relatedCapacityKeys.every(k=>capKeys.includes(k))&&c.relatedPriorPhaseIds.every(id=>pm[id]?.roleOwner===pm[c.phaseId].roleOwner)&&c.relatedEffectTypes.every(t=>d.EFFECT_CAPACITY_MAPPING[t]))));
 check('dependency_known_same_role_acyclic',()=>{function walk(id,stack=[]){assert.ok(!stack.includes(id));for(const dep of pm[id].dependencies)for(const src of dep.sources){assert.ok(pm[src]);assert.equal(pm[src].roleOwner,pm[id].roleOwner);walk(src,stack.concat(id));}}pp.forEach(p=>walk(p.id));});
 check('linked_prerequisites_exact',()=>equalDeep(d.DEPENDENCIES.map(x=>[x.target,x.type,x.sources]),[['PMX03','REQUIRED',['PM08']],['MLX03','REQUIRED',['ML07']],['MLX04','REQUIRED',['ML08','ML09']],['TOX03','ONE_OF',['TO07','TO08']],['TOX04','REQUIRED',['TO10']]]));
 check('events_12_probabilities48_windows12',()=>{assert.equal(d.EVENTS.length,12);assert.equal(d.EVENTS.flatMap(e=>Object.values(e.probability)).length,48);assert.ok(d.EVENTS.every(e=>Object.values(e.probability).every(v=>v>=0&&v<=1)&&e.minProgress>=0&&e.minProgress<e.maxProgress&&e.maxProgress<=1));});
 check('event_sources_known_role_filtered',()=>assert.ok(d.EVENTS.every(e=>e.amplificationSourceIds.every(id=>pm[id])&&Object.entries(e.amplificationSources).every(([role,ids])=>ids.every(id=>pm[id].roleOwner===role)))));
 check('initial_capacities12_support100_pressure0',()=>{let n=0;for(const sc of d.SCENARIOS)for(const severity of ['LIGHT','MODERATE','SEVERE','EXTREME']){const co=d.CAPACITY.initialByScenarioSeverity[sc][severity];assert.equal(Object.keys(co.capacity).length,11);assert.ok(Object.values(co.capacity).every(v=>Number.isFinite(v)&&v>=0&&v<=100));assert.ok(support.every(k=>co.capacity[k]===100));equalDeep(co.pressure,{berthDemand:0,handlingDemand:0});n++;}assert.equal(n,12);});
 check('mutation51_classes_targets_no_inspection_repair',()=>{assert.equal(Object.keys(d.PHASE_ACTION_MUTATION.definitions).length,51);for(const p of pp)for(const o of p.actionMutation.operations){assert.ok(d.PHASE_ACTION_MUTATION.classes.includes(o.mutationClass));if(o.mutationClass==='SUPPORT_CAPACITY'||o.mutationClass==='RECOVERY_CAPABILITY')assert.ok(o.targets.every(k=>support.includes(k)));if(o.mutationClass==='FUNCTIONAL_SUBSTITUTE')assert.ok(['TO10','TOX02','TOX04'].includes(p.id));if(o.mutationClass==='PRESSURE_MITIGATION')assert.ok(o.targets.every(k=>['berthDemand','handlingDemand'].includes(k)));for(const score of [10,7,3,0])assert.ok(d.PHASE_ACTION_MUTATION.amountByScore[o.mutationClass][score]>=0||o.mutationClass==='PRESSURE_MITIGATION');}});
 for(const p of pp)for(const score of [10,7,3,0])check('mutation_once_'+p.id+'_'+score,()=>{const s=state(p.roleOwner);capKeys.forEach(k=>s.capacities[k]=30);s.pressures={berthDemand:70,handlingDemand:70};const before=structuredClone(s);assert.equal(applyPhase(s,p.id,score),true);for(const [key,delta]of Object.entries(p.capacityMutation.byScore[score]))assert.equal(s.capacities[key],clamp(before.capacities[key]+delta));for(const [key,delta]of Object.entries(p.pressureMutation.byScore[score]))assert.equal(s.pressures[key],clamp(before.pressures[key]+delta));const first=JSON.stringify(s);for(let i=0;i<3;i++)assert.equal(applyPhase(s,p.id,score),false);assert.equal(JSON.stringify(s),first);assert.equal(s.phaseResults[p.id].stateMutationApplied,true);});
 check('TOX04_half_yard_and_pressure',()=>{for(const [score,land,yard,pres]of [[10,20,10,-20],[7,12,6,-12],[3,4,2,-4],[0,0,0,0]]){const s=state('TERMINAL_OPERATOR');s.capacities.landAccess=10;s.capacities.yard=10;s.pressures.handlingDemand=50;applyPhase(s,'TOX04',score);assert.equal(s.capacities.landAccess,10+land);assert.equal(s.capacities.yard,10+yard);assert.equal(s.pressures.handlingDemand,50+pres);}});
 check('request_flags_success_only',()=>{for(const [id,key,role]of [['PM11','altPortCoordinationRequested','PORT_MANAGER'],['ML03','technicalSupportRequested','HOKKAIDO_DEVELOPMENT_BUREAU'],['ML09','landTransportCoordinationRequested','HOKKAIDO_DEVELOPMENT_BUREAU']])for(const score of [10,7,3,0]){const s=state(role);applyPhase(s,id,score);assert.equal(s.coordinationFlags[key],score>=7);}});
 for(const [name,severity,capacity,impact,expected]of [
 ['light_impact3','LIGHT',{},3,'MODERATE'],['light_one_lt60','LIGHT',{berth:59},0,'MODERATE'],['light_three_lt80','LIGHT',{berth:79,channel:79,yard:79},0,'MODERATE'],
 ['moderate_impact4','MODERATE',{},4,'SEVERE'],['moderate_one_lt40','MODERATE',{berth:39},0,'SEVERE'],['moderate_two_lt60','MODERATE',{berth:59,channel:59},0,'SEVERE'],['light_cascade_impact4','LIGHT',{},4,'SEVERE']
 ])check('response_'+name,()=>{const s=state('PORT_MANAGER',severity);capKeys.forEach(k=>s.capacities[k]=100);Object.assign(s.capacities,capacity);if(impact)s.additionalEvents.push({finalImpact:impact});updateLevel(s);assert.equal(s.responseLevel,expected);assert.equal(s.targetPhaseCount,d.RESPONSE_LEVEL.targetPhaseCount[expected]);});
 check('extreme_initial17_no_downgrade',()=>{const s=state('PORT_MANAGER','EXTREME');assert.equal(s.responseLevel,'SEVERE');assert.equal(s.targetPhaseCount,17);capKeys.forEach(k=>s.capacities[k]=100);updateLevel(s);assert.equal(s.responseLevel,'SEVERE');});
 check('frame_overflow_10_13_17',()=>{const s=state('PORT_MANAGER','LIGHT');promoteForRequired(s,11);assert.equal(s.targetPhaseCount,13);promoteForRequired(s,14);assert.equal(s.targetPhaseCount,17);promoteForRequired(s,10);assert.equal(s.targetPhaseCount,17);assert.throws(()=>promoteForRequired(s,18));});
 check('eventProgress_monotonic_10_13_17',()=>{const s=state('PORT_MANAGER','LIGHT');const seq=[];for(const [n,target]of [[5,10],[6,13],[7,17],[12,17],[17,17]]){s.targetPhaseCount=target;s.completedPhaseIds=d.ROLE_PHASES.PORT_MANAGER.slice(0,n).map(p=>p.id);seq.push(advance(s));}assert.ok(seq.every((v,i)=>i===0||v>=seq[i-1]));equalDeep(seq.slice(0,3),[.5,.5,.5]);assert.equal(seq.at(-1),1);});
 check('probability_once_schedule_fixed_max3',()=>{const s=state();let calls=0;const rng=()=>{calls++;return 0;};initSchedule(s,rng);assert.equal(calls,8);assert.equal(s.eventSchedule.filter(e=>e.willOccur).length,4);assert.equal(s.eventSchedule.filter(e=>e.selectedForRun).length,3);const snapshot=JSON.stringify(s.eventSchedule);for(let i=0;i<3;i++)initSchedule(s,rng);assert.equal(calls,8);assert.equal(JSON.stringify(s.eventSchedule),snapshot);s.eventProgress=1;assert.equal(fireCrossed(s,0),3);const after=JSON.stringify(s);assert.equal(fireCrossed(s,0),0);assert.equal(JSON.stringify(s),after);});
 check('false_probability_no_trigger_draw',()=>{const s=state();let calls=0;initSchedule(s,()=>{calls++;return .999;});assert.equal(calls,4);assert.ok(s.eventSchedule.every(e=>!e.willOccur&&e.triggerProgress===null));});
 check('event_tie_break_ID_order',()=>{const s=state();s.eventSchedule=[{eventId:'EQ_SECONDARY_SETTLEMENT',willOccur:true,selectedForRun:true,triggerProgress:.5,triggered:false},{eventId:'EQ_FLOATING_DEBRIS',willOccur:true,selectedForRun:true,triggerProgress:.5,triggered:false}];s.eventProgress=.5;fireCrossed(s,0);equalDeep(s.additionalEvents.map(e=>e.eventId),['EQ_FLOATING_DEBRIS','EQ_SECONDARY_SETTLEMENT']);});
 check('amplification_completed_sources_snapshot_only',()=>{const s=state();s.phaseResults.PM04={score:0,completed:false};s.eventProgress=.5;const rec={eventId:'EQ_FLOATING_DEBRIS',triggered:false};applyEvent(s,rec);assert.equal(s.additionalEvents[0].amplification,0);s.phaseResults.PM04={score:0,completed:true};assert.equal(s.additionalEvents[0].amplification,0);});
 check('amplification_cap2_and_no_duplicate_event',()=>{const s=state();s.phaseResults.PM03={score:0,completed:true};s.phaseResults.PM05={score:0,completed:true};const rec={eventId:'EQ_AFTERSHOCK',triggered:false};applyEvent(s,rec);assert.equal(s.additionalEvents[0].amplification,2);assert.equal(rec.finalImpact,4);const snap=JSON.stringify(s);assert.equal(applyEvent(s,rec),false);assert.equal(JSON.stringify(s),snap);});
 check('overtopping_impact2_channel40_berth10',()=>{const s=state('PORT_MANAGER','MODERATE','TCHW');s.capacities.channel=100;s.capacities.berth=100;applyEvent(s,{eventId:'HW_OVERTOPPING',triggered:false});assert.equal(s.capacities.channel,60);assert.equal(s.capacities.berth,90);});
 check('all0_E2E_response17_all9fixtures',()=>{for(const f of d.QA_V2_0.suites.find(s=>s.id==='E2E').fixedEventFixtures){const s=state(f.role,'MODERATE',f.scenario);s.phaseResults[f.afterPhaseId]={score:0,completed:true};applyEvent(s,{eventId:f.eventId,triggered:false});assert.equal(s.additionalEvents[0].amplification,2);assert.equal(s.additionalEvents[0].finalImpact,4);assert.equal(s.responseLevel,'SEVERE');assert.equal(s.targetPhaseCount,17);}});
 check('PORT_TCHW_all10_response17',()=>{const s=state('PORT_MANAGER','MODERATE','TCHW');s.phaseResults.PM04={score:10,completed:true};applyEvent(s,{eventId:'HW_OVERTOPPING',triggered:false});assert.equal(s.capacities.channel,30);assert.equal(s.targetPhaseCount,17);});
 check('recheck_10_7_resolve_3_0_persist',()=>{for(const score of [10,7,3,0]){const s=state();s.activeEffects=[{type:'RECHECK_FACILITIES',finalImpact:3,active:true,sourceEventId:'EQ_AFTERSHOCK',resolvedBy:null,resolvedAtPhaseId:null}];const before=structuredClone(s.capacities);applyPhase(s,'PMX01',score);assert.equal(s.activeEffects[0].active,score<7);equalDeep(s.capacities,before);if(score>=7){assert.equal(s.activeEffects[0].resolvedBy,'PMX01');assert.equal(risk(s),0);}}});
 check('new_recheck_not_retroactively_resolved',()=>{const s=state();applyPhase(s,'PMX01',10);applyEvent(s,{eventId:'EQ_AFTERSHOCK',triggered:false});assert.equal(s.activeEffects[0].active,true);});
 check('demand_effect_resolution_threshold20',()=>{const s=state();s.activeEffects=[{type:'BERTH_DEMAND_UP',active:true,finalImpact:2},{type:'HANDLING_DEMAND_UP',active:true,finalImpact:2}];s.pressures={berthDemand:21,handlingDemand:20};resolveEffects(s,'PMX03',7);assert.equal(s.activeEffects[0].active,true);assert.equal(s.activeEffects[1].active,false);s.pressures.berthDemand=20;resolveEffects(s,'PMX03',7);assert.equal(s.activeEffects[0].active,false);assert.equal(s.pressures.berthDemand,20);});
 check('substitute_keeps_source_effect',()=>{for(const [id,type,key]of [['TOX02','POWER_CAPACITY_DOWN','power'],['TO10','YARD_CAPACITY_DOWN','yard'],['TOX04','LAND_ACCESS_DOWN','landAccess']]){const s=state('TERMINAL_OPERATOR');s.capacities[key]=20;s.activeEffects=[{type,active:true,finalImpact:4}];applyPhase(s,id,10);assert.equal(s.capacities[key],40);assert.equal(s.activeEffects[0].active,true);}});
 check('resolved_effect_risk_excluded_same_type_max',()=>{const s=state();s.capacities.channel=0;s.activeEffects=[{type:'CHANNEL_RISK_UP',finalImpact:4,active:true},{type:'CHANNEL_RISK_UP',finalImpact:2,active:true},{type:'RECHECK_FACILITIES',finalImpact:4,active:false}];assert.equal(risk(s),22);});
 for(const n of [10,13,17])for(const score of [10,7,3,0])check('normalization_'+n+'_'+score,()=>{const ds=100*n*score/(10*n),base=100*n*d.RESULT_ENGINE.choiceRisk[score]/(25*n),crit=score===0?100:0,dr=clamp(Math.max(base,(base+crit)/2));assert.equal(ds,{10:100,7:70,3:30,0:0}[score]);assert.equal(base,{10:0,7:8,3:32,0:100}[score]);assert.equal(dr,base);});
 check('result_constants_metric_weights',()=>{for(const m of Object.values(d.RESULT_ENGINE.metricDefinitions))assert.equal(Object.values(m.weights).reduce((a,b)=>a+b,0),100);assert.equal(d.RESULT_ENGINE.decisionRisk,'clamp(max(normalizedChoiceRisk, (normalizedChoiceRisk + criticalFailureRate) / 2), 0, 100)');assert.equal(Object.keys(d.RESULT_ENGINE.activeEffectRisk.relatedCapacityKeys).length,11);});
 check('comment_mappings_204_same_role',()=>{assert.equal(Object.keys(d.COMMENTS.actionTagMappings).length,204);for(const c of cc)assert.equal(d.COMMENTS.actionTagMappings[c.actionTag].roleOwner,c.roleOwner);equalDeep(d.COMMENTS.limits,{review:3,missingActions:5,improvements:5,eventReview:2});});

 check('formal_CORE_IDs_exact',()=>{const expected={PORT_MANAGER:['PM01','PM02','PM03','PM04','PM05','PM06','PM09','PM12'],HOKKAIDO_DEVELOPMENT_BUREAU:['ML01','ML02','ML03','ML04','ML05','ML09','ML11','ML12'],TERMINAL_OPERATOR:['TO01','TO02','TO03','TO04','TO05','TO06','TO09','TO12']};for(const [role,ids]of Object.entries(expected))equalDeep(d.ROLE_PHASES[role].filter(p=>p.phaseClass==='CORE').map(p=>p.id).sort(),ids.slice().sort());});
 check('mutation_score_tables_exact',()=>{equalDeep(d.PHASE_ACTION_MUTATION.amountByScore.SUPPORT_CAPACITY,{10:15,7:10,3:4,0:0});equalDeep(d.PHASE_ACTION_MUTATION.amountByScore.RECOVERY_CAPABILITY,{10:15,7:10,3:4,0:0});equalDeep(d.PHASE_ACTION_MUTATION.amountByScore.PRESSURE_MITIGATION,{10:-20,7:-12,3:-4,0:0});equalDeep(d.PHASE_ACTION_MUTATION.amountByScore.FUNCTIONAL_SUBSTITUTE,{10:20,7:12,3:4,0:0});});
 check('mutation_op_table_exact',()=>{const expected={
 PM10:[['RECOVERY_CAPABILITY',['recovery'],1]],PM11:[['SUPPORT_CAPACITY',['coordination'],1]],PMX03:[['PRESSURE_MITIGATION',['berthDemand','handlingDemand'],1]],PMX04:[['PRESSURE_MITIGATION',['handlingDemand'],1],['SUPPORT_CAPACITY',['coordination'],1]],
 ML02:[['SUPPORT_CAPACITY',['survey'],1]],ML03:[['SUPPORT_CAPACITY',['survey'],1]],ML04:[['SUPPORT_CAPACITY',['survey'],1]],ML05:[['RECOVERY_CAPABILITY',['recovery','coordination'],1]],ML06:[['SUPPORT_CAPACITY',['coordination'],1]],ML07:[['SUPPORT_CAPACITY',['coordination'],1]],ML08:[['SUPPORT_CAPACITY',['coordination'],1]],ML09:[['SUPPORT_CAPACITY',['coordination'],1]],ML10:[['RECOVERY_CAPABILITY',['recovery'],1]],ML11:[['SUPPORT_CAPACITY',['coordination'],1]],MLX01:[['SUPPORT_CAPACITY',['survey'],1]],MLX02:[['RECOVERY_CAPABILITY',['recovery','coordination'],1]],MLX03:[['SUPPORT_CAPACITY',['coordination'],1]],MLX04:[['SUPPORT_CAPACITY',['coordination'],1],['PRESSURE_MITIGATION',['berthDemand','handlingDemand'],1]],
 TO07:[['PRESSURE_MITIGATION',['handlingDemand'],1]],TO10:[['FUNCTIONAL_SUBSTITUTE',['yard'],1]],TOX02:[['FUNCTIONAL_SUBSTITUTE',['power'],1]],TOX03:[['PRESSURE_MITIGATION',['handlingDemand'],1]],TOX04:[['FUNCTIONAL_SUBSTITUTE',['landAccess'],1],['FUNCTIONAL_SUBSTITUTE',['yard'],.5],['PRESSURE_MITIGATION',['handlingDemand'],1]]};
 for(const p of pp)equalDeep(p.actionMutation.operations.map(o=>[o.mutationClass,o.targets,o.multiplier]),expected[p.id]||[['NONE',[],1]]);
 });
 check('mutation_clamp0_100',()=>{const s=state('TERMINAL_OPERATOR');s.capacities.landAccess=99;s.capacities.yard=99;s.pressures.handlingDemand=1;applyPhase(s,'TOX04',10);assert.equal(s.capacities.landAccess,100);assert.equal(s.capacities.yard,100);assert.equal(s.pressures.handlingDemand,0);});
 check('persistent_effects_not_resolved_by_inspection',()=>{const s=state('TERMINAL_OPERATOR');s.activeEffects=d.ACTIVE_EFFECT_POLICY.persistentTypes.map(type=>({type,active:true,finalImpact:4}));applyPhase(s,'TOX01',10);assert.ok(s.activeEffects.every(e=>e.active));});
 check('support_and_functional_substitute_never_erase_RECHECK',()=>{for(const [role,id]of [['HOKKAIDO_DEVELOPMENT_BUREAU','MLX01'],['TERMINAL_OPERATOR','TOX01']]){const s=state(role);s.activeEffects=[{type:'RECHECK_FACILITIES',active:true,finalImpact:2}];applyPhase(s,id,10);assert.equal(s.activeEffects[0].active,true);}});
 check('event_OUTDOOR_impact4_expected_deltas',()=>{const s=state('HOKKAIDO_DEVELOPMENT_BUREAU','EXTREME','TCHW');s.capacities.handling=100;s.capacities.yard=100;applyEvent(s,{eventId:'HW_WIND_REINTENSIFY',triggered:false});assert.equal(s.capacities.handling,50);assert.equal(s.capacities.yard,70);});
 check('RECHECK_EVENT_no_capacity_delta',()=>{const s=state();const before=structuredClone(s.capacities);applyEvent(s,{eventId:'EQ_AFTERSHOCK',triggered:false});equalDeep(s.capacities,before);assert.equal(s.activeEffects[0].active,true);assert.ok(risk(s)>0);});
 check('FIELD_ACCESS_EVENT_only_fieldAccess',()=>{const s=state();const before=structuredClone(s.capacities);applyEvent(s,{eventId:'EQ_TSUNAMI_REENTRY',triggered:false});for(const k of capKeys)assert.equal(s.capacities[k],before[k]-(k==='fieldAccess'?20:0));});
 check('demand_impact1_immediate_resolution_at20',()=>{const s=state('PORT_MANAGER','LIGHT','TCHW');applyEvent(s,{eventId:'HW_VESSEL_DELAY',triggered:false});equalDeep(s.pressures,{berthDemand:20,handlingDemand:20});assert.ok(s.activeEffects.every(e=>!e.active));});

 check('unresolved_implementation_zero',()=>assert.equal(d.UNRESOLVED.length,0));
 return {status:tests.every(t=>t.status==='PASS')?'PASS':'FAIL',pass:tests.filter(t=>t.status==='PASS').length,fail:tests.filter(t=>t.status==='FAIL').length,tests,scope:'Static data QA and reference unit fixtures only. No application E2E, PDF, restart UI or role-switch UI executed.'};
}
module.exports={verify};
if(require.main===module){const file=process.argv[2]||path.join(__dirname,'bcp_port_master_data_v1_0.json');const report=verify(JSON.parse(fs.readFileSync(file,'utf8')));console.log(JSON.stringify(report,null,2));process.exitCode=report.fail?1:0;}
