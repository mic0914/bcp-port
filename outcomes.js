/* Presentation-only decision reports. Never mutates engine state. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BcpOutcomes=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const profiles={
  "PM01": {
    "kind": "確認",
    "mode": "簡略",
    "keys": [
      "workforce",
      "fieldAccess"
    ],
    "context": "現地活動の体制と、個別地点へ安全に立ち入れるかどうかは別に扱います。"
  },
  "PM02": {
    "kind": "確認",
    "mode": "簡略",
    "keys": [
      "survey",
      "fieldAccess"
    ],
    "context": "調査体制の余力だけでは、未確認施設の被害や安全性までは確定しません。"
  },
  "PM03": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "berth"
    ],
    "context": "岸壁の利用条件を検討する際も、残る能力制約を前提とします。"
  },
  "PM04": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "channel"
    ],
    "context": "航路・泊地の機能が残っていても、すべての船舶が無条件に利用できることは意味しません。"
  },
  "PMX01": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "berth",
      "channel",
      "yard"
    ],
    "context": "再確認要求の解消と、施設そのものの被害の解消は区別します。"
  },
  "PM05": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "yard",
      "landAccess"
    ],
    "context": "保管場所と港内外の搬出接続を、両方の制約の中で扱います。"
  },
  "PM06": {
    "kind": "条件",
    "mode": "簡略",
    "keys": [
      "berth",
      "channel",
      "yard"
    ],
    "context": "利用条件の設定によって、施設の利用可能な能力自体が回復するわけではありません。"
  },
  "PMX02": {
    "kind": "条件",
    "mode": "独立",
    "keys": [
      "berth",
      "channel",
      "yard"
    ],
    "context": "利用条件を見直す際は、従前の条件と現在の機能制約を同一とは扱いません。"
  },
  "PM07": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "berth",
      "channel",
      "handling"
    ],
    "context": "自港の受入れは、岸壁・水域・荷役に残る能力の範囲が前提になります。"
  },
  "PM08": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "berth",
      "handling"
    ],
    "context": "岸壁の配分だけでは、荷役能力や需要集中そのものが解消するとは限りません。"
  },
  "PMX03": {
    "kind": "需要",
    "mode": "独立",
    "keys": [
      "berth",
      "handling"
    ],
    "context": "需要調整による混雑の変化と、施設の機能回復は別のものです。"
  },
  "PM09": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "landAccess"
    ],
    "context": "自港側で受け入れられる量と、背後へ搬出できる量は同じとは限りません。"
  },
  "PMX04": {
    "kind": "需要",
    "mode": "独立",
    "keys": [
      "yard",
      "landAccess"
    ],
    "context": "搬出需要の調整は、背後交通そのものの機能回復を意味しません。"
  },
  "PM10": {
    "kind": "復旧",
    "mode": "独立",
    "keys": [
      "recovery"
    ],
    "context": "復旧に対応する体制の確保であり、岸壁等の修復完了を意味しません。"
  },
  "PM11": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "coordination",
      "berth",
      "channel",
      "landAccess"
    ],
    "context": "代替港への調整要請は、他港の受入れ決定・確約とは区別します。"
  },
  "PMX05": {
    "kind": "確認",
    "mode": "簡略",
    "keys": [
      "berth",
      "channel",
      "yard",
      "handling",
      "power",
      "landAccess"
    ],
    "context": "未解決の制約がある場合、利用制限を緩和する段階でも残る前提です。"
  },
  "PM12": {
    "kind": "条件",
    "mode": "簡略",
    "keys": [
      "berth",
      "channel",
      "landAccess"
    ],
    "context": "最終方針を選択しても、残存する施設・交通の制約が自動的に解消することはありません。"
  },
  "ML01": {
    "kind": "調整",
    "mode": "簡略",
    "keys": [
      "coordination",
      "fieldAccess"
    ],
    "context": "広域の支援体制と、各港の施設利用可否の判断は別に扱います。"
  },
  "ML02": {
    "kind": "支援",
    "mode": "独立",
    "keys": [
      "survey",
      "fieldAccess"
    ],
    "context": "調査体制が整っていても、現地への立入り可能範囲が調査の制約になります。"
  },
  "ML03": {
    "kind": "支援",
    "mode": "独立",
    "keys": [
      "survey",
      "berth"
    ],
    "context": "技術支援の手配と、港湾管理者による岸壁利用可否の最終決定は別です。"
  },
  "ML04": {
    "kind": "支援",
    "mode": "独立",
    "keys": [
      "survey",
      "fieldAccess",
      "channel"
    ],
    "context": "調査支援の余力と、航路・泊地が実際に利用できる範囲は区別します。"
  },
  "MLX01": {
    "kind": "支援",
    "mode": "独立",
    "keys": [
      "survey",
      "fieldAccess"
    ],
    "context": "調査配置の調整だけでは、現地立入りの制約そのものは解消しません。"
  },
  "ML05": {
    "kind": "復旧",
    "mode": "独立",
    "keys": [
      "recovery",
      "coordination"
    ],
    "context": "復旧資源の調整は支援体制に関わるもので、施設修復の完了ではありません。"
  },
  "MLX02": {
    "kind": "復旧",
    "mode": "独立",
    "keys": [
      "recovery",
      "coordination"
    ],
    "context": "国側の復旧対応力と、各施設に残る被害は分けて扱います。"
  },
  "ML06": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "coordination",
      "survey"
    ],
    "context": "広域調整が進んでも、追加被害や各港の制約が解消したとは扱いません。"
  },
  "ML07": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "coordination",
      "berth",
      "channel",
      "landAccess"
    ],
    "context": "海上支援の調整余力と、受入港の岸壁・水域・背後交通の能力は別の条件です。"
  },
  "MLX03": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "coordination",
      "berth",
      "channel",
      "landAccess"
    ],
    "context": "支援ネットワークの調整だけで、各港の受入能力は増加しません。"
  },
  "ML08": {
    "kind": "調整",
    "mode": "簡略",
    "keys": [
      "coordination",
      "berth",
      "channel"
    ],
    "context": "代替港の候補情報は、当該港での利用決定・バース割当とは異なります。"
  },
  "ML09": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "coordination",
      "landAccess"
    ],
    "context": "交通情報の集約・連携と、道路の規制解除は別の手続きです。"
  },
  "MLX04": {
    "kind": "需要",
    "mode": "独立",
    "keys": [
      "coordination",
      "landAccess",
      "berth",
      "handling"
    ],
    "context": "機能分担の調整支援は、各港の利用可否の最終決定を代替しません。"
  },
  "ML10": {
    "kind": "復旧",
    "mode": "独立",
    "keys": [
      "recovery"
    ],
    "context": "国側の復旧支援能力は、港湾施設の物理的な復旧状況とは別に扱います。"
  },
  "ML11": {
    "kind": "調整",
    "mode": "簡略",
    "keys": [
      "coordination"
    ],
    "context": "関係機関との連絡体制が確保されても、各機関の判断権限はそのままです。"
  },
  "MLX05": {
    "kind": "確認",
    "mode": "簡略",
    "keys": [
      "survey",
      "coordination",
      "recovery"
    ],
    "context": "支援を縮小する段階でも、残る調査・調整・復旧支援の制約は考慮対象です。"
  },
  "ML12": {
    "kind": "条件",
    "mode": "簡略",
    "keys": [
      "coordination",
      "recovery"
    ],
    "context": "国側支援の通常化は、各港の利用制限の解除を意味しません。"
  },
  "TO01": {
    "kind": "確認",
    "mode": "簡略",
    "keys": [
      "workforce"
    ],
    "context": "作業員の対応体制だけでは、作業区域や設備の安全性は確定しません。"
  },
  "TO02": {
    "kind": "確認",
    "mode": "簡略",
    "keys": [
      "workforce"
    ],
    "context": "要員の余力があっても、設備・作業範囲の制約とは別に扱います。"
  },
  "TO03": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "handling"
    ],
    "context": "荷役能力が残っていても、個々の設備の安全確認や利用条件を省略できるわけではありません。"
  },
  "TO04": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "yard"
    ],
    "context": "利用可能なヤード機能は、個別区域の無条件な使用許可を意味しません。"
  },
  "TOX01": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "handling",
      "yard"
    ],
    "context": "再点検だけで、設備・ヤードの機能低下が回復することはありません。"
  },
  "TO05": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "power"
    ],
    "context": "電力の利用可能能力だけから、通信の復旧や供給継続時間までは確定できません。"
  },
  "TOX02": {
    "kind": "代替",
    "mode": "独立",
    "keys": [
      "power"
    ],
    "context": "代替電源による機能確保と、停電等の元の障害の解消は別です。"
  },
  "TO06": {
    "kind": "条件",
    "mode": "簡略",
    "keys": [
      "handling",
      "yard"
    ],
    "context": "自社の作業条件は、共有された施設利用条件と残る荷役・保管能力の制約を前提とします。"
  },
  "TO07": {
    "kind": "需要",
    "mode": "独立",
    "keys": [
      "handling"
    ],
    "context": "自社荷役順序の調整による混雑緩和であり、港全体の優先政策を変更したものではありません。"
  },
  "TO08": {
    "kind": "調整",
    "mode": "独立",
    "keys": [
      "handling",
      "workforce"
    ],
    "context": "緊急荷役への対応でも、自社の作業員・設備の能力制約は残ります。"
  },
  "TOX03": {
    "kind": "需要",
    "mode": "独立",
    "keys": [
      "handling",
      "yard"
    ],
    "context": "受入れ・処理量の調整と、荷役設備やヤードの修復は別のものです。"
  },
  "TO09": {
    "kind": "確認",
    "mode": "独立",
    "keys": [
      "workforce",
      "handling",
      "yard",
      "power",
      "landAccess"
    ],
    "context": "自社の運用能力は、要員・荷役・保管・電源・搬出接続の組合せで制約されます。"
  },
  "TO10": {
    "kind": "代替",
    "mode": "独立",
    "keys": [
      "yard"
    ],
    "context": "元のヤードに損傷・浸水がある場合も、代替ヤードの活用だけでそれらが解消するわけではありません。"
  },
  "TOX04": {
    "kind": "代替",
    "mode": "独立",
    "keys": [
      "landAccess",
      "yard"
    ],
    "context": "代替経路・代替ヤードによる機能確保であり、公共道路の規制解除ではありません。"
  },
  "TO11": {
    "kind": "条件",
    "mode": "簡略",
    "keys": [
      "workforce",
      "handling",
      "yard",
      "power",
      "landAccess"
    ],
    "context": "荷役再開の選択だけでは、要員・設備・搬出接続の能力は増加しません。"
  },
  "TOX05": {
    "kind": "確認",
    "mode": "簡略",
    "keys": [
      "handling",
      "yard",
      "power",
      "workforce"
    ],
    "context": "通常化の前提を確認しても、残る機能制約そのものは自動解消しません。"
  },
  "TO12": {
    "kind": "条件",
    "mode": "簡略",
    "keys": [
      "workforce",
      "handling",
      "yard",
      "power",
      "landAccess"
    ],
    "context": "通常荷役への移行方針と、実際に確保できる有効機能能力は区別します。"
  }
};
const names={berth:'岸壁',channel:'航路・泊地',yard:'ヤード',handling:'荷役',power:'電力',landAccess:'背後交通への接続',workforce:'作業員体制',fieldAccess:'現地への立入り',survey:'調査体制',coordination:'調整体制',recovery:'復旧支援体制',berthDemand:'岸壁利用の需要集中',handlingDemand:'荷役需要の集中'};
const effectNames={RECHECK_FACILITIES:'施設の再確認要求',FIELD_ACCESS_RESTRICTED:'現地立入り制限',CHANNEL_RISK_UP:'航路利用の制約',YARD_CAPACITY_DOWN:'ヤード能力低下',LAND_ACCESS_DOWN:'背後交通への接続能力低下',POWER_CAPACITY_DOWN:'電力供給能力低下',OUTDOOR_OPERATION_RESTRICTED:'屋外作業制限',VESSEL_OPERATION_RESTRICTED:'船舶運用制限',HANDLING_CAPACITY_DOWN:'荷役能力低下',BERTH_DEMAND_UP:'岸壁利用の需要集中',HANDLING_DEMAND_UP:'荷役需要の集中'};
const flagNames={altPortCoordinationRequested:'代替港の調整要請を行った状態です。受入れの確約は別途必要です。',technicalSupportRequested:'技術支援を要請した状態です。支援先での施設利用可否の決定を意味しません。',landTransportCoordinationRequested:'陸上輸送について調整を要請した状態です。道路規制の解除を意味しません。',emergencyCargoPriorityShared:'緊急貨物の優先方針が共有されています。'};
const clone=x=>JSON.parse(JSON.stringify(x));
const capacityStatus=v=>v>=80?'概ね確保されています':v>=60?'利用可能な能力に制約があります':v>=40?'利用可能な能力が大きく低下しています':'利用可能な能力が著しく低下しています';
const pressureStatus=v=>v>=80?'非常に強い需要集中が残っています':v>=60?'強い需要集中が残っています':v>=40?'需要が集中しています':v>20?'一定の需要負荷が残っています':v>0?'需要負荷は小さい状態です':'追加の需要集中は示されていません';
function pressureKeys(p){return [...new Set([...p.actionMutation.operations.filter(o=>o.mutationClass==='PRESSURE_MITIGATION').flatMap(o=>o.targets),...(profiles[p.id].keys.includes('berth')?['berthDemand']:[]),...(profiles[p.id].keys.includes('handling')?['handlingDemand']:[])])];}
function effectKeys(E,type){return E.master.RESULT_ENGINE.activeEffectRisk?.relatedCapacityKeys?.[type]||E.master.EFFECT_CAPACITY_MAPPING[type]?.riskCapacityKeys||Object.keys(E.master.EFFECT_CAPACITY_MAPPING[type]?.capacityDeltas||{});}
function relevantActive(E,keys,effects,id){return effects.filter(e=>e.active&&((id==='PMX01'&&e.type==='RECHECK_FACILITIES')||effectKeys(E,e.type).some(k=>keys.includes(k))));}
function snapshotAfterMutation(E,pre,post,id){
 const result=post.phaseResults[id];if(!result?.completed||!result.stateMutationApplied)throw Error('OUTCOME_REQUIRES_COMPLETED_MUTATION');
 const capacities=clone(result.capacitySnapshotAfterMutation),pressures=clone(result.pressureSnapshotAfterMutation),coordinationFlags=clone(result.coordinationSnapshotAfterMutation);
 const activeEffects=clone(pre.activeEffects);
 for(const e of activeEffects){if(!e.active)continue;
 if(e.type==='RECHECK_FACILITIES'&&id==='PMX01'&&coordinationFlags[E.byId[id].successFlag])e.active=false;
 for(const rule of E.master.ACTIVE_EFFECT_POLICY.resolutionRules)if(e.type===rule.type&&rule.when.pressure&&pressures[rule.when.pressure]<=rule.when.lte)e.active=false;
 }
 return {capacities,pressures,coordinationFlags,activeEffects};
}
function report(E,pre,post,id,choiceId){
 const p=E.byId[id],profile=profiles[id],r=post.phaseResults[id];if(!profile||p.roleOwner!==pre.role||post.role!==pre.role||r.choiceId!==choiceId)throw Error('OUTCOME_ROLE_OR_CHOICE_MISMATCH');
 const after=snapshotAfterMutation(E,pre,post,id),sentences=[],evidence=[];
 for(const op of p.actionMutation.operations){
  const isPressure=op.mutationClass==='PRESSURE_MITIGATION',beforeMap=isPressure?pre.pressures:pre.capacities,afterMap=isPressure?after.pressures:after.capacities;
  const changed=op.targets.filter(k=>afterMap[k]!==beforeMap[k]);
  if(changed.length){evidence.push(...changed.map(key=>({kind:op.mutationClass,key,before:beforeMap[key],after:afterMap[key]})));
   if(isPressure)for(const k of changed)sentences.push(names[k]+'は緩和しました。現在は、'+pressureStatus(afterMap[k])+'。');
   else sentences.push((op.mutationClass==='FUNCTIONAL_SUBSTITUTE'?'代替手段によって':'対応によって')+changed.map(k=>names[k]).join('・')+'の利用可能な機能・対応余力が改善しました。');
  }
 }
 for(const flag of p.actionMutation.flagsOnSuccess)if(after.coordinationFlags[flag]&&!pre.coordinationFlags[flag]){sentences.push(flagNames[flag]);evidence.push({kind:'FLAG',key:flag,before:false,after:true});}
 const relevant=profile.keys.slice().sort((a,b)=>after.capacities[a]-after.capacities[b]||profile.keys.indexOf(a)-profile.keys.indexOf(b));
 const limit=profile.mode==='簡略'?1:2,shown=relevant.slice(0,limit);
 sentences.push(shown.map(k=>names[k]+'は'+capacityStatus(after.capacities[k])).join('、')+'。');
 for(const key of shown)evidence.push({kind:'STATUS',key,after:after.capacities[key]});
 if(profile.kind==='需要'&&!evidence.some(e=>e.kind==='PRESSURE_MITIGATION'))for(const key of pressureKeys(p))sentences.push(names[key]+'については、'+pressureStatus(after.pressures[key])+'。');
 const still=relevantActive(E,profile.keys,after.activeEffects,id),resolved=relevantActive(E,profile.keys,pre.activeEffects,id).filter(e=>!after.activeEffects.some(a=>a.active&&a.sourceEventId===e.sourceEventId&&a.type===e.type));
 if(resolved.length)sentences.push([...new Set(resolved.map(e=>effectNames[e.type]))].join('・')+'は解消条件を満たしました。');
 if(still.length)sentences.push([...new Set(still.map(e=>effectNames[e.type]))].join('・')+'は継続しています。');
 if(!after.coordinationFlags[p.successFlag])sentences.push(({確認:'確認事項',条件:'運用条件の整理',代替:'代替手段の確保',調整:'関係先との調整',需要:'需要調整',復旧:'復旧支援の手配',支援:'支援の手配'})[profile.kind]+'には未了の条件が残ります。');
 sentences.push(profile.context);
 const title=profile.kind==='確認'?'確認結果':['調整','需要'].includes(profile.kind)?'調整結果':profile.kind==='条件'?'運用条件':'対応結果';
 return {phaseId:id,choiceId,roleOwner:p.roleOwner,title,mode:profile.mode,text:[...new Set(sentences)].join('\n'),evidence,snapshotSource:'PHASE_MUTATION_BEFORE_EVENTS',afterMutation:after};
}
function cleanSituation(id,text){
 let view=String(text).split('。').filter(Boolean).map(sentence=>{
  if(sentence==='複数地域が同じ種類の資源を必要とする場面です')return '複数地域から同じ種類の資源が求められています';
  if(sentence==='広域の接続候補について情報を照会できる場面です')return '広域の接続候補に関する情報は照会が可能です';
  if(/場面です|国側では.*扱います/.test(sentence))return '';
  return sentence;
 }).filter(Boolean).join('。')+'。';
 if(id==='PM03')view='岸壁・係留施設の個別の安全性や荷重条件は、機能の残り具合だけでは確定できません。';
 return view;
}
function nextContext(E,s,id){
 const p=E.byId[id],profile=profiles[id],parts=[];
 const limited=profile.keys.filter(k=>s.capacities[k]<80||(id==='PM03'&&k==='berth')).sort((a,b)=>s.capacities[a]-s.capacities[b]).slice(0,2);
 if(limited.length)parts.push(limited.map(k=>names[k]+'は'+capacityStatus(s.capacities[k])).join('。')+'。');
 for(const key of pressureKeys(p))if(s.pressures[key]>=40)parts.push(names[key]+'については、'+pressureStatus(s.pressures[key])+'。');
 const effects=relevantActive(E,profile.keys,s.activeEffects,id);if(effects.length)parts.push([...new Set(effects.map(e=>effectNames[e.type]))].join('・')+'が継続しています。');
 for(const warning of E.dependencyWarnings(s,id))if(warning.status!=='PENDING')parts.push('前提となる「'+E.byId[warning.phaseId].title+'」の対応には、未了の条件が残っています。');
 return [...new Set(parts)].join('\n');
}
return {profiles,names,effectNames,report,nextContext,snapshotAfterMutation,cleanSituation};
});
