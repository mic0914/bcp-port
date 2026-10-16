# bcp-port Ver.1.0 実装用正本データ 最終監査

確定日：2026-10-16。masterStatus = IMPLEMENTATION_READY。

## 引渡し判定

残り5項目を今回ユーザー指定により確定した。unresolved implementation data = 0。Static data QA = PASS / ERROR 0。静的・reference単体fixture 276件と保護データ完全一致確認1件、計277件PASS。bcp-port Ver.1.0 実装Workへ引渡し可能。

これは実装用設計データの完成であり、アプリの完成・公開ではない。アプリの36 smoke / 18 escalation / 18 E2E / PDF / restart / role switch等は次工程で実行する。GitHub・Cloudflare・対象3リポジトリを操作していない。

153状況文・60EXPANSIONタグ等は現行仕様に基づき新正本として定義したもので、旧正本を復元したものではない。今回、204択本文・153状況文・204タグ等は変更していない。

## 件数・Static QA

|項目|結果|
|---|---|
|roles|3|
|phases|51|
|basicChoices|204|
|effectiveChoices|612|
|situationVariants|153|
|events|12|
|actionTags|204|
|score10|51|
|score7|51|
|score3|51|
|score0|51|
|relevanceCandidates|27|
|hardTriggers|27|
|coreRelevanceContamination|0|
|unknownPhaseClass|0|
|duplicatePhaseID|0|
|duplicateChoiceID|0|
|unknownRole|0|
|blankSituation|0|
|blankActionTag|0|
|roleContamination|0|
|probabilityValues|48|
|eventWindows|12|
|initialCapacityCases|12|
|initialPressureCases|12|
|mutationDefinitions|51|
|unknownMutationClass|0|
|inspectionPhysicalRepair|0|
|duplicateMutationApplication|0|
|duplicateEventTrigger|0|
|unresolvedImplementationData|0|

10点位置：A13/B13/C13/D12。最大差1。choice.idと表示位置は別管理、ランダムshuffleなし。

role purityは前工程の作成者個別確認（204択・153状況・204タグ・612context表示）を継承。今回本文は不変。機械検査だけで意味の純度を保証したとは扱わない。

## 変更禁止データの保護

3役・51Phase ID/名称/順序/権限/criticalZero/successFlag、204択の全フィールド、153状況文、表示順、linked prerequisites、EVENT ID/確率/窓/effects/sources、初期capacity・pressure、既存採点式・metric weights・risk・コメント規則/lookupを前回データと投影比較し、完全一致。

保護対象投影SHA-256：301d905404a25163224679c79698a54c882ebbeb6694d69a7242e033f65340c8

明示的変更：8Phaseのclass補正、51Phaseのmutation確定、responseLevel、eventProgress、開始時抽選、EVENTレコード、effect寿命。EVENTの確率・窓・増幅元は不変だが、未設定だったoccurrenceModel/maxOccurrencesを今回規則へ確定した。

## Phase classの補正

|Phase|旧|正式|
|---|---|---|
|PM05|OPTIONAL_BASE|CORE|
|PM09|OPTIONAL_BASE|CORE|
|PM07|CORE|OPTIONAL_BASE|
|PM10|CORE|OPTIONAL_BASE|
|ML09|OPTIONAL_BASE|CORE|
|ML11|OPTIONAL_BASE|CORE|
|ML07|CORE|OPTIONAL_BASE|
|ML10|CORE|OPTIONAL_BASE|

各役CORE8/OPTIONAL_BASE4/EXPANSION5。relevance対象はOPTIONAL_BASE+EXPANSIONの各役9、計27。CORE混入0、OPTIONAL欠落0、EXPANSION欠落0。COREにはrelevanceを適用しない。

|役割|CORE|OPTIONAL_BASE|EXPANSION|
|---|---|---|---|
|PORT_MANAGER|PM01, PM02, PM03, PM04, PM05, PM06, PM09, PM12|PM07, PM08, PM10, PM11|PMX01, PMX02, PMX03, PMX04, PMX05|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML01, ML02, ML03, ML04, ML05, ML09, ML11, ML12|ML06, ML07, ML08, ML10|MLX01, MLX02, MLX03, MLX04, MLX05|
|TERMINAL_OPERATOR|TO01, TO02, TO03, TO04, TO05, TO06, TO09, TO12|TO07, TO08, TO10, TO11|TOX01, TOX02, TOX03, TOX04, TOX05|

## Phase action mutation

以下のscore別量を各operationの各対象へ適用。複数operationを持つPhaseは順に全て適用する。NONEは変化なし。

|class|10|7|3|0|
|---|---:|---:|---:|---:|
|NONE|0|0|0|0|
|SUPPORT_CAPACITY|15|10|4|0|
|RECOVERY_CAPABILITY|15|10|4|0|
|PRESSURE_MITIGATION|-20|-12|-4|0|
|FUNCTIONAL_SUBSTITUTE|20|12|4|0|

|Phase|operations|追加flag（10/7のみtrue）|
|---|---|---|
|PM01|NONE → なし||
|PM02|NONE → なし||
|PM03|NONE → なし||
|PM04|NONE → なし||
|PMX01|NONE → なし||
|PM05|NONE → なし||
|PM06|NONE → なし||
|PMX02|NONE → なし||
|PM07|NONE → なし||
|PM08|NONE → なし||
|PMX03|PRESSURE_MITIGATION → berthDemand, handlingDemand||
|PM09|NONE → なし||
|PMX04|PRESSURE_MITIGATION → handlingDemand / SUPPORT_CAPACITY → coordination||
|PM10|RECOVERY_CAPABILITY → recovery||
|PM11|SUPPORT_CAPACITY → coordination|altPortCoordinationRequested|
|PMX05|NONE → なし||
|PM12|NONE → なし||
|ML01|NONE → なし||
|ML02|SUPPORT_CAPACITY → survey||
|ML03|SUPPORT_CAPACITY → survey|technicalSupportRequested|
|ML04|SUPPORT_CAPACITY → survey||
|MLX01|SUPPORT_CAPACITY → survey||
|ML05|RECOVERY_CAPABILITY → recovery, coordination||
|MLX02|RECOVERY_CAPABILITY → recovery, coordination||
|ML06|SUPPORT_CAPACITY → coordination||
|ML07|SUPPORT_CAPACITY → coordination||
|MLX03|SUPPORT_CAPACITY → coordination||
|ML08|SUPPORT_CAPACITY → coordination||
|ML09|SUPPORT_CAPACITY → coordination|landTransportCoordinationRequested|
|MLX04|SUPPORT_CAPACITY → coordination / PRESSURE_MITIGATION → berthDemand, handlingDemand||
|ML10|RECOVERY_CAPABILITY → recovery||
|ML11|SUPPORT_CAPACITY → coordination||
|MLX05|NONE → なし||
|ML12|NONE → なし||
|TO01|NONE → なし||
|TO02|NONE → なし||
|TO03|NONE → なし||
|TO04|NONE → なし||
|TOX01|NONE → なし||
|TO05|NONE → なし||
|TOX02|FUNCTIONAL_SUBSTITUTE → power||
|TO06|NONE → なし||
|TO07|PRESSURE_MITIGATION → handlingDemand||
|TO08|NONE → なし||
|TOX03|PRESSURE_MITIGATION → handlingDemand||
|TO09|NONE → なし||
|TO10|FUNCTIONAL_SUBSTITUTE → yard||
|TOX04|FUNCTIONAL_SUBSTITUTE → landAccess / FUNCTIONAL_SUBSTITUTE → yard ×0.5 / PRESSURE_MITIGATION → handlingDemand||
|TO11|NONE → なし||
|TOX05|NONE → なし||
|TO12|NONE → なし||

23Phaseは指定された数値operation、未記載28PhaseはNONE。TOX04はlandAccess標準量、yard50%、handlingDemand減少を全て適用する。PMX04はlandAccessを直接回復させない。support/recovery調整はphysicalを修復しない。0点を理由に追加physical damageを発生させない。

全capacity/pressureは0〜100へclamp。FUNCTIONAL_SUBSTITUTEは代替手段による有効機能改善で、物理修復ではない。supportは初期100だが、稼働状態が低下している場合にだけ上限まで改善する。

回答はphaseResult.stateMutationAppliedで保護。同一Phaseの結果・capacity/pressure/flag・snapshot・適用済み印を1 transactionでcommit。再render/重複回答はNO_OP。各51Phase×4scoreを繰り返し適用して二重変化0を検証した。

## responseLevel・targetPhaseCount

初期LIGHT→LIGHT10、MODERATE→MODERATE13、SEVERE→SEVERE17、EXTREME→SEVERE17。initialSeverityはEXTREMEのまま保持し、確率・baseImpactも初期severityを使う。
LIGHT→MODERATE：finalImpact>=3 OR physicalのいずれか<60 OR physical3項目以上<80。
MODERATE→SEVERE：finalImpact>=4 OR physicalのいずれか<40 OR physical2項目以上<60。
条件を満たす限り同じ判定内で上昇を反復する。responseLevel及びtargetPhaseCountは下降しない。

災害影響・capacity条件に加え、ロック済み/current/completed/CORE/全hardTrigger/linked prerequisite閉包の枠不足でも10→13→17へ即時更新。Phaseを削除して枠に押し込まない。17超過はデータエラー。

## eventProgress

回答記録・mutation・既存effect解消・当該時点で必要なresponseLevel更新後、EVENT処理前に、rawProgress=completedPhaseIds.length/targetPhaseCount、eventProgress=clamp(max(previousEventProgress,rawProgress),0,1)。EVENTで分母が増えても同stepの進捗を下げない。次回答時に新分母で計算。タイマーは採点・EVENT時計へ使用しない。

10→13→17で単調増加を検証。完了Phase IDは固有集合で、再renderを数えない。

## EVENT抽選・発火

開始時、当該災害の4EVENTを既存配列順で各1回だけprobability判定。willOccur=trueのときだけtriggerProgressを1回抽選。確率はシミュレーション全体の候補確率であり毎Phase確率ではない。

willOccur=rng()<probability[initialSeverity]。triggerProgress=minProgress+rng()×(maxProgress-minProgress)。rngは0以上1未満。通常Math.random、QAはinjected/seeded RNG又はforced fixture。抽選結果を静的正本へ格納しない。

候補をtriggerProgress昇順、同値EVENT ID昇順で先頭3件だけselectedForRun=true。4件目を引き直さない。willOccurは元の候補判定を保持。各EVENT最大1回。scheduleInitializedで開始時抽選を二重実行しない。

previousProgress<triggerProgress && currentProgress>=triggerProgressの未発火・採用済みEVENTを同じ順で処理。triggered=trueを再適用しない。EVENTレコードの必須7項目（指定6項目+採用有無）を収録。確率判定4回/開始、候補falseの発生位置抽選0回、再renderによる乱数呼出し0回、最大3・重複発火0を検証した。

処理順：発生→直前までの完了結果snapshot→増幅→finalImpact→effect/capacity/pressure→responseLevel→Phase再計画。新たに追加されたPhaseを同EVENTの増幅へ遡及使用しない。

## activeEffect寿命

|type|解消条件|
|---|---|
|RECHECK_FACILITIES|既存active要求に対してPMX01を10/7で完了。3/0ではactive。capacity減算なし|
|BERTH_DEMAND_UP|berthDemand<=20。pressure値自体は保持|
|HANDLING_DEMAND_UP|handlingDemand<=20。pressure値自体は保持|
|FIELD_ACCESS_RESTRICTED|セッション終了までactive。確認・代替機能改善で削除しない|
|CHANNEL_RISK_UP|セッション終了までactive。確認・代替機能改善で削除しない|
|YARD_CAPACITY_DOWN|セッション終了までactive。確認・代替機能改善で削除しない|
|LAND_ACCESS_DOWN|セッション終了までactive。確認・代替機能改善で削除しない|
|POWER_CAPACITY_DOWN|セッション終了までactive。確認・代替機能改善で削除しない|
|OUTDOOR_OPERATION_RESTRICTED|セッション終了までactive。確認・代替機能改善で削除しない|
|VESSEL_OPERATION_RESTRICTED|セッション終了までactive。確認・代替機能改善で削除しない|
|HANDLING_CAPACITY_DOWN|セッション終了までactive。確認・代替機能改善で削除しない|

active=falseはriskへ寄与0、EVENT履歴へは保持。resolvedBy/resolvedAtPhaseIdを記録。PMX01が解消できるのは回答時点までのRECHECKのみ。同回答後に新発生したRECHECKは遡及解消しない。HDB/TERMINALの点検ではRECHECKを解消しない。

TOX02のpower改善≠停電解消、TO10のyard改善≠元ヤード障害解消、TOX04のlandAccess改善≠元道路障害解消。riskは関連有効capacity平均に応じたpersistenceと同type最大contributionで算定する。

## 統合QA v2.0との整合

既存の36 smoke/18 escalation/12 normalization/18 E2E/PDF/restart/role switchを維持し、今回指定の区分・mutation・昇格・抽選・effect寿命検査を追加。

重要な期待値修正：旧「MODERATE開始E2Eは全て13Phase完了」は今回の明示昇格条件と両立しない。all0はfinalImpact4で17Phase、maxRawScore170、decisionScore0/risk100。all10は最終Phase数Nに対しraw/max=10N、decisionScore100/risk0。PORT/TCHWのHW_OVERTOPPINGはimpact2でもchannel70-40=30となり17Phase。その他も能力・枠条件に従う。固定EVENT/初期MODERATE/各scoreの正規化値は変更しない。旧期待値はQA_V2_0.revisionHistoryへ保存。

この変更は今回指定のresponseLevel条件から必然的に導出した整合修正。昇格を無効化して13Phaseに合わせない。

## 検証の実行

Node.js 18以上、外部package不要：

node bcp_port_master_data_verify_v1_0.js bcp_port_master_data_v1_0.json

検証スクリプトはデータQAとreference単体fixture用で、UI/アプリ実装ではない。出力JSONのstatus/pass/fail/testsを確認する。作成時の結果はbcp_port_master_data_qa_v1_0.jsonに収録。

|検査|結果|
|---|---|
|protected_fields_exactly_unchanged|PASS|
|counts_3_51_204_153_204|PASS|
|score_count_10|PASS|
|score_count_7|PASS|
|score_count_3|PASS|
|score_count_0|PASS|
|stable_unique_IDs|PASS|
|text_and_tag_nonblank|PASS|
|role_authority_boundary_metadata|PASS|
|role_semantic_audit_records|PASS|
|display_balance_permutations|PASS|
|effective_choices_612_immutable|PASS|
|phase_classes_and_candidates_PORT_MANAGER|PASS|
|phase_classes_and_candidates_HOKKAIDO_DEVELOPMENT_BUREAU|PASS|
|phase_classes_and_candidates_TERMINAL_OPERATOR|PASS|
|relevance_hardTriggers_27|PASS|
|relevance_related_keys_valid|PASS|
|dependency_known_same_role_acyclic|PASS|
|linked_prerequisites_exact|PASS|
|events_12_probabilities48_windows12|PASS|
|event_sources_known_role_filtered|PASS|
|initial_capacities12_support100_pressure0|PASS|
|mutation51_classes_targets_no_inspection_repair|PASS|
|mutation_once_PM01_10|PASS|
|mutation_once_PM01_7|PASS|
|mutation_once_PM01_3|PASS|
|mutation_once_PM01_0|PASS|
|mutation_once_PM02_10|PASS|
|mutation_once_PM02_7|PASS|
|mutation_once_PM02_3|PASS|
|mutation_once_PM02_0|PASS|
|mutation_once_PM03_10|PASS|
|mutation_once_PM03_7|PASS|
|mutation_once_PM03_3|PASS|
|mutation_once_PM03_0|PASS|
|mutation_once_PM04_10|PASS|
|mutation_once_PM04_7|PASS|
|mutation_once_PM04_3|PASS|
|mutation_once_PM04_0|PASS|
|mutation_once_PMX01_10|PASS|
|mutation_once_PMX01_7|PASS|
|mutation_once_PMX01_3|PASS|
|mutation_once_PMX01_0|PASS|
|mutation_once_PM05_10|PASS|
|mutation_once_PM05_7|PASS|
|mutation_once_PM05_3|PASS|
|mutation_once_PM05_0|PASS|
|mutation_once_PM06_10|PASS|
|mutation_once_PM06_7|PASS|
|mutation_once_PM06_3|PASS|
|mutation_once_PM06_0|PASS|
|mutation_once_PMX02_10|PASS|
|mutation_once_PMX02_7|PASS|
|mutation_once_PMX02_3|PASS|
|mutation_once_PMX02_0|PASS|
|mutation_once_PM07_10|PASS|
|mutation_once_PM07_7|PASS|
|mutation_once_PM07_3|PASS|
|mutation_once_PM07_0|PASS|
|mutation_once_PM08_10|PASS|
|mutation_once_PM08_7|PASS|
|mutation_once_PM08_3|PASS|
|mutation_once_PM08_0|PASS|
|mutation_once_PMX03_10|PASS|
|mutation_once_PMX03_7|PASS|
|mutation_once_PMX03_3|PASS|
|mutation_once_PMX03_0|PASS|
|mutation_once_PM09_10|PASS|
|mutation_once_PM09_7|PASS|
|mutation_once_PM09_3|PASS|
|mutation_once_PM09_0|PASS|
|mutation_once_PMX04_10|PASS|
|mutation_once_PMX04_7|PASS|
|mutation_once_PMX04_3|PASS|
|mutation_once_PMX04_0|PASS|
|mutation_once_PM10_10|PASS|
|mutation_once_PM10_7|PASS|
|mutation_once_PM10_3|PASS|
|mutation_once_PM10_0|PASS|
|mutation_once_PM11_10|PASS|
|mutation_once_PM11_7|PASS|
|mutation_once_PM11_3|PASS|
|mutation_once_PM11_0|PASS|
|mutation_once_PMX05_10|PASS|
|mutation_once_PMX05_7|PASS|
|mutation_once_PMX05_3|PASS|
|mutation_once_PMX05_0|PASS|
|mutation_once_PM12_10|PASS|
|mutation_once_PM12_7|PASS|
|mutation_once_PM12_3|PASS|
|mutation_once_PM12_0|PASS|
|mutation_once_ML01_10|PASS|
|mutation_once_ML01_7|PASS|
|mutation_once_ML01_3|PASS|
|mutation_once_ML01_0|PASS|
|mutation_once_ML02_10|PASS|
|mutation_once_ML02_7|PASS|
|mutation_once_ML02_3|PASS|
|mutation_once_ML02_0|PASS|
|mutation_once_ML03_10|PASS|
|mutation_once_ML03_7|PASS|
|mutation_once_ML03_3|PASS|
|mutation_once_ML03_0|PASS|
|mutation_once_ML04_10|PASS|
|mutation_once_ML04_7|PASS|
|mutation_once_ML04_3|PASS|
|mutation_once_ML04_0|PASS|
|mutation_once_MLX01_10|PASS|
|mutation_once_MLX01_7|PASS|
|mutation_once_MLX01_3|PASS|
|mutation_once_MLX01_0|PASS|
|mutation_once_ML05_10|PASS|
|mutation_once_ML05_7|PASS|
|mutation_once_ML05_3|PASS|
|mutation_once_ML05_0|PASS|
|mutation_once_MLX02_10|PASS|
|mutation_once_MLX02_7|PASS|
|mutation_once_MLX02_3|PASS|
|mutation_once_MLX02_0|PASS|
|mutation_once_ML06_10|PASS|
|mutation_once_ML06_7|PASS|
|mutation_once_ML06_3|PASS|
|mutation_once_ML06_0|PASS|
|mutation_once_ML07_10|PASS|
|mutation_once_ML07_7|PASS|
|mutation_once_ML07_3|PASS|
|mutation_once_ML07_0|PASS|
|mutation_once_MLX03_10|PASS|
|mutation_once_MLX03_7|PASS|
|mutation_once_MLX03_3|PASS|
|mutation_once_MLX03_0|PASS|
|mutation_once_ML08_10|PASS|
|mutation_once_ML08_7|PASS|
|mutation_once_ML08_3|PASS|
|mutation_once_ML08_0|PASS|
|mutation_once_ML09_10|PASS|
|mutation_once_ML09_7|PASS|
|mutation_once_ML09_3|PASS|
|mutation_once_ML09_0|PASS|
|mutation_once_MLX04_10|PASS|
|mutation_once_MLX04_7|PASS|
|mutation_once_MLX04_3|PASS|
|mutation_once_MLX04_0|PASS|
|mutation_once_ML10_10|PASS|
|mutation_once_ML10_7|PASS|
|mutation_once_ML10_3|PASS|
|mutation_once_ML10_0|PASS|
|mutation_once_ML11_10|PASS|
|mutation_once_ML11_7|PASS|
|mutation_once_ML11_3|PASS|
|mutation_once_ML11_0|PASS|
|mutation_once_MLX05_10|PASS|
|mutation_once_MLX05_7|PASS|
|mutation_once_MLX05_3|PASS|
|mutation_once_MLX05_0|PASS|
|mutation_once_ML12_10|PASS|
|mutation_once_ML12_7|PASS|
|mutation_once_ML12_3|PASS|
|mutation_once_ML12_0|PASS|
|mutation_once_TO01_10|PASS|
|mutation_once_TO01_7|PASS|
|mutation_once_TO01_3|PASS|
|mutation_once_TO01_0|PASS|
|mutation_once_TO02_10|PASS|
|mutation_once_TO02_7|PASS|
|mutation_once_TO02_3|PASS|
|mutation_once_TO02_0|PASS|
|mutation_once_TO03_10|PASS|
|mutation_once_TO03_7|PASS|
|mutation_once_TO03_3|PASS|
|mutation_once_TO03_0|PASS|
|mutation_once_TO04_10|PASS|
|mutation_once_TO04_7|PASS|
|mutation_once_TO04_3|PASS|
|mutation_once_TO04_0|PASS|
|mutation_once_TOX01_10|PASS|
|mutation_once_TOX01_7|PASS|
|mutation_once_TOX01_3|PASS|
|mutation_once_TOX01_0|PASS|
|mutation_once_TO05_10|PASS|
|mutation_once_TO05_7|PASS|
|mutation_once_TO05_3|PASS|
|mutation_once_TO05_0|PASS|
|mutation_once_TOX02_10|PASS|
|mutation_once_TOX02_7|PASS|
|mutation_once_TOX02_3|PASS|
|mutation_once_TOX02_0|PASS|
|mutation_once_TO06_10|PASS|
|mutation_once_TO06_7|PASS|
|mutation_once_TO06_3|PASS|
|mutation_once_TO06_0|PASS|
|mutation_once_TO07_10|PASS|
|mutation_once_TO07_7|PASS|
|mutation_once_TO07_3|PASS|
|mutation_once_TO07_0|PASS|
|mutation_once_TO08_10|PASS|
|mutation_once_TO08_7|PASS|
|mutation_once_TO08_3|PASS|
|mutation_once_TO08_0|PASS|
|mutation_once_TOX03_10|PASS|
|mutation_once_TOX03_7|PASS|
|mutation_once_TOX03_3|PASS|
|mutation_once_TOX03_0|PASS|
|mutation_once_TO09_10|PASS|
|mutation_once_TO09_7|PASS|
|mutation_once_TO09_3|PASS|
|mutation_once_TO09_0|PASS|
|mutation_once_TO10_10|PASS|
|mutation_once_TO10_7|PASS|
|mutation_once_TO10_3|PASS|
|mutation_once_TO10_0|PASS|
|mutation_once_TOX04_10|PASS|
|mutation_once_TOX04_7|PASS|
|mutation_once_TOX04_3|PASS|
|mutation_once_TOX04_0|PASS|
|mutation_once_TO11_10|PASS|
|mutation_once_TO11_7|PASS|
|mutation_once_TO11_3|PASS|
|mutation_once_TO11_0|PASS|
|mutation_once_TOX05_10|PASS|
|mutation_once_TOX05_7|PASS|
|mutation_once_TOX05_3|PASS|
|mutation_once_TOX05_0|PASS|
|mutation_once_TO12_10|PASS|
|mutation_once_TO12_7|PASS|
|mutation_once_TO12_3|PASS|
|mutation_once_TO12_0|PASS|
|TOX04_half_yard_and_pressure|PASS|
|request_flags_success_only|PASS|
|response_light_impact3|PASS|
|response_light_one_lt60|PASS|
|response_light_three_lt80|PASS|
|response_moderate_impact4|PASS|
|response_moderate_one_lt40|PASS|
|response_moderate_two_lt60|PASS|
|response_light_cascade_impact4|PASS|
|extreme_initial17_no_downgrade|PASS|
|frame_overflow_10_13_17|PASS|
|eventProgress_monotonic_10_13_17|PASS|
|probability_once_schedule_fixed_max3|PASS|
|false_probability_no_trigger_draw|PASS|
|event_tie_break_ID_order|PASS|
|amplification_completed_sources_snapshot_only|PASS|
|amplification_cap2_and_no_duplicate_event|PASS|
|overtopping_impact2_channel40_berth10|PASS|
|all0_E2E_response17_all9fixtures|PASS|
|PORT_TCHW_all10_response17|PASS|
|recheck_10_7_resolve_3_0_persist|PASS|
|new_recheck_not_retroactively_resolved|PASS|
|demand_effect_resolution_threshold20|PASS|
|substitute_keeps_source_effect|PASS|
|resolved_effect_risk_excluded_same_type_max|PASS|
|normalization_10_10|PASS|
|normalization_10_7|PASS|
|normalization_10_3|PASS|
|normalization_10_0|PASS|
|normalization_13_10|PASS|
|normalization_13_7|PASS|
|normalization_13_3|PASS|
|normalization_13_0|PASS|
|normalization_17_10|PASS|
|normalization_17_7|PASS|
|normalization_17_3|PASS|
|normalization_17_0|PASS|
|result_constants_metric_weights|PASS|
|comment_mappings_204_same_role|PASS|
|formal_CORE_IDs_exact|PASS|
|mutation_score_tables_exact|PASS|
|mutation_op_table_exact|PASS|
|mutation_clamp0_100|PASS|
|persistent_effects_not_resolved_by_inspection|PASS|
|support_and_functional_substitute_never_erase_RECHECK|PASS|
|event_OUTDOOR_impact4_expected_deltas|PASS|
|RECHECK_EVENT_no_capacity_delta|PASS|
|FIELD_ACCESS_EVENT_only_fieldAccess|PASS|
|demand_impact1_immediate_resolution_at20|PASS|
|unresolved_implementation_zero|PASS|

## 51Phase一覧

|役割|ID|名称|class|10点位置|successFlag|
|---|---|---|---|---|---|
|PORT_MANAGER|PM01|初動安全|CORE|A|PM01_SUCCESS|
|PORT_MANAGER|PM02|被害把握優先順位|CORE|B|PM02_SUCCESS|
|PORT_MANAGER|PM03|岸壁・係留施設|CORE|C|PM03_SUCCESS|
|PORT_MANAGER|PM04|港口・航路・泊地|CORE|D|PM04_SUCCESS|
|PORT_MANAGER|PMX01|追加被害後の再評価|EXPANSION|A|PM_REASSESS_COMPLETED|
|PORT_MANAGER|PM05|エプロン・港内動線|CORE|B|PM05_SUCCESS|
|PORT_MANAGER|PM06|利用条件・条件付き利用|CORE|C|PM06_SUCCESS|
|PORT_MANAGER|PMX02|利用条件の再設定|EXPANSION|D|PM_USE_CONDITIONS_REVISED|
|PORT_MANAGER|PM07|自港での優先船舶・支援船受入調整|OPTIONAL_BASE|A|PM07_SUCCESS|
|PORT_MANAGER|PM08|岸壁利用競合・バース配分|OPTIONAL_BASE|B|PM08_SUCCESS|
|PORT_MANAGER|PMX03|需要集中時の港湾利用調整|EXPANSION|C|PM_DEMAND_COORDINATION_COMPLETED|
|PORT_MANAGER|PM09|自港と背後交通の接続条件確認|CORE|D|PM09_SUCCESS|
|PORT_MANAGER|PMX04|自港受入能力と背後物流能力の整合調整|EXPANSION|A|PM_LAND_BOTTLENECK_COORDINATED|
|PORT_MANAGER|PM10|自港施設の応急復旧優先順位|OPTIONAL_BASE|B|PM10_SUCCESS|
|PORT_MANAGER|PM11|代替港利用の必要性判断・調整要請|OPTIONAL_BASE|C|PM11_SUCCESS|
|PORT_MANAGER|PMX05|最終再開前の残留リスク再確認|EXPANSION|D|PM_RESIDUAL_RISK_REVIEWED|
|PORT_MANAGER|PM12|自港施設の段階的利用制限緩和|CORE|A|PM12_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML01|広域初動|CORE|B|ML01_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML02|現地調査・技術支援班配置|CORE|C|ML02_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML03|岸壁利用可否判断の技術支援|CORE|D|ML03_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML04|航路・泊地等の状況把握・技術支援|CORE|A|ML04_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|MLX01|追加被害後の再調査配置|EXPANSION|B|ML_SURVEY_REDEPLOYMENT_REVIEWED|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML05|復旧資源の把握・調整|CORE|C|ML05_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|MLX02|復旧資源の広域再配分|EXPANSION|D|ML_NATIONAL_RESOURCES_REALLOCATED|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML06|広域被害拡大への対応|OPTIONAL_BASE|A|ML06_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML07|海上支援ネットワーク調整|OPTIONAL_BASE|B|ML07_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|MLX03|海上支援ネットワーク拡張|EXPANSION|C|ML_MARITIME_NETWORK_EXTENSION_COORDINATED|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML08|代替港候補情報の整理・広域調整|OPTIONAL_BASE|D|ML08_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML09|背後交通情報の広域集約・連携|CORE|A|ML09_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|MLX04|港湾間機能分担案の調整支援|EXPANSION|B|ML_INTERPORT_SHARING_SUPPORTED|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML10|国の支援・復旧資源投入の優先順位|OPTIONAL_BASE|C|ML10_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML11|関係機関調整|CORE|D|ML11_SUCCESS|
|HOKKAIDO_DEVELOPMENT_BUREAU|MLX05|支援縮小前の残課題確認|EXPANSION|A|ML_SUPPORT_RESIDUAL_TASKS_REVIEWED|
|HOKKAIDO_DEVELOPMENT_BUREAU|ML12|国側支援体制の通常化|CORE|B|ML12_SUCCESS|
|TERMINAL_OPERATOR|TO01|作業員安全確保|CORE|C|TO01_SUCCESS|
|TERMINAL_OPERATOR|TO02|人員確認・配置|CORE|D|TO02_SUCCESS|
|TERMINAL_OPERATOR|TO03|荷役設備確認|CORE|A|TO03_SUCCESS|
|TERMINAL_OPERATOR|TO04|ヤード安全確認|CORE|B|TO04_SUCCESS|
|TERMINAL_OPERATOR|TOX01|追加被害後の設備・ヤード再点検|EXPANSION|C|TO_EQUIPMENT_YARD_RECHECKED|
|TERMINAL_OPERATOR|TO05|電力・通信確認|CORE|D|TO05_SUCCESS|
|TERMINAL_OPERATOR|TOX02|非常用電源・燃料継続性|EXPANSION|A|TO_BACKUP_POWER_CONTINUITY_SECURED|
|TERMINAL_OPERATOR|TO06|港湾利用条件の確認と作業条件設定|CORE|B|TO06_SUCCESS|
|TERMINAL_OPERATOR|TO07|共有された優先方針に基づく荷役順序設定|OPTIONAL_BASE|C|TO07_SUCCESS|
|TERMINAL_OPERATOR|TO08|緊急荷役要請への対応|OPTIONAL_BASE|D|TO08_SUCCESS|
|TERMINAL_OPERATOR|TOX03|貨物滞留・処理能力超過対応|EXPANSION|A|TO_CARGO_CONGESTION_ADJUSTED|
|TERMINAL_OPERATOR|TO09|ターミナル運用可能能力の把握|CORE|B|TO09_SUCCESS|
|TERMINAL_OPERATOR|TO10|自社・利用調整可能範囲での代替ヤード確保|OPTIONAL_BASE|C|TO10_SUCCESS|
|TERMINAL_OPERATOR|TOX04|代替ヤードと利用可能な背後輸送経路の接続調整|EXPANSION|D|TO_ALTERNATIVE_LOGISTICS_CONNECTED|
|TERMINAL_OPERATOR|TO11|ターミナル荷役の限定再開|OPTIONAL_BASE|A|TO11_SUCCESS|
|TERMINAL_OPERATOR|TOX05|通常復帰前の再確認|EXPANSION|B|TO_NORMALIZATION_CONDITIONS_REVIEWED|
|TERMINAL_OPERATOR|TO12|ターミナルの通常荷役体制への移行|CORE|C|TO12_SUCCESS|

## 204選択肢本文・タグ（変更なし）

|Phase|choice.id|score|textCore|actionTag|
|---|---|---:|---|---|
|PM01|PM01_C10|10|職員の安全と退避経路を確認し、危険区域への立入りを止め、安全を確保できる範囲で自港の初動対応を開始する。|PM01_INITIAL_SAFETY_OPTIMAL|
|PM01|PM01_C07|7|職員の安否と危険区域を確認して初動対応を開始するが、連絡途絶時の退避手順の共有は後にする。|PM01_INITIAL_SAFETY_ACCEPTABLE|
|PM01|PM01_C03|3|職員の安否確認だけを先行し、危険区域の設定が不十分なまま自港の現地対応を進める。|PM01_INITIAL_SAFETY_WEAK|
|PM01|PM01_C00|0|危険情報と退避条件を確認せず、自港の被害確認のため職員を危険区域へ向かわせる。|PM01_INITIAL_SAFETY_CRITICAL|
|PM02|PM02_C10|10|人命への危険、支援輸送上の重要性、情報の不足を比較し、自港施設の確認順序と再確認条件を定める。|PM02_DAMAGE_SURVEY_PRIORITY_OPTIMAL|
|PM02|PM02_C07|7|重要施設から確認し、危険がある箇所を除外するが、情報不足箇所の再確認時期は定めない。|PM02_DAMAGE_SURVEY_PRIORITY_ACCEPTABLE|
|PM02|PM02_C03|3|目に見える被害の多い箇所を中心に確認し、自港の機能上重要な未確認箇所の優先度を下げる。|PM02_DAMAGE_SURVEY_PRIORITY_WEAK|
|PM02|PM02_C00|0|自港施設の確認済み・未確認を区別せず、確認しやすい施設の情報だけで被害把握を終える。|PM02_DAMAGE_SURVEY_PRIORITY_CRITICAL|
|PM03|PM03_C10|10|岸壁・係留施設の被害と未確認事項を整理し、必要な技術支援を要請して、自港の利用可否と荷重・接岸等の条件を設定する。|PM03_BERTH_USE_CONDITIONS_OPTIMAL|
|PM03|PM03_C07|7|確認できた被害に基づき自港岸壁を制限付きとするが、未確認部分の追加調査の期限は定めない。|PM03_BERTH_USE_CONDITIONS_ACCEPTABLE|
|PM03|PM03_C03|3|外観情報だけで自港岸壁の利用範囲を広く設定し、係留施設の確認を後回しにする。|PM03_BERTH_USE_CONDITIONS_WEAK|
|PM03|PM03_C00|0|重大な変状情報を把握している自港岸壁でも、条件を付けず従前どおりの利用を認める。|PM03_BERTH_USE_CONDITIONS_CRITICAL|
|PM04|PM04_C10|10|水深・障害物等の情報と情報の確度を確認し、関係機関に確認・調整した上で、自港管理施設の利用範囲と条件を設定する。|PM04_WATER_AREA_USE_CONDITIONS_OPTIMAL|
|PM04|PM04_C07|7|把握できた危険箇所について自港管理施設の利用を制限するが、未確認水域の追加確認計画は後にする。|PM04_WATER_AREA_USE_CONDITIONS_ACCEPTABLE|
|PM04|PM04_C03|3|古い水深情報を主な根拠に自港管理施設の利用条件を設定し、新たな障害物情報の確認を遅らせる。|PM04_WATER_AREA_USE_CONDITIONS_WEAK|
|PM04|PM04_C00|0|自港水域施設に重大な障害の疑いがあるまま、施設側の利用条件に反映せず受入れを続ける。|PM04_WATER_AREA_USE_CONDITIONS_CRITICAL|
|PMX01|PMX01_C10|10|発生済みの追加被害と既存の確認結果を照合し、影響する自港施設の利用を見直して再確認と条件更新を行う。|PM_REASSESS_AFFECTED_FACILITIES_AND_UPDATE_USE|
|PMX01|PMX01_C07|7|追加被害が報告された自港施設の利用を一旦制限するが、関連施設の再確認範囲は後で整理する。|PM_RESTRICT_REPORTED_SITE_DEFER_ADJACENT_REVIEW|
|PMX01|PMX01_C03|3|追加被害が報告された箇所だけを確認し、同じ条件で影響を受けた自港施設の利用条件を据え置く。|PM_CHECK_REPORTED_SITE_KEEP_RELATED_CONDITIONS|
|PMX01|PMX01_C00|0|追加被害の情報を得ても、以前の確認結果だけを根拠に自港施設の利用を継続する。|PM_CONTINUE_USE_WITHOUT_POST_DAMAGE_REASSESSMENT|
|PM05|PM05_C10|10|エプロンの段差・陥没や動線の支障を確認し、自港の管理範囲で通行・荷重・区域の条件を設定して関係者へ共有する。|PM05_APRON_ROUTE_CONDITIONS_OPTIMAL|
|PM05|PM05_C07|7|明確な危険区域を区切り自港の安全な動線を共有するが、荷重条件の細分化は後にする。|PM05_APRON_ROUTE_CONDITIONS_ACCEPTABLE|
|PM05|PM05_C03|3|主要動線だけを確認し、エプロンの未確認部分を含む自港の利用範囲を設定する。|PM05_APRON_ROUTE_CONDITIONS_WEAK|
|PM05|PM05_C00|0|陥没等の危険が報告された自港エプロンを区分せず、従来の動線と荷重で利用を認める。|PM05_APRON_ROUTE_CONDITIONS_CRITICAL|
|PM06|PM06_C10|10|確認結果と残る不確実性を区別し、自港施設ごとの利用範囲、荷重、時間、監視、中止条件を明示して共有する。|PM06_CONDITIONAL_FACILITY_USE_OPTIMAL|
|PM06|PM06_C07|7|自港施設の利用範囲と主要な制約を明示するが、条件の再確認時期は十分に定めない。|PM06_CONDITIONAL_FACILITY_USE_ACCEPTABLE|
|PM06|PM06_C03|3|自港施設の利用を条件付きと伝えるだけで、荷重や中止条件を曖昧にする。|PM06_CONDITIONAL_FACILITY_USE_WEAK|
|PM06|PM06_C00|0|未確認の重大な危険を残した自港施設を、制約の説明なしに利用可能として扱う。|PM06_CONDITIONAL_FACILITY_USE_CRITICAL|
|PMX02|PMX02_C10|10|最新の被害・需要・運用情報を照合し、自港の利用条件と中止条件を更新して、変更内容を関係者に確認する。|PM_REVISE_USE_AND_STOP_CONDITIONS_WITH_CONFIRMATION|
|PMX02|PMX02_C07|7|明らかに変化した自港の利用条件を更新して共有するが、影響する全施設の整合確認は後にする。|PM_UPDATE_KNOWN_CHANGES_DEFER_CROSS_FACILITY_CHECK|
|PMX02|PMX02_C03|3|自港の条件変更を口頭で伝えるだけとし、旧条件が残る資料や連絡先の確認を行わない。|PM_NOTIFY_CONDITIONS_VERBALLY_LEAVE_OLD_DOCUMENTS|
|PMX02|PMX02_C00|0|現状に適合しないと分かっている自港の利用条件を更新せず、受入れを継続する。|PM_KEEP_OUTDATED_USE_CONDITIONS|
|PM07|PM07_C10|10|共有された支援需要と自港施設の利用条件を照合し、安全に受け入れられる船舶、時間帯、受入量を調整して不足分の支援を要請する。|PM07_SUPPORT_VESSEL_ACCEPTANCE_OPTIMAL|
|PM07|PM07_C07|7|自港の安全な受入範囲を確認して支援船の受入時間を調整するが、需要変化時の再調整条件は定めない。|PM07_SUPPORT_VESSEL_ACCEPTANCE_ACCEPTABLE|
|PM07|PM07_C03|3|自港岸壁の空き状況を中心に受入れを調整し、荷役側の受入能力の確認を後回しにする。|PM07_SUPPORT_VESSEL_ACCEPTANCE_WEAK|
|PM07|PM07_C00|0|自港施設の利用条件と処理可能量を確認せず、要請された船舶をすべて受け入れる。|PM07_SUPPORT_VESSEL_ACCEPTANCE_CRITICAL|
|PM08|PM08_C10|10|自港岸壁の利用条件、船舶条件、共有された優先方針、処理能力を照合し、配分と見直し条件を関係者と調整する。|PM08_OWN_PORT_BERTH_ALLOCATION_OPTIMAL|
|PM08|PM08_C07|7|自港岸壁の安全条件と優先方針に沿って配分するが、遅延時の再配分手順は後にする。|PM08_OWN_PORT_BERTH_ALLOCATION_ACCEPTABLE|
|PM08|PM08_C03|3|自港岸壁を到着順で配分し、船型や荷役能力による適合性の確認を限定する。|PM08_OWN_PORT_BERTH_ALLOCATION_WEAK|
|PM08|PM08_C00|0|自港岸壁の安全条件や重複利用を確認せず、競合する利用申込みを同時に受け付ける。|PM08_OWN_PORT_BERTH_ALLOCATION_CRITICAL|
|PMX03|PMX03_C10|10|集中する需要と自港の有効能力を照合し、既存の岸壁配分を踏まえて時間枠・受入量を再調整し、収まらない需要は広域調整を要請する。|PM_REBALANCE_OWN_PORT_SLOTS_AND_REQUEST_WIDE_AREA_COORDINATION|
|PMX03|PMX03_C07|7|自港の受入上限を設けて利用枠を再調整するが、需要がさらに増えた場合の見直し条件は定めない。|PM_CAP_ACCEPTANCE_WITHOUT_FURTHER_DEMAND_REVIEW_TRIGGER|
|PMX03|PMX03_C03|3|自港の受入枠を小幅に変更するだけで、需要と荷役・背後接続能力の差を十分に確認しない。|PM_ADJUST_SLOTS_WITHOUT_CHECKING_LOGISTICS_GAP|
|PMX03|PMX03_C00|0|需要集中を把握しても自港の受入量を制限せず、処理能力を超えた利用予約を積み増す。|PM_ADD_RESERVATIONS_BEYOND_PROCESSING_CAPACITY|
|PM09|PM09_C10|10|道路等の管理主体から通行条件と更新時刻を確認し、自港側の搬出入条件と受入量に反映して関係者へ共有する。|PM09_HINTERLAND_CONNECTION_CHECK_OPTIMAL|
|PM09|PM09_C07|7|確認できた通行条件を自港側の受入れに反映するが、情報更新時の連絡手順は十分に定めない。|PM09_HINTERLAND_CONNECTION_CHECK_ACCEPTABLE|
|PM09|PM09_C03|3|自港内の動線だけで搬出入を判断し、背後交通の最新条件の確認を後回しにする。|PM09_HINTERLAND_CONNECTION_CHECK_WEAK|
|PM09|PM09_C00|0|背後交通の途絶情報を得ても、自港の滞留余力を確認せず従前の受入量を続ける。|PM09_HINTERLAND_CONNECTION_CHECK_CRITICAL|
|PMX04|PMX04_C10|10|自港の受入・保管余力と確認済みの背後搬出能力を比較し、自港の受入量・時間枠を調整して不足する接続調整を要請する。|PM_ALIGN_ACCEPTANCE_WITH_STORAGE_AND_OUTFLOW|
|PMX04|PMX04_C07|7|自港の受入量を確認済み搬出能力に合わせて抑えるが、滞留量の再確認間隔は定めない。|PM_LIMIT_ACCEPTANCE_WITHOUT_STORAGE_REVIEW_INTERVAL|
|PMX04|PMX04_C03|3|自港の受入量を過去の実績で設定し、現在の滞留量と背後搬出能力の差を十分に見ない。|PM_SET_ACCEPTANCE_FROM_HISTORICAL_VOLUME|
|PMX04|PMX04_C00|0|背後搬出が制約されていても、自港の保管余力を超える受入れを継続する。|PM_CONTINUE_ACCEPTANCE_BEYOND_STORAGE_MARGIN|
|PM10|PM10_C10|10|自港施設の安全上の緊急性、機能上の効果、接続条件、実施可能性を比較して応急復旧順位を定め、必要な支援を要請する。|PM10_OWN_FACILITY_RECOVERY_PRIORITY_OPTIMAL|
|PM10|PM10_C07|7|自港の安全確保と重要機能を優先して復旧順位を定めるが、接続施設との工程整合は後にする。|PM10_OWN_FACILITY_RECOVERY_PRIORITY_ACCEPTABLE|
|PM10|PM10_C03|3|自港施設の被害の目立ちやすさだけで復旧順位を設定し、機能回復への効果を十分に比較しない。|PM10_OWN_FACILITY_RECOVERY_PRIORITY_WEAK|
|PM10|PM10_C00|0|自港の重大な危険箇所を把握していても復旧対象から外し、利用継続を前提に復旧順位を定める。|PM10_OWN_FACILITY_RECOVERY_PRIORITY_CRITICAL|
|PM11|PM11_C10|10|自港の不足機能、必要量、期間を整理し、代替港候補の情報確認と広域調整を要請して、自港側の受入計画を調整する。|PM11_ALTERNATIVE_PORT_COORDINATION_REQUEST_OPTIMAL|
|PM11|PM11_C07|7|自港の能力不足を示して代替港候補の情報提供を要請するが、必要量や期間の整理は十分でない。|PM11_ALTERNATIVE_PORT_COORDINATION_REQUEST_ACCEPTABLE|
|PM11|PM11_C03|3|自港の能力不足を認識しても、具体的な不足量を整理せず一般的な情報照会だけで済ませる。|PM11_ALTERNATIVE_PORT_COORDINATION_REQUEST_WEAK|
|PM11|PM11_C00|0|自港だけで需要を処理できないと把握しても調整要請を行わず、実現できない自港の受入計画を維持する。|PM11_ALTERNATIVE_PORT_COORDINATION_REQUEST_CRITICAL|
|PMX05|PMX05_C10|10|自港の最新確認結果、継続中の危険、需要、接続条件を再照合し、緩和できる範囲と維持すべき制限を整理する。|PM_RECHECK_RESIDUAL_RISK_AND_RETAIN_NEEDED_RESTRICTIONS|
|PMX05|PMX05_C07|7|自港の主要な危険と利用条件を再確認するが、変化時の再制限手順の共有は十分でない。|PM_RECHECK_MAIN_RISKS_WITHOUT_RESTRICTION_REINSTATEMENT_PROTOCOL|
|PMX05|PMX05_C03|3|自港の主要施設の情報だけを再確認し、付帯施設や背後接続の未解決事項を十分に確認しない。|PM_REVIEW_MAIN_FACILITIES_OMIT_AUXILIARY_CONNECTIONS|
|PMX05|PMX05_C00|0|自港の重大な未解決リスクを認識していても、再確認せず利用制限の緩和準備を進める。|PM_PREPARE_EASING_WITHOUT_RECHECKING_KNOWN_RISKS|
|PM12|PM12_C10|10|確認済みの安全と有効能力の範囲で自港施設の制限を段階的に緩和し、監視・再制限条件と未解決事項を共有する。|PM12_OWN_FACILITY_RESTRICTION_EASING_OPTIMAL|
|PM12|PM12_C07|7|自港の確認済み施設から制限を段階的に緩和するが、再制限時の連絡手順は十分に定めない。|PM12_OWN_FACILITY_RESTRICTION_EASING_ACCEPTABLE|
|PM12|PM12_C03|3|自港の一部で利用実績ができたことを主な根拠に、未確認範囲まで制限緩和を広げる。|PM12_OWN_FACILITY_RESTRICTION_EASING_WEAK|
|PM12|PM12_C00|0|重大な危険や能力不足が残る自港施設について、監視や再制限条件を設けず制限を一括で緩和する。|PM12_OWN_FACILITY_RESTRICTION_EASING_CRITICAL|
|ML01|ML01_C10|10|国側の安全と連絡体制を確保し、広域被害と支援要請を集約して、緊急性に応じた支援の初動方針を共有する。|ML01_WIDE_AREA_INITIAL_SUPPORT_OPTIMAL|
|ML01|ML01_C07|7|国側の安全確認と被害集約を始めるが、連絡途絶時の代替手段の共有は後にする。|ML01_WIDE_AREA_INITIAL_SUPPORT_ACCEPTABLE|
|ML01|ML01_C03|3|連絡の取れた港の情報を中心に支援準備を進め、情報空白地域の確認を後回しにする。|ML01_WIDE_AREA_INITIAL_SUPPORT_WEAK|
|ML01|ML01_C00|0|広域被害や国側要員の安全を確認せず、支援班を現地へ出発させる。|ML01_WIDE_AREA_INITIAL_SUPPORT_CRITICAL|
|ML02|ML02_C10|10|調査の緊急性、情報不足、進入条件、班の専門性を比較し、安全な調査計画と報告先を定めて国側支援班を配置する。|ML02_SURVEY_TEAM_DEPLOYMENT_OPTIMAL|
|ML02|ML02_C07|7|安全に進入できる重要箇所へ国側支援班を配置するが、未調査箇所の再配置計画は後にする。|ML02_SURVEY_TEAM_DEPLOYMENT_ACCEPTABLE|
|ML02|ML02_C03|3|移動の容易な箇所を中心に国側支援班を配置し、重要な情報空白の解消を遅らせる。|ML02_SURVEY_TEAM_DEPLOYMENT_WEAK|
|ML02|ML02_C00|0|現地の危険と進入条件を確認せず、国側支援班へ調査の続行を求める。|ML02_SURVEY_TEAM_DEPLOYMENT_CRITICAL|
|ML03|ML03_C10|10|変状、調査条件、根拠の限界を整理し、港湾管理者の利用判断に必要な技術情報と追加確認事項を提供する。|ML03_BERTH_TECHNICAL_SUPPORT_OPTIMAL|
|ML03|ML03_C07|7|確認できた岸壁の技術情報を港湾管理者へ提供するが、未確認事項の追加調査計画は十分でない。|ML03_BERTH_TECHNICAL_SUPPORT_ACCEPTABLE|
|ML03|ML03_C03|3|外観調査の結果だけを提供し、係留施設や荷重条件に関する情報の不足を十分に伝えない。|ML03_BERTH_TECHNICAL_SUPPORT_WEAK|
|ML03|ML03_C00|0|重大な変状や調査上の限界を把握していても、その情報を港湾管理者へ伝えず支援報告を終える。|ML03_BERTH_TECHNICAL_SUPPORT_CRITICAL|
|ML04|ML04_C10|10|障害物・水深等の情報と確認範囲を整理し、関係機関と調査支援を調整して、港湾管理者へ技術情報と不確実性を提供する。|ML04_WATER_AREA_TECHNICAL_SUPPORT_OPTIMAL|
|ML04|ML04_C07|7|把握済みの水域被害情報を港湾管理者へ提供するが、未確認水域の追加調査調整は後にする。|ML04_WATER_AREA_TECHNICAL_SUPPORT_ACCEPTABLE|
|ML04|ML04_C03|3|既存資料を中心に水域の技術情報を提供し、被災後の情報不足を十分に説明しない。|ML04_WATER_AREA_TECHNICAL_SUPPORT_WEAK|
|ML04|ML04_C00|0|重大な障害物の疑いを把握していても、追加確認も情報提供も行わず水域の調査支援を終える。|ML04_WATER_AREA_TECHNICAL_SUPPORT_CRITICAL|
|MLX01|MLX01_C10|10|追加被害と調査済み範囲を照合し、班の安全と専門性を確認して、国側の再調査範囲・優先順位・配置を更新する。|ML_REDEPLOY_SURVEY_TEAMS_AFTER_UPDATED_DAMAGE_REVIEW|
|MLX01|MLX01_C07|7|追加被害が報告された箇所へ安全を確認して国側班を再配置するが、関連区域の調査計画は後にする。|ML_REDEPLOY_TO_REPORTED_SITE_DEFER_RELATED_AREAS|
|MLX01|MLX01_C03|3|当初の国側班配置を優先し、追加被害箇所の確認を既定調査の終了後に回す。|ML_DEFER_ADDITIONAL_DAMAGE_SURVEY_UNTIL_ORIGINAL_WORK_ENDS|
|MLX01|MLX01_C00|0|追加被害による危険を確認せず、国側班へ当初の調査経路と作業の続行を求める。|ML_CONTINUE_ORIGINAL_SURVEY_ROUTE_WITHOUT_HAZARD_CHECK|
|ML05|ML05_C10|10|国側の人員・機材・船舶等の所在、稼働条件、移動時間、支援要請を照合し、投入可能な資源と不足を共有して調整する。|ML05_NATIONAL_RESOURCE_COORDINATION_OPTIMAL|
|ML05|ML05_C07|7|国側の主要資源と要請を照合して調整するが、燃料や交代要員等の継続条件の確認は十分でない。|ML05_NATIONAL_RESOURCE_COORDINATION_ACCEPTABLE|
|ML05|ML05_C03|3|国側資源の保有数だけで支援可能量を見積もり、稼働条件と移動時間の確認を遅らせる。|ML05_NATIONAL_RESOURCE_COORDINATION_WEAK|
|ML05|ML05_C00|0|国側資源の利用可能性を確認せず重複する支援予定を組み、実際の不足を共有しない。|ML05_NATIONAL_RESOURCE_COORDINATION_CRITICAL|
|MLX02|MLX02_C10|10|更新された被害・要請・投入効果と移動条件を比較し、国側復旧資源の配分を見直して、関係先に変更と支援空白を共有する。|ML_REALLOCATE_NATIONAL_RESOURCES_AND_SHARE_SUPPORT_GAPS|
|MLX02|MLX02_C07|7|緊急性の高い要請に合わせて国側資源を再配分するが、移動後の交代・補給計画は十分でない。|ML_REALLOCATE_TO_URGENT_REQUESTS_WITHOUT_SUPPLY_CONTINUITY_PLAN|
|MLX02|MLX02_C03|3|当初の国側資源配分を小幅に変えるだけとし、支援空白地域への効果を十分に比較しない。|ML_TWEAK_ORIGINAL_ALLOCATION_WITHOUT_COMPARING_GAPS|
|MLX02|MLX02_C00|0|緊急の支援空白を把握していても国側資源配分を再検討せず、実施不能な投入予定を維持する。|ML_KEEP_INFEASIBLE_RESOURCE_PLAN_DESPITE_URGENT_GAPS|
|ML06|ML06_C10|10|広域被害の拡大、情報空白、支援余力を再整理し、関係機関と連携して国側支援の優先順位と追加要請を更新する。|ML06_WIDE_AREA_DAMAGE_SUPPORT_OPTIMAL|
|ML06|ML06_C07|7|被害拡大が確認された地域の国側支援を増やすが、既存地域への支援継続の確認は十分でない。|ML06_WIDE_AREA_DAMAGE_SUPPORT_ACCEPTABLE|
|ML06|ML06_C03|3|被害件数の多さだけで国側支援を見直し、緊急性と代替機能の有無を十分に比較しない。|ML06_WIDE_AREA_DAMAGE_SUPPORT_WEAK|
|ML06|ML06_C00|0|被害拡大と支援不足を認識しても広域情報を更新せず、国側の当初支援計画を維持する。|ML06_WIDE_AREA_DAMAGE_SUPPORT_CRITICAL|
|ML07|ML07_C10|10|支援需要、船舶情報、港湾管理者から共有された受入条件、荷役・背後接続情報を照合し、関係機関と海上支援輸送を調整する。|ML07_MARITIME_SUPPORT_COORDINATION_OPTIMAL|
|ML07|ML07_C07|7|支援船舶と確認済み受入条件を照合して連絡調整するが、遅延時の代替連絡手順は十分でない。|ML07_MARITIME_SUPPORT_COORDINATION_ACCEPTABLE|
|ML07|ML07_C03|3|支援船舶の情報だけで調整案を作り、受入側の荷役・背後接続条件の確認を後回しにする。|ML07_MARITIME_SUPPORT_COORDINATION_WEAK|
|ML07|ML07_C00|0|受入側の条件が未確認であることを伝えず、成立が確認できていない海上支援の接続案を確定情報として共有する。|ML07_MARITIME_SUPPORT_COORDINATION_CRITICAL|
|MLX03|MLX03_C10|10|既存の海上支援調整と不足需要を確認し、追加候補の受入条件・船舶・接続能力を照合して、関係機関と拡張案を調整する。|ML_COORDINATE_ADDITIONAL_MARITIME_SUPPORT_CONNECTIONS|
|MLX03|MLX03_C07|7|不足需要に対する追加候補を確認して調整するが、運航遅延時の代替案の検討は十分でない。|ML_ADD_SUPPORT_CANDIDATES_WITHOUT_DELAY_CONTINGENCY|
|MLX03|MLX03_C03|3|候補数を増やすことを優先し、既存支援との資源重複や受入条件の確認を限定する。|ML_EXPAND_CANDIDATE_LIST_WITHOUT_RESOURCE_OVERLAP_CHECK|
|MLX03|MLX03_C00|0|既存支援と追加候補の成立条件を確認せず、支援不足が解消したと関係先へ情報提供する。|ML_REPORT_SUPPORT_GAP_RESOLVED_WITHOUT_CONNECTION_VERIFICATION|
|ML08|ML08_C10|10|各港から確認した利用条件、余力、貨物・船舶条件、背後接続を比較し、候補情報と未確認事項を整理して関係者の調整を支援する。|ML08_ALTERNATIVE_PORT_INFORMATION_OPTIMAL|
|ML08|ML08_C07|7|各港の確認済み余力と利用条件を比較して候補情報を共有するが、需要増加時の余力変化の確認は十分でない。|ML08_ALTERNATIVE_PORT_INFORMATION_ACCEPTABLE|
|ML08|ML08_C03|3|距離と公称能力を中心に候補情報を示し、現在の利用条件と背後接続の確認を後回しにする。|ML08_ALTERNATIVE_PORT_INFORMATION_WEAK|
|ML08|ML08_C00|0|候補港の現在の条件が未確認であることを伏せ、十分な代替能力があるとの情報を共有する。|ML08_ALTERNATIVE_PORT_INFORMATION_CRITICAL|
|ML09|ML09_C10|10|道路等の管理主体から通行条件・更新時刻・不確実性を集約し、港湾の接続情報と照合して関係者へ共有する。|ML09_WIDE_AREA_TRANSPORT_INFORMATION_OPTIMAL|
|ML09|ML09_C07|7|主要な背後交通情報を確認して共有するが、更新連絡の頻度と担当の整理は十分でない。|ML09_WIDE_AREA_TRANSPORT_INFORMATION_ACCEPTABLE|
|ML09|ML09_C03|3|過去の交通情報を中心に共有し、現在の通行条件との差を十分に確認しない。|ML09_WIDE_AREA_TRANSPORT_INFORMATION_WEAK|
|ML09|ML09_C00|0|主要経路の途絶情報を得ても関係者へ共有せず、古い交通情報の提供を続ける。|ML09_WIDE_AREA_TRANSPORT_INFORMATION_CRITICAL|
|MLX04|MLX04_C10|10|代替港候補情報と広域交通情報を照合し、各港の確認済み条件と意向を踏まえた機能分担案を示して関係者の合意形成を支援する。|ML_SUPPORT_INTERPORT_CONSENSUS_WITH_CONFIRMED_CONDITIONS|
|MLX04|MLX04_C07|7|各港の確認済み条件に沿う分担案の調整を支援するが、需要変動時の見直し条件は十分でない。|ML_SUPPORT_FUNCTION_SHARING_WITHOUT_DEMAND_REVIEW_TRIGGER|
|MLX04|MLX04_C03|3|港ごとの公称能力を中心に分担案を提示し、最新の交通接続と実効余力の確認を限定する。|ML_PROPOSE_FUNCTION_SHARING_FROM_NOMINAL_CAPACITY|
|MLX04|MLX04_C00|0|各港の条件と意向が未確認の案を合意済みの分担情報として共有し、調整上の不確実性を伝えない。|ML_REPORT_UNCONFIRMED_SHARING_PLAN_AS_AGREED|
|ML10|ML10_C10|10|人命・支援輸送の緊急性、支援効果、代替性、実施条件を比較して国側資源の投入順位を定め、再評価条件を共有する。|ML10_NATIONAL_RESOURCE_PRIORITY_OPTIMAL|
|ML10|ML10_C07|7|緊急性と支援効果を踏まえて国側資源の投入順位を定めるが、再評価時期は十分に定めない。|ML10_NATIONAL_RESOURCE_PRIORITY_ACCEPTABLE|
|ML10|ML10_C03|3|要請の到着順を主な基準に国側資源を投入し、広域の緊急性と代替性の比較を限定する。|ML10_NATIONAL_RESOURCE_PRIORITY_WEAK|
|ML10|ML10_C00|0|重大な支援空白を把握しても国側資源の投入順位に反映せず、成立しない支援工程を維持する。|ML10_NATIONAL_RESOURCE_PRIORITY_CRITICAL|
|ML11|ML11_C10|10|関係機関の担当、要請、対応期限、未解決事項を整理し、国側支援の役割分担と情報更新の方法を確認・共有する。|ML11_INTERAGENCY_SUPPORT_COORDINATION_OPTIMAL|
|ML11|ML11_C07|7|主要な関係機関と国側支援の役割を確認するが、未解決事項の期限管理は十分でない。|ML11_INTERAGENCY_SUPPORT_COORDINATION_ACCEPTABLE|
|ML11|ML11_C03|3|一斉の情報提供だけで調整を済ませ、重要な要請の受領確認と回答期限の確認を行わない。|ML11_INTERAGENCY_SUPPORT_COORDINATION_WEAK|
|ML11|ML11_C00|0|重大な未調整事項を把握しても連絡を止め、国側の支援体制が整ったとの情報を共有する。|ML11_INTERAGENCY_SUPPORT_COORDINATION_CRITICAL|
|MLX05|MLX05_C10|10|国側支援の未完了事項、継続要請、代替体制、再支援条件を確認し、関係先と縮小範囲・引継ぎを調整する。|ML_VERIFY_REMAINING_REQUESTS_HANDOVER_AND_REACTIVATION|
|MLX05|MLX05_C07|7|主要な継続要請を確認し国側支援の引継ぎを調整するが、再支援の連絡条件は十分でない。|ML_ARRANGE_SUPPORT_HANDOVER_WITHOUT_REACTIVATION_CONTACTS|
|MLX05|MLX05_C03|3|国側の活動件数が減ったことを中心に縮小準備を進め、情報空白地域の残課題確認を限定する。|ML_PLAN_SUPPORT_REDUCTION_FROM_ACTIVITY_COUNTS|
|MLX05|MLX05_C00|0|重大な継続要請が残ると把握しても引継ぎを確認せず、国側支援の終了準備を進める。|ML_PREPARE_SUPPORT_END_WITHOUT_CRITICAL_REQUEST_HANDOVER|
|ML12|ML12_C10|10|残課題と引継ぎ先、情報更新、再支援条件を確認し、必要な国側支援を残しながら段階的に通常体制へ移行する。|ML12_NATIONAL_SUPPORT_NORMALIZATION_OPTIMAL|
|ML12|ML12_C07|7|継続する国側支援の担当を定めて通常体制へ移行するが、再支援時の手順共有は十分でない。|ML12_NATIONAL_SUPPORT_NORMALIZATION_ACCEPTABLE|
|ML12|ML12_C03|3|国側支援の規模縮小を先行し、残課題の担当と情報更新方法の確認を後にする。|ML12_NATIONAL_SUPPORT_NORMALIZATION_WEAK|
|ML12|ML12_C00|0|重大な未完了支援の引継ぎ先を確保せず、国側の非常時支援体制を一括で終了する。|ML12_NATIONAL_SUPPORT_NORMALIZATION_CRITICAL|
|TO01|TO01_C10|10|作業員の安否と退避経路を確認し、危険区域での自社作業を止め、安全な連絡・待機と再開判断の条件を共有する。|TO01_WORKER_SAFETY_OPTIMAL|
|TO01|TO01_C07|7|作業員を安全な場所へ退避させ安否を確認するが、連絡途絶時の手順の共有は後にする。|TO01_WORKER_SAFETY_ACCEPTABLE|
|TO01|TO01_C03|3|作業員の安否確認だけを行い、危険区域と退避条件の共有を不十分なまま自社作業の準備を進める。|TO01_WORKER_SAFETY_WEAK|
|TO01|TO01_C00|0|危険情報や退避条件を確認せず、自社作業員に現場での荷役継続を求める。|TO01_WORKER_SAFETY_CRITICAL|
|TO02|TO02_C10|10|安否、資格、勤務可能時間、疲労、必要技能を確認し、安全に実施できる自社の作業量と交代配置を設定する。|TO02_WORKFORCE_ALLOCATION_OPTIMAL|
|TO02|TO02_C07|7|資格と勤務可能人数を確認して自社配置を設定するが、長時間化した際の交代計画は十分でない。|TO02_WORKFORCE_ALLOCATION_ACCEPTABLE|
|TO02|TO02_C03|3|出勤人数だけで自社の配置を決め、必要資格や疲労の確認を後回しにする。|TO02_WORKFORCE_ALLOCATION_WEAK|
|TO02|TO02_C00|0|不足する資格や著しい疲労を把握していても、自社作業員を必要な条件が整わない作業に配置する。|TO02_WORKFORCE_ALLOCATION_CRITICAL|
|TO03|TO03_C10|10|自社荷役設備の損傷、点検履歴、使用条件を確認し、異常設備を停止して確認済み設備での作業範囲を設定する。|TO03_HANDLING_EQUIPMENT_CHECK_OPTIMAL|
|TO03|TO03_C07|7|主要な自社設備の安全を確認して使用範囲を定めるが、予備設備の確認計画は後にする。|TO03_HANDLING_EQUIPMENT_CHECK_ACCEPTABLE|
|TO03|TO03_C03|3|自社設備の外観だけを確認し、制動・安全装置等の確認が不十分なまま使用準備を進める。|TO03_HANDLING_EQUIPMENT_CHECK_WEAK|
|TO03|TO03_C00|0|重大な異常が報告された自社荷役設備を停止せず、そのまま作業に使用する。|TO03_HANDLING_EQUIPMENT_CHECK_CRITICAL|
|TO04|TO04_C10|10|自社・調整済みヤードの地盤、貨物、通路の危険を確認し、危険区域を区切って安全な保管・走行条件を設定する。|TO04_OWN_YARD_SAFETY_CHECK_OPTIMAL|
|TO04|TO04_C07|7|明確な危険区域を区切り安全な自社動線を定めるが、保管荷重や長時間利用の条件確認は十分でない。|TO04_OWN_YARD_SAFETY_CHECK_ACCEPTABLE|
|TO04|TO04_C03|3|自社の主要通路だけを確認し、未確認の保管区域も含めてヤード運用を準備する。|TO04_OWN_YARD_SAFETY_CHECK_WEAK|
|TO04|TO04_C00|0|貨物倒壊や陥没の危険が分かっている自社ヤードで、区域を分けず通常どおり作業を行う。|TO04_OWN_YARD_SAFETY_CHECK_CRITICAL|
|TOX01|TOX01_C10|10|発生済みの追加被害が自社設備・調整済みヤードへ及ぼす影響を確認し、作業を必要な範囲で止めて再点検と作業条件更新を行う。|TO_RECHECK_AFFECTED_EQUIPMENT_YARD_AND_UPDATE_WORK|
|TOX01|TOX01_C07|7|追加被害のあった自社区域を停止して再点検するが、関連する設備・通路の確認範囲は後に整理する。|TO_STOP_REPORTED_AREA_DEFER_RELATED_ASSET_REVIEW|
|TOX01|TOX01_C03|3|追加被害が見える箇所だけを再点検し、影響が疑われる自社設備の作業条件を据え置く。|TO_RECHECK_VISIBLE_DAMAGE_KEEP_RELATED_WORK_CONDITIONS|
|TOX01|TOX01_C00|0|追加被害の情報を得ても再点検せず、以前の確認結果だけで自社荷役を続ける。|TO_CONTINUE_HANDLING_WITHOUT_POST_DAMAGE_RECHECK|
|TO05|TO05_C10|10|自社の電源・通信の稼働状況と安全な切替条件を確認し、利用可能な機能で実施できる作業範囲と連絡手段を定める。|TO05_POWER_COMMUNICATION_CHECK_OPTIMAL|
|TO05|TO05_C07|7|主要な自社電源・通信と代替連絡手段を確認するが、停止長期化時の運用条件は十分でない。|TO05_POWER_COMMUNICATION_CHECK_ACCEPTABLE|
|TO05|TO05_C03|3|通電表示だけで自社設備の利用を見込み、電源容量と通信途絶時の作業条件を十分に確認しない。|TO05_POWER_COMMUNICATION_CHECK_WEAK|
|TO05|TO05_C00|0|自社の電力・通信が不安定と把握しても、安全な停止や連絡手段を定めず荷役を進める。|TO05_POWER_COMMUNICATION_CHECK_CRITICAL|
|TOX02|TOX02_C10|10|自社の重要負荷、電源容量、安全な接続、燃料残量と補給条件を確認し、必要な非常用電源を実際に確保して運用時間を管理する。|TO_SECURE_SAFE_BACKUP_POWER_AND_MANAGE_FUEL_CONTINUITY|
|TOX02|TOX02_C07|7|安全を確認して自社の重要負荷へ非常用電源を確保するが、燃料補給の遅延時の対応は十分でない。|TO_SECURE_CRITICAL_LOAD_POWER_WITHOUT_FUEL_DELAY_PLAN|
|TOX02|TOX02_C03|3|自社の非常用電源を確保しても負荷と燃料の管理を十分に行わず、継続可能時間を過大に見積もる。|TO_USE_BACKUP_POWER_WITH_INCOMPLETE_LOAD_FUEL_CONTROL|
|TOX02|TOX02_C00|0|自社非常用電源の安全な接続と必要容量を確認せず使用し、燃料不足の兆候も見過ごす。|TO_USE_BACKUP_POWER_WITHOUT_SAFE_CONNECTION_CAPACITY_CHECK|
|TO06|TO06_C10|10|港湾管理者から施設の利用範囲・荷重・時間・中止条件を確認し、自社設備と要員の条件を加えて自社の作業範囲を設定する。|TO06_TERMINAL_WORK_CONDITIONS_OPTIMAL|
|TO06|TO06_C07|7|共有された施設条件に沿って自社作業を設定するが、条件更新時の確認担当は十分に定めない。|TO06_TERMINAL_WORK_CONDITIONS_ACCEPTABLE|
|TO06|TO06_C03|3|以前共有された施設条件を前提に自社作業を設定し、最新の条件変更の確認を後回しにする。|TO06_TERMINAL_WORK_CONDITIONS_WEAK|
|TO06|TO06_C00|0|共有された施設の利用条件に自社作業が適合しないと分かっていても、作業計画を修正しない。|TO06_TERMINAL_WORK_CONDITIONS_CRITICAL|
|TO07|TO07_C10|10|共有された優先方針と自社の作業条件・処理能力を照合し、安全に実施できる荷役順序と見直し条件を設定して関係先と調整する。|TO07_SHARED_PRIORITY_HANDLING_SEQUENCE_OPTIMAL|
|TO07|TO07_C07|7|共有された優先方針に沿って自社荷役の順序を設定するが、遅延時の見直し方法は十分でない。|TO07_SHARED_PRIORITY_HANDLING_SEQUENCE_ACCEPTABLE|
|TO07|TO07_C03|3|自社の作業効率だけで荷役順序を組み、共有された優先方針との不整合の確認を後回しにする。|TO07_SHARED_PRIORITY_HANDLING_SEQUENCE_WEAK|
|TO07|TO07_C00|0|共有された重要貨物の優先方針を認識しても、自社の便宜だけで荷役順序を維持して調整しない。|TO07_SHARED_PRIORITY_HANDLING_SEQUENCE_CRITICAL|
|TO08|TO08_C10|10|要請内容と自社の安全条件・設備・要員・保管余力を照合し、対応可能量と時間、不足条件を示して関係先と調整する。|TO08_EMERGENCY_HANDLING_RESPONSE_OPTIMAL|
|TO08|TO08_C07|7|自社の安全条件と処理能力を確認して対応可能量を伝えるが、要請変更時の再調整条件は十分でない。|TO08_EMERGENCY_HANDLING_RESPONSE_ACCEPTABLE|
|TO08|TO08_C03|3|自社の空き人員だけで緊急荷役の対応量を決め、設備適合性や保管余力の確認を限定する。|TO08_EMERGENCY_HANDLING_RESPONSE_WEAK|
|TO08|TO08_C00|0|自社で安全に処理できないと把握していても、必要な条件や制約を伝えず緊急荷役を引き受ける。|TO08_EMERGENCY_HANDLING_RESPONSE_CRITICAL|
|TOX03|TOX03_C10|10|自社の滞留量と実効処理能力を比較し、共有された優先方針・調整済み要請を踏まえて荷役順序と自社受入量を見直す。|TO_REBALANCE_HANDLING_SEQUENCE_AND_OWN_ACCEPTANCE|
|TOX03|TOX03_C07|7|自社受入量を処理可能量に抑えて滞留を管理するが、滞留長期化時の見直し条件は十分でない。|TO_CAP_ACCEPTANCE_WITHOUT_PROLONGED_STORAGE_REVIEW|
|TOX03|TOX03_C03|3|自社の一部作業順だけを変更し、受入量と処理能力の差を十分に調整しない。|TO_CHANGE_SOME_WORK_SEQUENCE_WITHOUT_ACCEPTANCE_REBALANCE|
|TOX03|TOX03_C00|0|自社ヤードの余力と処理能力を超えると把握しても、受入量を抑えず貨物を積み増す。|TO_ADD_CARGO_BEYOND_STORAGE_AND_HANDLING_CAPACITY|
|TO09|TO09_C10|10|自社の要員・設備・ヤード・電源と確認済み接続条件を照合し、最も制約の強い要素を踏まえた処理可能量を共有する。|TO09_TERMINAL_EFFECTIVE_CAPACITY_CHECK_OPTIMAL|
|TO09|TO09_C07|7|主要な自社要員・設備・ヤードの状況から処理可能量を整理するが、時間変動の反映は十分でない。|TO09_TERMINAL_EFFECTIVE_CAPACITY_CHECK_ACCEPTABLE|
|TO09|TO09_C03|3|自社設備の公称能力を中心に処理可能量を見積もり、要員や搬出条件の不足を十分に反映しない。|TO09_TERMINAL_EFFECTIVE_CAPACITY_CHECK_WEAK|
|TO09|TO09_C00|0|自社の重大な能力不足を把握していても、通常時の処理量を対応可能量として共有する。|TO09_TERMINAL_EFFECTIVE_CAPACITY_CHECK_CRITICAL|
|TO10|TO10_C10|10|自社・利用調整可能範囲の候補について安全、利用合意、荷重、動線、容量を確認し、実際に利用できる代替ヤードを確保する。|TO10_ALTERNATIVE_YARD_SECUREMENT_OPTIMAL|
|TO10|TO10_C07|7|安全と利用合意を確認して自社の代替ヤードを確保するが、運用長期化時の管理条件は十分でない。|TO10_ALTERNATIVE_YARD_SECUREMENT_ACCEPTABLE|
|TO10|TO10_C03|3|自社で利用できそうな候補を確保対象とするが、使用条件の確認が不十分なまま受入余力に見込む。|TO10_ALTERNATIVE_YARD_SECUREMENT_WEAK|
|TO10|TO10_C00|0|安全や利用合意が確認できていない場所を、自社の利用可能な代替ヤードとして貨物を搬入する。|TO10_ALTERNATIVE_YARD_SECUREMENT_CRITICAL|
|TOX04|TOX04_C10|10|確保した自社代替ヤードと管理主体から確認済みの通行条件を照合し、輸送事業者と自社貨物の経路・車両・時間枠を調整して接続を確保する。|TO_SECURE_CONFIRMED_ALTERNATIVE_YARD_TRANSPORT_CONNECTION|
|TOX04|TOX04_C07|7|自社代替ヤードへ接続できる確認済み経路と輸送手段を確保するが、遅延時の代替手順は十分でない。|TO_SECURE_ALTERNATIVE_CONNECTION_WITHOUT_DELAY_CONTINGENCY|
|TOX04|TOX04_C03|3|自社代替ヤードまでの経路候補だけで接続可能と見込み、通行条件と輸送事業者の対応量の確認を限定する。|TO_ASSUME_YARD_CONNECTION_FROM_UNCONFIRMED_ROUTE_CANDIDATE|
|TOX04|TOX04_C00|0|通行条件や輸送手段が適合しないと把握していても、自社貨物を代替ヤードへ積み増して搬出計画を修正しない。|TO_ADD_CARGO_WITHOUT_FIXING_INCOMPATIBLE_TRANSPORT_PLAN|
|TO11|TO11_C10|10|確認済みの施設利用条件と自社の要員・設備・ヤード・電源・搬出余力の範囲で、監視と中止条件を定めて限定荷役を再開する。|TO11_LIMITED_HANDLING_RESTART_OPTIMAL|
|TO11|TO11_C07|7|確認済み条件に沿って自社荷役を限定再開するが、能力変化時の再評価の間隔は十分でない。|TO11_LIMITED_HANDLING_RESTART_ACCEPTABLE|
|TO11|TO11_C03|3|自社の一部設備が使えることを中心に限定再開を進め、要員や保管・搬出余力の確認を限定する。|TO11_LIMITED_HANDLING_RESTART_WEAK|
|TO11|TO11_C00|0|施設条件と自社の安全条件が満たされないと把握していても、監視や中止条件を定めず荷役を再開する。|TO11_LIMITED_HANDLING_RESTART_CRITICAL|
|TOX05|TOX05_C10|10|最新の施設利用条件と自社の安全・能力・滞留・継続中の制約を再確認し、通常化できる範囲と残す作業制限を整理する。|TO_RECHECK_CONDITIONS_AND_RETAIN_NEEDED_WORK_LIMITS|
|TOX05|TOX05_C07|7|施設利用条件と自社の主要機能を再確認するが、通常化後の再停止時の連絡手順は十分でない。|TO_RECHECK_MAIN_FUNCTIONS_WITHOUT_RESTOP_CONTACT_PROTOCOL|
|TOX05|TOX05_C03|3|自社の荷役実績だけで通常化を準備し、最新の施設条件や未解決の電源・搬出制約の確認を限定する。|TO_PREPARE_NORMALIZATION_FROM_HANDLING_RECORDS_ONLY|
|TOX05|TOX05_C00|0|自社の重大な安全上の未解決事項を把握していても、再確認せず通常荷役への移行準備を進める。|TO_PREPARE_NORMALIZATION_WITHOUT_RECHECKING_CRITICAL_ISSUES|
|TO12|TO12_C10|10|最新の施設利用条件と自社の安全・有効能力に合わせ、残る制約と再停止条件を共有しながら自社の荷役体制を段階的に通常化する。|TO12_TERMINAL_HANDLING_NORMALIZATION_OPTIMAL|
|TO12|TO12_C07|7|確認済みの自社能力に合わせて通常荷役へ段階移行するが、再停止時の手順共有は十分でない。|TO12_TERMINAL_HANDLING_NORMALIZATION_ACCEPTABLE|
|TO12|TO12_C03|3|自社の処理件数の回復だけで通常荷役の範囲を広げ、残る要員・電源・物流制約の反映を限定する。|TO12_TERMINAL_HANDLING_NORMALIZATION_WEAK|
|TO12|TO12_C00|0|重大な安全制約と能力不足が残っていても、自社の監視と作業制限を一括で外して通常荷役に移行する。|TO12_TERMINAL_HANDLING_NORMALIZATION_CRITICAL|

## 153状況文（変更なし）

|Phase|災害|本文|
|---|---|---|
|PM01|EQTS|地震・津波を受け、自港の職員の所在と現地への立入り状況に情報の空白があります。港内の状況は場所によって異なります。|
|PM01|TCSS|台風・高潮の影響下で、自港の職員の所在と現地の浸水状況には未確認の情報があります。港内への移動条件は一様ではありません。|
|PM01|TCHW|高波・暴風の影響下で、自港の屋外区域と職員の活動状況には情報の空白があります。港内の風浪条件は場所によって異なります。|
|PM02|EQTS|自港の地震・津波被害に関する情報は施設ごとに量と確認時刻が異なります。岸壁、水域、陸上施設を同時に確認できる体制には限りがあります。|
|PM02|TCSS|自港の高潮による浸水と風害の情報は施設ごとに異なります。施設の重要性と現地情報の詳しさにはばらつきがあります。|
|PM02|TCHW|自港の波浪・暴風被害について、屋外施設と水域の情報が断片的に集まっています。現地の確認可能な範囲は場所ごとに異なります。|
|PM03|EQTS|自港岸壁と係留施設について、地震・津波後の外観情報や施設諸元が混在しています。損傷の範囲と荷重条件を扱う場面です。|
|PM03|TCSS|自港岸壁と係留施設について、高潮の浸水痕や風害の情報があります。施設ごとに利用条件を判断できる情報の詳しさが異なります。|
|PM03|TCHW|自港岸壁と係留施設について、波の作用と強風にさらされた箇所の情報があります。船舶条件と施設条件は岸壁ごとに異なります。|
|PM04|EQTS|自港の港口・航路・泊地には、地震・津波前の水深資料と被災後の断片的な水域情報があります。現在の確認範囲には差があります。|
|PM04|TCSS|自港の港口・航路・泊地について、高潮時の流れや漂流物に関する情報が集まっています。水域の情報は区域ごとに異なります。|
|PM04|TCHW|自港の港口・航路・泊地は高波の影響を受けています。波浪情報と施設側の水深・利用情報の更新時刻は一致していません。|
|PMX01|EQTS|自港の地震・津波後の施設情報には、確認時点や対象区域の異なる記録があります。施設の現在状況を扱う再評価の場面です。|
|PMX01|TCSS|自港の台風・高潮被害に関する記録には、異なる時刻と区域の情報があります。施設状況と既存の利用条件の関係を扱う場面です。|
|PMX01|TCHW|自港の波浪・暴風下の施設情報には、観測時点と現地記録の差があります。施設の現在状況を扱う再評価の場面です。|
|PM05|EQTS|自港のエプロンと港内動線について、地震・津波後の路面や障害物の情報があります。管理対象の動線と荷重条件は場所により異なります。|
|PM05|TCSS|自港のエプロンと港内動線には、高潮による浸水や堆積物に関する情報があります。搬出入口と保管区域では条件が異なります。|
|PM05|TCHW|自港のエプロンと港内動線には、高波の飛沫や暴風にさらされる箇所があります。屋外動線の条件は区域ごとに異なります。|
|PM06|EQTS|地震・津波後の自港施設には、詳しい確認記録がある箇所と情報の限られる箇所があります。施設利用に関する照会が届いています。|
|PM06|TCSS|台風・高潮後の自港施設について、浸水や機器への影響に関する情報の確度が異なります。施設利用に関する照会が届いています。|
|PM06|TCHW|高波・暴風の影響下にある自港施設について、屋外利用の条件が区域ごとに異なります。施設利用に関する照会が届いています。|
|PMX02|EQTS|自港の地震・津波後の利用条件に関する資料と、新しい時刻の施設情報があります。両者の対象範囲は必ずしも一致していません。|
|PMX02|TCSS|自港の高潮・風害に関する利用条件の資料と、新しい時刻の現地情報があります。区域ごとに情報の更新状況が異なります。|
|PMX02|TCHW|自港の波浪・暴風下の利用条件に関する資料と、新しい気象・施設情報があります。利用予定の時間帯も複数あります。|
|PM07|EQTS|地震・津波後の自港への支援船等の受入れに関する照会があります。船型、到着予定、荷役条件は照会ごとに異なります。|
|PM07|TCSS|台風・高潮の影響を受けた自港への船舶受入れ照会があります。到着予定と陸上側の条件には時間帯による差があります。|
|PM07|TCHW|高波・暴風下の自港への船舶受入れ照会があります。船舶ごとの予定時間と港内で扱う条件は一様ではありません。|
|PM08|EQTS|地震・津波後の自港岸壁に対して複数の利用照会があります。船舶条件と希望時間帯が重なる組合せがあります。|
|PM08|TCSS|台風・高潮後の自港岸壁について、利用希望の時間帯と施設条件の情報があります。同じ時間帯を希望する船舶があります。|
|PM08|TCHW|高波・暴風の影響下で、自港岸壁の利用希望時間帯に重なりがあります。船舶条件と陸上側の条件にも差があります。|
|PMX03|EQTS|地震・津波後の自港には複数の利用需要があります。需要の希望時間帯と自港側の受入条件を扱う調整の場面です。|
|PMX03|TCSS|台風・高潮後の自港に対する利用照会には時間帯の重なりがあります。照会ごとに必要な施設と荷役条件が異なります。|
|PMX03|TCHW|高波・暴風下の自港利用には、予定時刻の異なる複数の照会があります。船舶利用と陸上処理を含む調整の場面です。|
|PM09|EQTS|地震・津波後の自港の搬出入口と背後交通について、管理主体の異なる情報があります。情報の更新時刻と対象車両条件は一様ではありません。|
|PM09|TCSS|高潮後の自港の搬出入口と背後交通には、浸水区域や通行条件に関する情報があります。自港側で扱う搬出入予定もあります。|
|PM09|TCHW|高波・暴風下の自港の搬出入について、港内動線と背後交通の情報があります。対象時間帯と車両条件が資料ごとに異なります。|
|PMX04|EQTS|地震・津波後の自港には受入予定と保管状況の情報があります。背後側への搬出条件は接続先によって異なります。|
|PMX04|TCSS|高潮後の自港の受入予定、保管区域、背後搬出に関する情報があります。港内と港外で扱う情報の範囲は異なります。|
|PMX04|TCHW|高波・暴風下の自港の受入予定と搬出入予定には時間帯の差があります。保管区域と背後側の接続条件を扱う場面です。|
|PM10|EQTS|地震・津波による自港施設の被害情報と、施設ごとの機能・工事条件の情報があります。応急復旧の対象となり得る施設は複数あります。|
|PM10|TCSS|高潮・風害を受けた自港施設について、被害状況と機能上の位置付けの情報があります。復旧に使える時間と作業条件は施設ごとに異なります。|
|PM10|TCHW|高波・暴風を受けた自港施設について、被害情報と工事条件の資料があります。屋外作業の条件と機能上の効果は施設ごとに異なります。|
|PM11|EQTS|地震・津波後の自港について、受入需要と施設・接続条件の情報があります。広域の候補情報は照会・調整の対象です。|
|PM11|TCSS|台風・高潮後の自港について、受入予定と施設条件の情報があります。広域の候補港の条件に関する情報と照会事項があります。|
|PM11|TCHW|高波・暴風下の自港について、受入予定と施設条件の情報があります。広域の接続候補について情報を照会できる場面です。|
|PMX05|EQTS|地震・津波後の自港について、施設情報、利用条件、未確認事項の記録があります。利用制限の緩和を検討する前の場面です。|
|PMX05|TCSS|台風・高潮後の自港について、施設情報と利用上の制約に関する記録があります。利用制限の緩和を検討する前の場面です。|
|PMX05|TCHW|高波・暴風の影響を受けた自港について、施設情報と利用上の制約に関する記録があります。利用制限の緩和を検討する前の場面です。|
|PM12|EQTS|地震・津波後の自港施設について、利用可能な範囲と残る制約を扱う場面です。施設ごとの情報の詳しさや利用予定は一様ではありません。|
|PM12|TCSS|台風・高潮後の自港施設について、利用可能な範囲と残る制約を扱う場面です。区域によって施設条件と利用予定が異なります。|
|PM12|TCHW|高波・暴風後の自港施設について、利用可能な範囲と残る制約を扱う場面です。時間帯によって屋外利用条件が異なります。|
|ML01|EQTS|地震・津波後の複数港の被害情報と支援に関する照会が届いています。北海道開発局側の連絡情報には地域による差があります。|
|ML01|TCSS|台風・高潮による複数地域の被害情報が届いています。国側の初動支援と情報集約を扱う場面です。|
|ML01|TCHW|高波・暴風の影響に関する複数港の情報が届いています。国側の初動支援と広域情報を扱う場面です。|
|ML02|EQTS|地震・津波後の現地調査に関する要請と、国側支援班の人員・専門性の情報があります。現地への進入条件は地域ごとに異なります。|
|ML02|TCSS|高潮・風害の調査に関する要請と、国側支援班の配置情報があります。現地の浸水状況や移動条件は調査先ごとに異なります。|
|ML02|TCHW|波浪・暴風被害の調査に関する要請と、国側支援班の配置情報があります。屋外での調査条件は現地ごとに異なります。|
|ML03|EQTS|地震・津波後の岸壁について、調査記録と技術的な照会があります。港湾管理者への技術情報提供を扱う場面です。|
|ML03|TCSS|高潮・風害を受けた岸壁について、施設情報と技術的な照会があります。国側では調査支援と技術情報の整理を扱います。|
|ML03|TCHW|高波・暴風を受けた岸壁について、施設情報と技術的な照会があります。国側では作用条件と調査情報を扱います。|
|ML04|EQTS|地震・津波後の航路・泊地について、水深資料と断片的な現地情報があります。国側の調査・技術支援に関する照会が届いています。|
|ML04|TCSS|高潮後の航路・泊地について、流れや漂流物に関する情報があります。国側の調査支援の対象範囲は地域によって異なります。|
|ML04|TCHW|高波下の航路・泊地について、波浪情報と施設資料があります。国側の調査・技術支援に関する照会が届いています。|
|MLX01|EQTS|地震・津波後の調査対象には、時点と範囲の異なる記録があります。国側支援班の配置と現地条件を見直す場面です。|
|MLX01|TCSS|高潮・風害の調査対象には、時点と範囲の異なる情報があります。国側支援班の配置と移動条件を扱う場面です。|
|MLX01|TCHW|波浪・暴風被害の調査対象には、時点と範囲の異なる情報があります。国側支援班の配置と屋外活動条件を扱う場面です。|
|ML05|EQTS|地震・津波後の支援に関し、国側の人員・機材・船舶の所在情報と要請があります。資源ごとに稼働条件と移動時間が異なります。|
|ML05|TCSS|台風・高潮後の支援に関し、国側資源の所在情報と要請があります。資源の稼働条件と補給条件は一様ではありません。|
|ML05|TCHW|高波・暴風下の支援に関し、国側資源の所在情報と要請があります。移動・海上活動・屋外作業の条件は資源ごとに異なります。|
|MLX02|EQTS|地震・津波後の地域別支援要請と国側資源の配置情報があります。地域ごとの要請内容と投入条件には差があります。|
|MLX02|TCSS|台風・高潮後の支援要請と国側資源の配置情報があります。複数地域が同じ種類の資源を必要とする場面です。|
|MLX02|TCHW|高波・暴風下の支援要請と国側資源の配置情報があります。地域ごとの活動時間帯と移動条件には差があります。|
|ML06|EQTS|地震・津波による広域被害の情報は、地域ごとに範囲と更新時刻が異なります。国側支援の対象範囲を扱う場面です。|
|ML06|TCSS|台風・高潮による広域被害情報には、地域による情報量の差があります。国側支援の対象範囲と要請の情報があります。|
|ML06|TCHW|高波・暴風による複数地域の被害情報には、更新時刻の差があります。国側支援の対象範囲を扱う場面です。|
|ML07|EQTS|地震・津波後の海上支援について、船舶情報と港湾側への照会事項があります。受入条件と背後接続の情報は地域により異なります。|
|ML07|TCSS|台風・高潮後の海上支援について、船舶情報と受入側への照会事項があります。予定時間と陸上接続条件には差があります。|
|ML07|TCHW|高波・暴風下の海上支援について、船舶情報と受入側への照会事項があります。運航条件は海域と時間帯により異なります。|
|MLX03|EQTS|地震・津波後の海上支援には、接続候補と支援需要の情報があります。国側ではネットワークの追加接続を扱う調整の場面です。|
|MLX03|TCSS|台風・高潮後の海上支援には、複数の接続候補に関する情報があります。追加接続の候補ごとに船舶・受入条件が異なります。|
|MLX03|TCHW|高波・暴風下の海上支援には、複数の接続候補に関する情報があります。候補ごとに予定時間と運航条件が異なります。|
|ML08|EQTS|地震・津波後の代替港候補について、施設資料と各港への照会事項があります。現在の余力と接続情報には地域差があります。|
|ML08|TCSS|台風・高潮後の代替港候補について、各港の施設資料と照会事項があります。浸水範囲と背後交通条件は港ごとに異なります。|
|ML08|TCHW|高波・暴風下の代替港候補について、施設資料と各港への照会事項があります。海域条件と背後接続の条件は港ごとに異なります。|
|ML09|EQTS|地震・津波後の背後交通について、管理主体ごとの情報があります。通行条件の対象区間と更新時刻には差があります。|
|ML09|TCSS|高潮後の背後交通について、道路等の管理主体ごとの情報があります。浸水区域と港湾側の接続区域は一致していません。|
|ML09|TCHW|暴風下の背後交通について、管理主体ごとの情報があります。対象車両と対象時間帯の条件が資料ごとに異なります。|
|MLX04|EQTS|地震・津波後の港湾間機能分担について、候補港と交通接続の情報があります。各港の条件と意向は調整の対象です。|
|MLX04|TCSS|台風・高潮後の港湾間機能分担について、候補港と交通接続の情報があります。各港への照会事項には地域差があります。|
|MLX04|TCHW|高波・暴風下の港湾間機能分担について、候補港と交通接続の情報があります。各港の予定時間と利用条件には差があります。|
|ML10|EQTS|地震・津波後の国側支援資源について、投入候補、支援要請、移動条件の情報があります。投入先ごとの役割と期待される効果は異なります。|
|ML10|TCSS|台風・高潮後の国側支援資源について、投入候補と要請の情報があります。資源の稼働条件と支援の対象機能は一様ではありません。|
|ML10|TCHW|高波・暴風下の国側支援資源について、投入候補と要請の情報があります。屋外活動や海上移動の条件が投入先ごとに異なります。|
|ML11|EQTS|地震・津波後の支援に関し、複数の関係機関から照会や要請があります。窓口、対象範囲、回答状況の情報は一様ではありません。|
|ML11|TCSS|台風・高潮後の支援に関し、関係機関ごとの要請と照会があります。国側支援に関する連絡調整を扱う場面です。|
|ML11|TCHW|高波・暴風下の支援に関し、関係機関ごとの要請と照会があります。情報の更新時刻と活動可能な時間帯には差があります。|
|MLX05|EQTS|地震・津波後の国側支援について、継続要請、対応記録、未確認事項の情報があります。支援体制の縮小を検討する前の場面です。|
|MLX05|TCSS|台風・高潮後の国側支援について、継続要請と対応状況の情報があります。支援体制の縮小を検討する前の場面です。|
|MLX05|TCHW|高波・暴風後の国側支援について、継続要請と対応状況の情報があります。支援体制の縮小を検討する前の場面です。|
|ML12|EQTS|地震・津波後の国側支援について、継続する要請と連絡体制に関する情報があります。通常体制への移行を扱う場面です。|
|ML12|TCSS|台風・高潮後の国側支援について、継続する要請と担当に関する情報があります。通常体制への移行を扱う場面です。|
|ML12|TCHW|高波・暴風後の国側支援について、継続する要請と担当に関する情報があります。通常体制への移行を扱う場面です。|
|TO01|EQTS|地震・津波の影響を受けた自社ターミナルでは、作業員の所在と屋外区域の情報に差があります。現地の活動状況を扱う初動の場面です。|
|TO01|TCSS|高潮・暴風の影響下にある自社ターミナルでは、作業員の所在と浸水状況の情報に差があります。屋外と屋内で条件が異なります。|
|TO01|TCHW|高波・暴風の影響下にある自社ターミナルでは、作業員の所在と屋外作業区域の情報に差があります。活動場所によって条件が異なります。|
|TO02|EQTS|地震・津波後の自社作業員について、出勤可能時間、資格、連絡状況の情報があります。予定している作業には異なる技能が関係します。|
|TO02|TCSS|台風・高潮後の自社作業員について、出勤可能時間と資格の情報があります。通勤条件と勤務可能時間は人員ごとに異なります。|
|TO02|TCHW|暴風下の自社作業員について、勤務可能時間と資格の情報があります。予定している屋外作業には異なる技能が関係します。|
|TO03|EQTS|地震・津波後の自社荷役設備について、外観情報と設備資料があります。設備ごとに確認できている機能の範囲が異なります。|
|TO03|TCSS|高潮・風害を受けた自社荷役設備について、浸水痕や外観の情報があります。電装部と機械部の情報の詳しさは一様ではありません。|
|TO03|TCHW|高波・暴風を受けた自社荷役設備について、外観情報と設備資料があります。設置場所と使用条件は設備ごとに異なります。|
|TO04|EQTS|地震・津波後の自社・調整済みヤードには、路面、貨物、通路に関する情報があります。区域ごとに情報の詳しさが異なります。|
|TO04|TCSS|高潮後の自社・調整済みヤードには、浸水、貨物、通路に関する情報があります。保管区域と走行区域で条件が異なります。|
|TO04|TCHW|高波・暴風下の自社・調整済みヤードには、貨物と屋外動線に関する情報があります。貨物の種類と区域によって条件が異なります。|
|TOX01|EQTS|地震・津波後の自社設備とヤードについて、確認時点や対象範囲の異なる記録があります。現時点の作業条件を扱う再点検の場面です。|
|TOX01|TCSS|高潮・風害を受けた自社設備とヤードについて、時点の異なる現地情報があります。現在の作業条件を扱う再点検の場面です。|
|TOX01|TCHW|高波・暴風下の自社設備とヤードについて、時点の異なる現地情報があります。現在の屋外作業条件を扱う再点検の場面です。|
|TO05|EQTS|地震・津波後の自社ターミナルには、電源系統と通信手段の稼働情報があります。設備ごとに必要な電力と連絡手段が異なります。|
|TO05|TCSS|高潮後の自社ターミナルには、受電設備と通信手段に関する情報があります。電源系統ごとに浸水の条件が異なります。|
|TO05|TCHW|暴風下の自社ターミナルには、電源系統と通信手段の情報があります。屋外設備と屋内設備で利用条件が異なります。|
|TOX02|EQTS|地震・津波後の自社の重要負荷について、非常用電源の候補、燃料、接続条件の情報があります。負荷ごとに必要な電力が異なります。|
|TOX02|TCSS|高潮・風害後の自社の重要負荷について、非常用電源の候補と燃料の情報があります。電源の設置場所と接続条件が異なります。|
|TOX02|TCHW|高波・暴風下の自社の重要負荷について、非常用電源と燃料の情報があります。電源の設置場所と屋外の活動条件が異なります。|
|TO06|EQTS|地震・津波後の自社荷役について、港湾施設の利用条件に関する照会事項と自社の設備・要員の情報があります。作業予定の範囲は複数あります。|
|TO06|TCSS|高潮後の自社荷役について、施設利用条件に関する照会事項と自社の作業情報があります。区域ごとに荷役と搬出入の条件が異なります。|
|TO06|TCHW|高波・暴風下の自社荷役について、施設利用条件に関する照会事項と自社の作業情報があります。屋外作業の時間帯ごとに条件が異なります。|
|TO07|EQTS|地震・津波後の自社荷役には、複数の貨物と作業予定があります。優先方針に関する共有情報と自社の処理条件を扱う場面です。|
|TO07|TCSS|台風・高潮後の自社荷役には、複数の貨物と作業予定があります。共有された優先方針と自社の保管・搬出条件を扱う場面です。|
|TO07|TCHW|高波・暴風下の自社荷役には、時間帯の異なる複数の予定があります。優先方針に関する共有情報と自社の作業条件を扱う場面です。|
|TO08|EQTS|地震・津波後の自社ターミナルに緊急荷役に関する要請があります。貨物、数量、希望時間と自社設備の条件は要請ごとに異なります。|
|TO08|TCSS|台風・高潮後の自社ターミナルに緊急荷役に関する要請があります。貨物ごとに保管条件と希望時間が異なります。|
|TO08|TCHW|高波・暴風下の自社ターミナルに緊急荷役に関する要請があります。希望時間と屋外作業の条件には差があります。|
|TOX03|EQTS|地震・津波後の自社荷役について、貨物量、処理予定、保管区域の情報があります。自社の受入量と作業順序を扱う場面です。|
|TOX03|TCSS|高潮後の自社荷役について、貨物量と保管・搬出予定の情報があります。自社の受入量と処理量を扱う場面です。|
|TOX03|TCHW|高波・暴風下の自社荷役について、作業予定時間と貨物量の情報があります。自社の受入量と処理順序を扱う場面です。|
|TO09|EQTS|地震・津波後の自社ターミナルには、要員、設備、ヤード、電源、搬出の情報があります。各情報の対象時間帯と確認範囲には差があります。|
|TO09|TCSS|高潮後の自社ターミナルには、要員、設備、ヤード、電源、搬出の情報があります。各機能の条件は区域により異なります。|
|TO09|TCHW|高波・暴風下の自社ターミナルには、要員、設備、ヤード、電源、搬出の情報があります。各機能の活動可能な時間帯は一様ではありません。|
|TO10|EQTS|地震・津波後の自社物流には、保管場所の候補と利用調整に関する情報があります。候補ごとに地盤、容量、接続条件が異なります。|
|TO10|TCSS|高潮後の自社物流には、代替保管場所の候補と利用調整に関する情報があります。浸水条件と動線は候補ごとに異なります。|
|TO10|TCHW|高波・暴風下の自社物流には、代替保管場所の候補と利用調整に関する情報があります。貨物の種類と屋外保管条件は候補ごとに異なります。|
|TOX04|EQTS|地震・津波後の自社代替物流について、代替ヤードの利用調整に関する記録と背後輸送経路の情報があります。両者の接続条件を扱う場面です。|
|TOX04|TCSS|高潮後の自社代替物流について、代替ヤードの利用調整に関する記録と道路等の通行条件の情報があります。接続先ごとに車両条件が異なります。|
|TOX04|TCHW|高波・暴風下の自社代替物流について、代替ヤードの利用調整に関する記録と輸送経路の情報があります。搬出入時間と輸送条件は経路ごとに異なります。|
|TO11|EQTS|地震・津波後の自社荷役について、施設条件と自社の設備・要員・保管・搬出の情報があります。作業の限定再開を判断する場面です。|
|TO11|TCSS|高潮後の自社荷役について、施設条件と自社の設備・要員・保管・搬出の情報があります。作業の限定再開を判断する場面です。|
|TO11|TCHW|高波・暴風下の自社荷役について、施設条件と自社の設備・要員・保管・搬出の情報があります。作業の限定再開を判断する場面です。|
|TOX05|EQTS|地震・津波後の自社ターミナルには、施設条件と設備・要員・物流の情報があります。通常荷役への移行を検討する前の場面です。|
|TOX05|TCSS|高潮後の自社ターミナルには、施設条件と自社の作業・物流情報があります。通常荷役への移行を検討する前の場面です。|
|TOX05|TCHW|高波・暴風後の自社ターミナルには、施設条件と自社の作業・物流情報があります。通常荷役への移行を検討する前の場面です。|
|TO12|EQTS|地震・津波後の自社ターミナルについて、施設利用条件と自社の作業条件の情報があります。通常荷役体制への移行範囲を扱う場面です。|
|TO12|TCSS|高潮後の自社ターミナルについて、施設利用条件と自社の作業条件の情報があります。通常荷役体制への移行範囲を扱う場面です。|
|TO12|TCHW|高波・暴風後の自社ターミナルについて、施設利用条件と自社の作業条件の情報があります。通常荷役体制への移行範囲を扱う場面です。|

## 実装Workへの注意

正本JSONをデータ本体とし、JSは同一データを通常script/CommonJSへ直接コピーできる形式。実行エンジンは次工程で作成する。STATE_SCHEMAのtransaction順とEVENT_DRAW/PHASE_ACTION_MUTATIONのidempotencyを守る。

出典キーは維持し未知キー0。SOURCE_REFSの原資料URL・版は未検証（DOCUMENTATION_CAVEATS）。これらはruntime必須設定ではない。CT1はDRAFT_REFERENCE。未検証資料を確認済みと表示しない。訓練用score・確率・capacity・relevance・riskは国の公式値ではない。

EVENTやeffectの未発火・未解消を表すnull初期値は意図したstate表現で、未確定データではない。

unresolved implementation data=0、Static data QA PASS。GitHub・Cloudflareへの操作なし。
