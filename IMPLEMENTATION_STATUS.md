# bcp-port Ver.1.0 公開前QA

状態：実装完成・公開待ち。GitHub操作・Cloudflare操作なし。

## Final Phase Gate

PM12 / ML12 / TO12を表示する前に、開始時採用済み（最大3件）の未発火EVENTをtriggerProgress・EVENT ID順に処理する。eventProgressは1へ進め、各EVENTのamplification / effect / capacity / pressure反映後にresponseLevel・hardTrigger・Phase planを再評価する。追加判断があれば未回答の最終Phaseを延期する。完了済みresultは変更しない。

最終Phase回答後はEVENT抽選・発火・再計画を行わない。最終Phase完了、採用済みpending EVENT 0、未完了planned Phase 0を完了条件とする。EVENT triggered及びstateMutationAppliedにより二重適用を防ぐ。正本データの本文・score・ID・tag等は変更していない。今回の境界仕様はユーザー指定による実装追補。

## 再現FAILと修正

対象：PORT / TCSS / LIGHT / 全0点、TC_ROAD_CLOSURE triggerProgress=0.9495。旧実値：PM12回答後の10→13でFINAL_PHASE_ESCALATION_CONFLICT。原因：最終回答後のEVENT処理と最終Phase最後の条件が衝突。修正後：PM12表示前にEVENTを処理、3判断を追加後PM12を最後に回答、13/13完了。再試験PASS。

TERMINAL境界fixtureはTC_POWER_LONGを使用する。TC_ROAD_CLOSUREはTERMINALの事前判断sourceを持たずLIGHTから昇格しないため、最初の試験期待13/実値10をfixture不備として修正。仕様・データは変更せず再試験PASS。

## QA結果

|項目|結果|
|---|---|
|Static|ERROR 0|
|Phase / basic / effective / situation / actionTag|51 / 204 / 612 / 153 / 204|
|smoke|36/36 PASS|
|escalation|18/18 PASS|
|normalization|12/12 PASS|
|最新版E2E|18/18 PASS|
|Final Phase Gate境界|6/6 PASS：3役10→13、13→17、EVENTなし、複数遅延EVENT|
|通常ブラウザ|11/11 PASS、3役遅延EVENTのDOM回答含む|
|EVENT delta|impact2/4 PASS、HW_OVERTOPPING impact2 channel -40 / berth -10|
|EVENT / mutation idempotency|PASS、重複0、204択の回答再適用を検査|
|restart / role switch|engine・ブラウザPASS|
|PDF|3役各1件・9ページ、A4縦/20mm/青緑背景、描画目視PASS|
|JS uncaught / NaN / Infinity|0 / 0 / 0|
|5 metrics|全E2E及びEXTREME 36ケースで有限・範囲内|

## 再実行

node tests/qa.js
node tests/final-phase-boundary.js
node tests/runtime-extra.js
node tests/browser-qa.js

tests/*results.jsonに結果を保存。late-event-evidence.jsonは修正前の履歴証跡であり現在の判定ではない。browser-qa.jsは独立したheadless Chromeを使用。PDFはqa-artifactsへ生成し、全9ページを再描画して確認した。

## 公開

GitHub CLI auth statusは未認証。今回は認証・repository作成・push・Pages公開を行っていない。公開には別工程でGitHub認証と公開操作が必要。mic0914/-及びmic0914/ijikannriへの変更なし。Cloudflare未使用。
