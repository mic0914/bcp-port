# bcp-port Ver.1.0 公開前QA

状態：実装完成・公開待ち。GitHub操作・Cloudflare操作なし。

## UI演出追補（2026-10-16）

状態：UI演出追加完了・公開待ち。基準commit fc386ccc374c35f4d5b2872ce6cda5563883762b。

変更はindex.htmlのCSS/overlay、app.jsの表示制御、ブラウザQA及び監査記録のみ。engine.jsと正本JS/JSON、採点・EVENT・planner・Final Phase Gate・PDF生成内容は無変更。

- 初期intro：3災害共通の淡い円・3本の波紋・災害名・災害状況・シナリオ開始。通常2400ms、手動で早く閉じることも可能。1simulationにつき1回。
- intro中は通常チャットと選択肢を一時的に非表示にし、終了後に従来の状況文を残して表示。タイマーは終了又は手動スキップ後に開始。
- EVENT：engine確定済みadditionalEventsからだけ表示。「状況更新 · 追加EVENT」、8pxの小さな移動とfade 450ms、淡いglow1回で約1500ms。災害・impactによる速度差なし。音声・写実表現・点滅・画面振動なし。
- 表示済みEVENTキーはUI専用Set。再renderで再生せず、restart/role switchでクリア。simulation stateへ書き込まない。
- reduced motion：波紋・移動・glowなし、短いfadeだけ。intro350ms。CSS animation終了イベントに依存せず、wall-clock timeoutで終了。
- 一時overlayは印刷でdisplay:none。PDF生成関数・既存内容・A4縦/20mm/青緑背景を維持。3役・9ページを再描画目視PASS。

|UI QA|結果|
|---|---|
|EQTS / TCSS / TCHW intro|各PASS・1回|
|各災害1EVENT・履歴残存・再render|PASS・重複animation 0|
|Final Phase Gate遅延EVENT演出|3役PASS・各1回|
|reduced motion / CSS animation無効|PASS・情報欠落なし・進行可能|
|mobile 390px|overflow 0・4択操作可能|
|restart / role switch|PASS・表示用state残存0|
|ブラウザQA全体|16/16 PASS・JS error 0|
|Static / smoke / escalation / normalization / E2E|ERROR0 / 36/36 / 18/18 / 12/12 / 18/18 PASS|
|Final Phase Gate境界|6/6 PASS|
|EVENT・mutation idempotency / NaN / Infinity|PASS / 0 / 0|


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
|通常ブラウザ|16/16 PASS、UI演出・3役遅延EVENTのDOM回答含む|
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
