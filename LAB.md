# ワークショップ ラボ: コピー&ペースト演習

意図的に欠陥を仕込んだチェックアウトアプリを使う5つのステップです。3時間のチュートリアルに収まる分量です。**ローカル知識グラフの構築（0）→ アイデア出し → リファインメント → 開発 → CI/CD（1〜4）→ 自己学習（5）** の順に進み、その後 **PACTS の適用** と **個人の導入ロードマップ** を行います。SDLC 演習は積み上げ式です（リファインメントが開発に渡り、開発が CI/CD に渡ります）。各演習は最後に学んだ内容を保存し、ステップ5がそれを引き継ぎ資料にまとめます。**発展演習** が2つ（2b 探索的カバレッジ、2c 欠陥リスクプロファイル）あり、演習5の後に置いています。早く終わった方と、セッション後のためのものです。インデックス作成と埋め込みは、すべて **ローカルのオンデバイスモデル** で行います。会場全員が個人のキーで実行できるよう、トークン消費を小さく抑えています。

> **プロンプトは英語のまま使ってください。** コードブロック内のプロンプトは、英語版リポジトリで実際に実行して検証したものと同一です。要件ファイル（`requirements/`）も英語です。説明文だけを日本語にしています。日本語に翻訳したプロンプトは、この版では検証していません。

**プロンプトを選びます。各 SDLC 演習（1〜4と発展演習）には2つのバージョンがあります。**

- **Claude Code ユーザー**: AQE の skills / orchestrator（`/qcsd-ideation-swarm`、`/exploratory-testing-advanced`、`qe-defect-predictor`、`qe-test-architect`、`qe-queen-coordinator`）。
- **Claude Code 以外のユーザー**（Copilot、Codex、Gemini など）: 同じ作業を、AQE MCP ツール経由の汎用ステップ一覧にしたもの。

どちらも同じレポートに書き込み、最後は **「Save learnings and persist patterns.」** で終わります。*（ステップ0はターミナルコマンド3つ、ステップ5はプロンプト1つなので、どのツールでも同じで、分岐はありません。）*

**実測の所要時間**（2026年11月6日、AQE 3.15.18、Claude Code、無人実行）: 演習1 6.7分 / $2.25 · 演習2 3.3分 / $0.52 · 演習3 3.0分 / $0.55 · 演習4 1.4分 / $0.34 · 演習5 1.0分 / $0.29。コア演習5つで約15分、$3.96です。発展演習は、2b が 5.7分 / $0.99、2c が 6.0分 / $0.95 を追加します。対話的に実行すると、ツール呼び出しを承認する分だけ長くなります。使うモデルによって、時間もコストも変わります。

**始める前に:** [コンテナのセットアップ](./docs/DEVCONTAINER.md) または [README](./README.md) の手動セットアップ（Node 22.13 以上 → クローン → `npm install -g agentic-qe@latest` → `aqe init --auto --with-<お使いのツール>` → `npm install` → `aqe code index src/` → `npm install -g @huggingface/transformers@4.2.0`）を終えてから、ここでエージェントを起動してください。**`aqe init` を省略しないでください**（エージェント、MCP 設定、メモリ DB がインストールされます。コンテナ版では自動で行われます）。**演習は順番どおりに実行してください**（3は2の出力を読み、4は3がテストしたモジュールを評価し、5は1〜4が保存した内容を呼び出し、2b は2の出力を読みます）。パスはリポジトリのルートからの相対パスです。

---

## 演習0: ウォームアップ。ローカル知識グラフとベースラインの構築（約2分）

> *フェーズ:* セットアップ · *目的:* AI エージェント群がコードを推論する前に、**地図** を渡します。処理はすべてお使いの PC の中で完結します。静的解析とローカルの埋め込みモデルを使い、**API キーもトークンも不要** です。コーディングエージェント経由ではなく、**ターミナル** で実行してください。

```bash
aqe code index src/
aqe hg stats
aqe memory usage
```

**期待される結果**

| コマンド | このリポジトリでの期待値 |
|---------|----------------------|
| `aqe code index src/` | `Files indexed: 21` · `Nodes created: 102` · `Edges created: 117` · 数秒 |
| `aqe hg stats` | 手動セットアップ: 140 ノード / 102 エッジ（function 80、file 26、module 22、test 12）。コンテナセットアップ: 110 ノード / 89 エッジ（function 68、module 21、file 21） |
| `aqe memory usage` | Entries 21 · Vectors 81 · Namespaces 1 |

インデックス作成の出力と `hg stats` の数が違うのは、数えているものが違うからです。インデクサーは今作ったものを報告し、`hg stats` は永続化されたグラフ内のすべてのノード種別を報告します。手動とコンテナで合計が違うのは、手動の `aqe init --auto` が先にプロジェクト全体のインデックスを作り、テストや追加のファイルノードが加わるためです。コンテナは `--skip-code-index` で初期化するので、`src/` だけを保持します。どちらも21個のソースファイルをすべて含みます。2026年11月6日に agentic-qe 3.15.18 で計測しました。

> *補足:* AQE に LLM プロバイダーを設定している場合、インデックス作成時に、オプションの関係抽出パスが **ファイルごとに1回** モデルを呼び出します。このリポジトリでは21回です。消費したくない場合は、プロバイダーキーを export する前にインデックスを作成するか、ここで一度だけ受け入れてください。`LLM relationship extraction failed` という行は、このパスが省略されたことを意味します。グラフ自体は完全で、推論された設計パターンのエッジだけがありません。

---

## 演習1: アイデア出し。コードを書く前にエピックをゲートにかける

> *フェーズ:* アイデア出し · *目的:* エピックに QE のアイデア出しの観点を適用し、*コードを1行も書く前に* リリースゲートを判定します。

> *追加の2行がある理由:* 以前のドライラン（2026年10月1日、AQE 3.14.1、Claude Code）では、スウォームのセキュリティ監査が最大の労力で動き、放置すると30分以上と数十回の Web 取得を費やしました。ファイルに範囲を絞り、セキュリティ監査を外すと、スウォームはセッション内に終わり、それでも GO / CONDITIONAL / NO-GO の判定を出します。2026年11月6日に AQE 3.15.18 で再実行した結果は、6.7分 / $2.25、判定は CONDITIONAL、リスク39件で、9つのエージェントのうち6つが動きました。

**▸ Claude Code ユーザー**: オーケストレーションされたアイデア出しスウォームです。`qcsd-ideation-swarm` はコマンドファイルではなく **skill** としてインストールされます。お使いの Claude Code のビルドでスラッシュの後に表示されない場合は、名前で依頼してください（「Use the qcsd-ideation-swarm skill to ...」）。

```
/qcsd-ideation-swarm

Analyze the guest-checkout epic in requirements/epic-checkout.md,
using requirements/user-stories.md and
requirements/acceptance-criteria.md for context.
Work from these files only, with no web research. Skip the
security audit: Exercise 4 covers security.
Save all reports under reports/01-ideation-swarm/.
Save learnings and persist patterns.
```

**▸ Claude Code 以外のユーザー**: 同じ評価を明示的なステップで行います。

```
Assess the guest-checkout epic before any code is written. Read
requirements/epic-checkout.md (with requirements/user-stories.md and
requirements/acceptance-criteria.md for context). Work from these files
only, with no web research. Then:

1. Recommend the quality criteria that matter most (HTSM: capability,
   reliability, security, performance, usability, …)
2. Identify the top risks and score each by likelihood × impact
3. Validate requirements completeness and testability — flag gaps,
   contradictions, and unmeasurable acceptance criteria
4. Render a single GO / CONDITIONAL / NO-GO verdict with the top blockers
5. Save the assessment to reports/01-ideation-assessment.md
6. Save learnings and persist patterns
```

---

## 演習2: リファインメント。チェックアウトアプリのプロダクトファクター

> *フェーズ:* リファインメント · *目的:* プロダクトを実際の構成要素（SFDIPOT）に分解し、優先順位つきのテストアイデアにします。演習3がこれを使います。

**▸ Claude Code ユーザー**: プロダクトファクターのエージェントです。

```
Use qe-product-factors-assessor to analyse the guest-checkout product
from requirements/epic-checkout.md and requirements/user-stories.md.
Produce a product-factors (SFDIPOT) assessment and save it to
reports/02-refinement-product-factors.md.
Save learnings and persist patterns.
```

**▸ Claude Code 以外のユーザー**: 同じ評価を明示的なステップで行います。

```
Break the checkout product into its product factors before reasoning
about coverage. Read requirements/epic-checkout.md and
requirements/user-stories.md, then analyse the product across the
SFDIPOT dimensions:

  Structure, Function, Data, Interfaces, Platform, Operations, Time.

Then:
1. For each dimension, note what the requirements imply and produce
   prioritised test ideas
2. Save the assessment to reports/02-refinement-product-factors.md
3. Save learnings and persist patterns
```

---

## 演習3: 開発。リファインメントのアイデアからテストを生成する

> *フェーズ:* 開発 · *目的:* 演習2のプロダクトファクターのアイデアを、最もリスクの高いモジュールの、実行可能な本物のテストにします。

**▸ Claude Code ユーザー**: テストアーキテクトです。

```
Use qe-test-architect to generate a comprehensive test file for the
payment-retry logic in src/lib/payment-retry.ts. Use the test ideas in
reports/02-refinement-product-factors.md as input, and include
property-based tests for the module's invariants.
Save the test file as tests/lib/payment-retry.architect.test.ts and a
short rationale to reports/03-development-tests.md.
Save learnings and persist patterns.
```

**▸ Claude Code 以外のユーザー**: 同じ作業を明示的なステップで行います。

```
Generate tests for the payment-retry logic in src/lib/payment-retry.ts:

1. Read reports/02-refinement-product-factors.md and src/lib/payment-retry.ts
2. Write a comprehensive vitest test file covering the happy path, edge
   cases, error paths, and the module's invariants (use property-style
   tests where useful — e.g. idempotency, backoff bounds, retry limits)
3. Make sure the file imports from src/lib/payment-retry.ts and runs
4. Save the test file as tests/lib/payment-retry.architect.test.ts and a
   short rationale to reports/03-development-tests.md
5. Save learnings and persist patterns
```

> *ヒント:* 実行後に `npm test -- --run tests/lib/payment-retry.architect.test.ts` を実行すると、生成されたテストが実際に動くことを確認できます。

---

## 演習4: CI/CD。モジュールを検証し、リリースを判断する

> *フェーズ:* CI/CD · *目的:* 新しいものは何も生成しません。*測定し、スキャンし、ゲートにかけ、推奨します。* テストが付いたコードに対するリリース判断です。

**▸ Claude Code ユーザー**: queen-coordinator が検証用のエージェント群を指揮します。

```
Use qe-queen-coordinator to run a verification-only quality assessment of
src/lib/payment-retry.ts (do NOT generate tests). Analyse coverage gaps
with risk scoring, security-scan the module, apply a 90% quality gate,
and give a GO / CONDITIONAL / NO-GO deployment recommendation with the
top blockers.
Save the consolidated report to reports/04-cicd-quality-assessment.md.
Save learnings and persist patterns.
```

**▸ Claude Code 以外のユーザー**: 同じ作業を明示的なステップで行います。

```
Run a verification-only quality assessment of src/lib/payment-retry.ts
and decide on release. Do NOT generate tests — assess what exists:

1. Analyse coverage gaps with risk scoring
2. Review the module for security issues
3. Apply a quality gate at a 90% threshold
4. Give a deployment recommendation (GO / CONDITIONAL / NO-GO) with the
   top release blockers, if any
5. Save the consolidated report to reports/04-cicd-quality-assessment.md
6. Save learnings and persist patterns
```

> *期待されるカバレッジ:* 演習3の前に `npm run test:coverage` を実行すると、`src/` 全体で **61.62%**、`src/lib/payment-retry.ts` は **ステートメント 100% / ブランチ 97.29%** と表示されます。演習3の後は、このモジュールの4つの指標がすべて 100% になります。カバレッジだけなら 90% を超えますが、判定は NO-GO になり得ます。2026年11月6日の AQE 3.15.18 での実行では、エージェントは 109 件のテストがすべて成功し、カバレッジ 100% のモジュールを評価しながら、それでも **NO-GO** を返しました。冪等性キーがなく、ゲートウェイのタイムアウトがなく、投げられたエラーをすべてリトライするためです。AQE のゲート呼び出し自体は「insufficient evidence」を返したので、レポートの合否は、エージェントが計測値に 90% のしきい値を自分で当てはめた結果です。モジュールを読んで比較してください。全体が約 **38%** と表示される場合、クローンがテスト範囲の修正より前のものです。`git pull` して再実行してください。

> *注:* このアプリは、テスト可能なロジックを `src/lib/` に置いています（決済、Luhn、バリデーション、レート制限、メール）。**`src/services/` はありません。** 実行が速く終わるよう、1ファイルに絞っています。より広く検証したい場合は `src/lib/` に広げてください。

---

## 演習5: 自己学習。エージェント群のメモリを使う（約10分）

> *目的:* ここまでの各演習は、**「Save learnings and persist patterns.」** で終わりました。その成果を確かめます。エージェント群は学びを仕舞い込んだだけではありません。**まとめて、必要なときに** 返せます。組織の知識が、あなたのために働きます。どのツールでも同じプロンプトです。

```
Recall from AQE memory what the fleet learned about this checkout app
across Exercises 1–4 — payment retry, cart state, checkout form
accessibility, and request validation.

First list what you recalled: each pattern's name and one line on what it
says. Then consolidate that into a one-page brief — top risks, testability
gaps, contradictions, and the release verdict — framed as either:
  • an onboarding brief for someone joining the project today, or
  • a handoff document for the next person enhancing the checkout app.

Where memory returns nothing for a topic, take it from reports/01 to 04
and label that part REPORTS-BASED.

Save the brief to reports/05-handoff-brief.md.
```

> *ブリーフより先に、一覧を読んでください。* 一覧には、このコードベースの名前が出るはずです（`payment-retry.ts`、`CartContext.tsx`、`CheckoutForm.tsx`）。一般的なテストパターン（AAA 形式のユニットテスト、リスクベースのカバレッジなど）の一覧が返ってきた場合、想起の範囲が広すぎます。ストアには、AQE 自身の基礎パターン70件と、今回の演習で保存したパターンが入っているためです。気になるモジュール名を指定して再実行するか、下のレポート経由の方法を使ってください。

> *期待される結果:* 2026年11月6日の実行（AQE 3.15.18、Claude Code）では、メモリは `learning` 名前空間から4つのパターンを返しました。決済リトライの判定、生成されたテスト、プロダクトファクターのリスク、要件の矛盾です。セマンティック検索は、どのトピックでも同じ4つを返したため、カート状態、フォームのアクセシビリティ、リクエスト検証はレポートから取り、REPORTS-BASED と表示しました。シードの6パターンは、メモリクエリでは返りませんでした。一部をレポートから作ったブリーフも有効な結果です。メモリからの想起として示さず、ブリーフにその旨を書いてください。

> *途中で目にするもの:* `brain.rvf` や `VECTOR_SPACE_UNVERIFIED` を含む行、そして `.agentic-qe/` の中の `brain.rvf.corrupt-NNNN` ファイルです。どちらも想定内です。オプションのベクトルインデックスは省略され、AQE は権威あるストアである SQLite にフォールバックします。パターンは、どちらの場合も保存されています。

> *何も返ってこない場合:* `aqe learning stats` を実行してください。**`Total: 76`** 以上と表示されるはずです。AQE の基礎パターンに、シードの6パターンを加えた数で、演習が学びを保存するたびに増えます（2026年11月6日の実行では、発展演習を含めてすべて終えた後が98）。`Total: 28` なら、ストアを最初に開いた後で embedder をインストールしたことになります。シードの6パターンは保存されているので、そのまま続けてください。`Total: 0` なら、セットアップのステップ5を飛ばしたため、何も保存されていません。embedder をインストールし、`aqe learning import -i seed/aqe-seed-patterns.json` を実行してください。時間がない場合は、すでにあるものからまとめてください。*「Read reports/01 through reports/04 and write the same one-page brief to reports/05-handoff-brief.md.」* 詳細は [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) を参照してください。

> *Claude Code 以外を使っている場合:* Claude Code は、ReasoningBank フックにより、学びを自動で記録し、想起します。他のツールは、同じ作業を `memory_store` / `memory_query` MCP ツール経由で行います。そこで想起されない場合は、上のシードを読み込み、他を調べる前に `aqe learning stats` が 76 以上であることを確認してください。

**なぜこれが利点なのか。** 4つのレポートを読み直す必要はありませんでした。エージェント群は、各演習が保存した内容から、プロジェクトの組織知を数秒で再構成しました。新しいチームメンバーや次回の実行は、そのすべてをすぐに引き継げます。*（Claude Code では、この記録は自動です。ReasoningBank フックと `AQE Learning: N patterns loaded…` のバナーがそれです。）* これが自己学習のループです。**覚えている** AI エージェントは、ゼロから始める AI エージェントより優れています。

---
## 発展演習: 早く終わった方と、セッション後のために

演習2bと2cは、3時間の進行表には含まれません。完成していて検証済みなので、早く終わったときや、セッション後に続けるときに使ってください。2b は演習2のレポートを読みます。2c は単独で動きます。

### 演習2b（発展）: 探索的カバレッジ。プロダクトファクターからチャーターを作る（約20分）

> *フェーズ:* リファインメント · *目的:* プロダクトファクターは、プロダクトが *何でできているか* を教えてくれます。探索は、それがどう振る舞うかを教えてくれます。エージェントが演習2のテストアイデアからチャーターを作り、コードレベルで最初の一巡を行います。あなたは重要なチャーターを選び、見つかったものを判断します。

**▸ Claude Code ユーザー**: 探索的テストの skill です。

```
/exploratory-testing-advanced

Using the test ideas in reports/02-refinement-product-factors.md,
write three time-boxed exploratory charters for the guest checkout
and run a first pass of each against src/app/checkout,
src/components/CheckoutForm.tsx and src/lib/. Label every finding
EXECUTED, STATIC or INFERRED; list the questions a human must answer.
Save to reports/02b-exploratory-charters.md.
Save learnings and persist patterns.
```

**▸ Claude Code 以外のユーザー**: 同じ作業を明示的なステップで行います。

```
Turn the refinement ideas into exploratory coverage for the guest checkout:

1. Read reports/02-refinement-product-factors.md
2. Write three time-boxed exploratory charters (mission, scope, risks,
   heuristics such as FEW HICCUPPS, and a test tour for each)
3. For each charter, explore the code in src/app/checkout,
   src/components/CheckoutForm.tsx and src/lib/ and record what you find,
   labelling each finding EXECUTED, STATIC or INFERRED
4. List the open questions only a human tester can answer
5. Save to reports/02b-exploratory-charters.md
6. Save learnings and persist patterns
```

> *あなたの役割:* 実際のチームで最初に実行するチャーターを1つ選び、理由を言葉にしてください。次に、その発見を読みます。どれが証拠で、どれが推測でしょうか。`.env` に Stripe のテストキーがあれば、`npm run dev` で、そのチャーターを `http://localhost:3000` の動いているチェックアウトに対して実行できます。

---

### 演習2c（発展）: 欠陥リスクプロファイル。バグはどこに出るか（約15分）

> *フェーズ:* リファインメント → 開発 · *目的:* テストを書く前に、どこに書けば効果が出るかを決めます。欠陥予測エージェントがモジュールを欠陥リスクで順位づけします。その順位が、演習3で `payment-retry.ts` を選んだことと一致するかを確認します。

**▸ Claude Code ユーザー**: 欠陥予測エージェントです。

```
Use qe-defect-predictor to build a defect risk profile for every
module in src/lib/ and src/components/CheckoutForm.tsx from
complexity, coupling and coverage (npm run test:coverage).
Rank the modules, give the top three risk factors for each with its
evidence class, and say whether src/lib/payment-retry.ts belongs at
the top of the list, and why.
Save to reports/02c-defect-risk-profile.md.
Save learnings and persist patterns.
```

**▸ Claude Code 以外のユーザー**: 同じ作業を明示的なステップで行います。

```
Build a defect risk profile for the checkout app:

1. Run npm run test:coverage and read the per-file coverage
2. For every module in src/lib/ and for src/components/CheckoutForm.tsx,
   assess complexity, coupling and coverage
3. Rank the modules from highest to lowest defect risk, with the top three
   risk factors for each, labelled EXECUTED, STATIC or INFERRED
4. Say whether src/lib/payment-retry.ts belongs at the top, and why
5. Save to reports/02c-defect-risk-profile.md
6. Save learnings and persist patterns
```

> *期待される結果:* 2026年11月6日の実行（AQE 3.15.18）では、プロファイルは `CheckoutForm.tsx` を1位（ステートメント 58.6%、ブランチ 15.8%、実際の支払い経路）、`payment-retry.ts` を2位（設計上の欠陥が最も深刻だが、`src/` 内でこれを import しているものはない）にしました。中間の順位は、実行ごとに異なる可能性があります。確信を持って言えるのは上位2つです。

> *あなたの役割:* カバレッジを見ると、`payment-retry.ts` はすでにステートメント 100% です。それでもプロファイルが高く順位づけしているなら、その理由は何で、あなたは同意しますか。別のモジュールが上位なら、演習3と4の対象を変えますか。

---

## 実行後: PACTS を適用する

PACTS は、Agentic QE フレームワークの評価の観点です（[agentic-qe.dev/framework](https://agentic-qe.dev/framework)）。各レポートについて、次を問います。

- **Proactive（先回り）?** あなたが頼む *前に* リスクを指摘したか。それとも、プロンプトに答えただけか。
- **Autonomous（自律）?** 何を調べるかを自分で決めたか。それとも、あなたの指示を待ったか。
- **Collaborative（協調）?** 複数の関心事（と複数の演習）にまたがって発見を結びつけたか。それとも、それぞれを個別に扱ったか。
- **Targeted（的確）?** *この* チェックアウトフローに合った分析か。それとも、一般的なチェックリストか。
- **Structured（構造化）?** すべての結論を、それを出したエージェント、読んだ入力、示した理由までたどれるか。それとも、信じるしかないか。

2人1組で、各レポートを各項目0〜3で採点します。最も意外だった弱点を共有してください。

> **エンジンを比較する。** ペアに Claude Code ユーザーと Claude Code 以外のユーザーがいる場合、同じ演習の2つのレポートを比較してください。オーケストレーションされたスウォームは、ステップ一覧版が見逃したものを見つけたでしょうか（その逆も）。その差が、オーケストレーション層の価値です。2026年11月6日の実行では、ステップ一覧のプロンプトと Claude Code のプロンプトは、演習1で一致し（CONDITIONAL）、演習4で分かれました。オーケストレーション版は `payment-retry.ts` に NO-GO を返し（109件中109件のテストが成功、カバレッジ100%、冪等性キーなし、ゲートウェイのタイムアウトなし）、ステップ一覧版は同じモジュールに CONDITIONAL を返しました（120件のテスト、カバレッジ100%、決済の安全性に関する3つの穴を塞ぐ）。ステップ一覧のエージェントは、AQE のエージェントを実行せず、分析を自分で行ったとも述べています。両方を読み、どの判定に自分なら署名するかを決めてください。

---

## 個人の導入ロードマップ: レポートだけでなく、計画を持ち帰る

大切なのはレポートではなく、月曜日に何をするかです。*ご自身の* 環境について記入してください（約10分、ペアで）。

1. **私の環境**: チーム、技術スタック、今、品質で最も困っている点: ______
2. **取り戻したい70%**: チームの時間を奪っている、事務的なテスト作業のうち、AI エージェントに *最初に* 任せられるものは何か: ______
3. **最初に導入する3つの AI エージェント**: `.claude/agents/v3/` のエージェント群から選ぶ（例: `qe-requirements-validator`、`qe-product-factors-assessor`、`qe-test-architect`、`qe-queen-coordinator`）: ______
4. **最初に始める QCSD フェーズ**: アイデア出しのゲート、リファインメント、開発、CI/CD のどれか: ______
5. **2週間後の成功指標**: うまくいったとどう判断するか（例: *リファインメントで* 見つけた矛盾の数、最もリスクの高いモジュールのカバレッジ、GO/NO-GO 判断の速さ）: ______
6. **月曜日の最初の一歩**: 実際にやる、いちばん小さなこと: ______

> 小さく始めてください。AI エージェント1つ、フェーズ1つ、リポジトリ1つ、指標1つです。エージェント群の全体（60の AI エージェントと86のスキル、MIT ライセンス）は、`aqe init` の時点で、すでにお使いの PC に入っています。出し惜しみはありません。困っている所から始めてください。
