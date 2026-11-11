# 東京テストフェスト 2026 · Agentic QCSD チュートリアル（日本語版）

このリポジトリは、**[Tokyo Test Fest 2026](https://tokyotestfest.com/en/dragan_lalit_2026/)** のハーフデイ・チュートリアル **The 70% Problem: Reclaiming Testing's Intellectual Core with Agentic Quality Engineering** の公式リポジトリ（日本語版）です。英語版は [TTF-Agentic-QCSD-Workshop](https://github.com/fndlalit/TTF-Agentic-QCSD-Workshop) にあります。アプリのコード、テスト、要件ファイル、AI へのプロンプトは英語版と同一です。説明文だけを日本語にしています。

**ハーフデイ・チュートリアル · 2026年11月12日（木） · 13:00〜16:00 · ファシリテーター: Lalitkumar Bhamare、Dragan Spiridonov**

> **著作者と利用条件。** QCSD、Agentic QCSD、Designed Agency は Lalitkumar Bhamare の独自の成果物で、[CC BY 4.0](https://talesoftesting.com/qcsd/) で提供しています。再利用には本人のクレジット表記が必要です。[Agentic QE](https://github.com/proffesor-for-testing/agentic-qe) フレームワークは Dragan Spiridonov による MIT ライセンスのオープンソースで、Lalitkumar Bhamare が主要な貢献者です。**チュートリアルのスライドは無断転載禁止です。Lalitkumar Bhamare と Dragan Spiridonov に相談せずに再作成、再配布、再公開することを禁じます。** 詳細: [NOTICE.md](./NOTICE.md)。

**Agentic QCSD** は、自律的に動く AI 品質エージェントを *デリバリーのライフサイクル全体* に配置する考え方です。テストを生成するだけでなく、要件、プロダクトリスク、コード品質、セキュリティ、アクセシビリティを、品質エンジニアと同じ視点で推論させます。このセッションでは、AI エージェント群（**[Agentic QE](https://github.com/proffesor-for-testing/agentic-qe)**）を SDLC の4つのフェーズで動かし、エージェントが *自分から* 見つけたものを確認し、その出力を **PACTS**（Proactive、Autonomous、Collaborative、Targeted、Structured）の観点で評価します。

AI エージェントには、実際に分析できる対象が必要です。そこでこのリポジトリには、意図的に欠陥を仕込んだ小さな EC アプリを **テスト対象** として同梱しています。詳しくは下の [デモアプリ](#デモアプリ) を参照してください。

---

## 当日の内容

短いウォームアップ、4つの SDLC 演習（要件のテスト容易性、プロダクトファクター、テスト設計、デプロイ準備）、最後の自己学習で構成されています。すべてコピー&ペーストで実行でき、**[LAB.md](./LAB.md)** にまとめてあります。3時間に収まる分量です。演習は積み上げ式です（リファインメントの結果が開発に渡り、CI/CD がその結果を検証します）。各演習は学んだ内容を **保存** するので、進めるほどエージェント群のメモリが育ちます。早く終わった方と、セッション後のために、**発展演習** を2つ（2b 探索的テストのカバレッジ、2c 欠陥リスクプロファイル）LAB.md に用意しています。

| ステップ | エージェント / ツール | 答えを出す問い |
|------|-----------------|--------------------------|
| **0 · ウォームアップ** | `aqe code index src/`（ターミナル） | コードの知識グラフと、きれいなメモリのベースラインを作る。ローカル実行で API キー不要、数秒。 |
| **1 · アイデア出し** | ideation gate（品質基準 + リスク + 要件） | コードを書く前に、品質エンジニアはこの要件で仕事ができるか。GO / CONDITIONAL / NO-GO。 |
| **2 · リファインメント** | `qe-product-factors-assessor` | このプロダクトは実際に何でできているか（SFDIPOT）。リスクはどこか。 |
| **2b · 探索的カバレッジ** *(発展)* | `/exploratory-testing-advanced` | どの探索チャーターが必要か。最初の一巡で何が見つかるか。人間のテスターに残るものは何か。 |
| **2c · 欠陥リスクプロファイル** *(発展)* | `qe-defect-predictor` | どのモジュールに欠陥が潜みやすいか、その理由は何か。次にテストするモジュールと一致するか。 |
| **3 · 開発** | `qe-test-architect` | そのアイデアから、最もリスクの高いモジュールの強い実行可能なテストを作れるか。 |
| **4 · CI/CD** | `qe-queen-coordinator`（検証） | リリースできるか。カバレッジ + セキュリティ + 90% ゲートで GO / CONDITIONAL / NO-GO。 |
| **5 · 自己学習** | AQE メモリ | メモリを使う。学んだことをまとめて、すぐ使えるオンボーディング / 引き継ぎ資料にする。 |

SDLC 演習のプロンプトは **2種類** あります。**Claude Code ユーザー向け**（skills / orchestrator）と、**Claude Code 以外のユーザー向け**（汎用のステップ一覧）です。どのツールでも実行できます。ステップ0はターミナルコマンド3つ、ステップ5はプロンプト1つで、どのツールでも同じです。その後、各エージェントの出力を **PACTS** で採点し、最後に **個人の導入ロードマップ** を作ります。会場全員が個人のキーで実行できるよう、トークン消費を小さく抑えています。

---

## 参加前の準備

チュートリアル当日の時間では、ノート PC のトラブルを解決しきれません。セットアップは自宅で完了させてください。

- **Node.js 22.13 以上、npm 10 以上。** `node -v` と `npm -v` で確認してください。セッションのページには Node 20 と書かれていますが、現在の AQE パッケージは `node >= 22.13` を要求します。Node 22 LTS 以上を入れてください。devcontainer には Node 22 が入っています。
- **npm のグローバルパッケージをインストールする権限。** セットアップでは `npm install -g agentic-qe` を実行します。会社の PC で禁止されている場合は、制限のない PC を持参してください。
- **普段使っていて、サインイン済みで動作する AI コーディングエージェント。** Claude Code、GitHub Copilot、Cursor、AWS Kiro、OpenAI Codex CLI、Windsurf、Cline、OpenCode、Kilo Code、Roo Code、Continue.dev のいずれか。AQE は、1つの MCP サーバー経由で、お使いのエージェントを動かします。
- **ご自身のモデル利用権。** ステップ1〜5は、ご自身のキーまたはサブスクリプションのトークンを消費します。ステップ0は消費しません。普段のエージェント利用で1時間分くらいを目安にしてください。
- **`aqe code index src/` を含め、セットアップはすべて当日までに終えてください。** 会場の Wi-Fi と社内プロキシが、最も壊れやすい2点です。どちらも、会場の前方からは直せません。
- **任意: ご自身の実プロジェクト。** 最後の演習では、ご自身の環境での導入を計画します。会場で勤務先のコードを開く必要はありません。

---

## セットアップ

**すぐ使えるコンテナを使いたい場合:** このリポジトリを GitHub Codespaces で開くか、DevPod + Docker / VS Code Dev Containers でローカル実行します。下の手動手順の代わりに、[コンテナのセットアップガイド](./docs/DEVCONTAINER.md) に従ってください。最新の AQE が入ります。AI エージェントのアカウントと、任意の Stripe テストキーは、ご自身のものを使います。

**1. このリポジトリを取得します。** クローンするか、緑の **Code** ボタンから ZIP をダウンロードして展開し、フォルダに移動します。

```bash
git clone https://github.com/fndlalit/TTF-Agentic-QCSD-Workshop-JA
cd TTF-Agentic-QCSD-Workshop-JA
```

> **ホームフォルダの近くにクローンしてください。** コードインデクサーは、ディレクトリの深さが10階層を超えるファイルを読み飛ばします。`~/TTF-Agentic-QCSD-Workshop-JA` なら問題ありませんが、`~/Documents/Conferences/2026/TokyoTestFest/tutorials/...` のような深い場所では、API ルートが知識グラフから黙って欠落します。

**2. AQE をインストールし、お使いのコーディングエージェント向けに設定します。** フォルダの中で、一度だけ実行します。

```bash
npm install -g agentic-qe@latest  # 公開されている最新の AQE CLI
aqe init --auto                    # お使いのコーディングエージェント向けに AQE を設定（下の表を参照）
```

`aqe init --auto` は、デフォルトで **Claude Code** 向けに設定します。別のコーディングエージェントを使う場合は、対応するフラグを付けてください。AQE は、1つの MCP サーバーで **11 のプラットフォーム** に対応します。

| コーディングエージェント | `aqe init` コマンド |
|--------------|--------------------|
| **Claude Code** | `aqe init --auto`（標準） |
| **GitHub Copilot** | `aqe init --auto --with-copilot` |
| **Cursor** | `aqe init --auto --with-cursor` |
| **Cline** | `aqe init --auto --with-cline` |
| **OpenCode** | `aqe init --auto --with-opencode` |
| **AWS Kiro** | `aqe init --auto --with-kiro` |
| **Kilo Code** | `aqe init --auto --with-kilocode` |
| **Roo Code** | `aqe init --auto --with-roocode` |
| **OpenAI Codex CLI** | `aqe init --auto --with-codex` |
| **Windsurf** | `aqe init --auto --with-windsurf` |
| **Continue.dev** | `aqe init --auto --with-continuedev` |

```bash
aqe init --auto --with-all-platforms   # すべてを一度に設定する場合
```

**3. デモアプリの依存パッケージをインストールします。**

```bash
npm install
```

**4. コードの知識グラフを作ります。** コーディングエージェントを開く前に、ターミナルで3つのコマンドを実行します。

```bash
aqe code index src/     # 期待値: 21 ファイル、102 ノード、117 エッジ、数秒
aqe hg stats            # 同じグラフをノード種別ごとに集計
aqe memory usage        # 開始時のベースライン: 21 エントリ、81 ベクトル
```

これは静的解析とローカルの埋め込みモデルによる処理です。API キーは不要で、トークンも消費しません。エージェントが出力を中継する分のトークンを使わないよう、エージェントに頼まず、ターミナルで実行してください。

**5. 埋め込みモデル（embedder）をインストールします。** AQE は、エージェントが学んだことをパターンとしてベクトルストアに保存します。ストアへの書き込みには埋め込みモデルが必要です。ないと書き込みを拒否して `VECTOR_SPACE_UNVERIFIED` と表示し、各演習の「Save learnings and persist patterns」が何も保存しなくなります。その結果、演習5が読み返すものがなくなります。

```bash
npm install -g @huggingface/transformers@4.2.0   # ローカル embedder、384 次元 all-MiniLM-L6-v2
# または、信頼できる既存の埋め込みサービスを指定する場合:
export AQE_EMBEDDER_ENDPOINT=...
```

AQE は、このパッケージを、セキュリティ上の明示的なオプトインとして扱います。依存関係に、未解決の HIGH アドバイザリが2件あります（GHSA-xcpc-8h2w-3j85、GHSA-f88m-g3jw-g9cj）。インストールできない環境では、上のエンドポイント変数を使うか、LAB.md の説明に従って演習5をレポートから実行してください。

正しく入ったことを確認し、前の演習が失敗しても演習5に中身があるように、シード用のメモリを読み込みます。

```bash
aqe learning import -i seed/aqe-seed-patterns.json
aqe learning stats     # Total が 0 から 76 になる: AQE 自身のパターン + 今回の6件
```

import の行が、成功していても `Imported: 0 · Skipped: 6` と表示されることがあります。判断には `aqe learning stats` を使ってください。Total が 76 なら、シードの読み込みは成功です。

**6. このフォルダでコーディングエージェントを起動します。** Claude Code、Copilot、Cursor、Kiro、Codex、Windsurf など、お使いのもので構いません。このフォルダがワークスペースのルートで、LAB.md のパスはすべてここからの相対パスです。初回起動時に Claude Code は、フォルダを信頼するかと、`agentic-qe` MCP サーバーを承認するかを尋ねます。両方とも許可してください。許可しないと、skills とメモリツールが読み込まれません。

➡️ **次へ:** **[LAB.md](./LAB.md)** を開き、演習1から始めてください。

---

## デモアプリ

完全な購入フローを備えた、6商品の家電ストアです。ワークショップの主役ではなく、*テスト対象* です。AI エージェントに見つけさせるため、現実的な品質問題（バリデーションの抜け、アクセシビリティの不備、壊れやすい決済リトライ処理、弱い入力処理）を意図的に含めています。

- **カタログ** (`src/app/page.tsx`, `src/lib/products.ts`): カート追加つきの商品一覧。
- **カート** (`src/app/cart`, `src/context/CartContext.tsx`): React context と reducer によるクライアント側の状態管理。
- **チェックアウト** (`src/app/checkout`, `src/components/CheckoutForm.tsx`): 住所 + 支払いフォーム（Stripe Elements）、バリデーション、ゲスト購入。
- **確認画面** (`src/app/confirmation`): 購入後のサマリー。
- **API ルート** (`src/app/api`): `create-payment-intent` と `orders`。
- **ライブラリ** (`src/lib`): カード番号 / Luhn 検証、フォーム / メール検証、ゲストセッション、レート制限、バックオフ付き決済リトライ、注文イベント発行。

**技術スタック:** Next.js 14 (App Router) · React 18 · TypeScript · Stripe · Tailwind CSS · Vitest + Testing Library。

テストカバレッジは **意図的に不均一** です。一部のモジュールと UI の状態は、わざとテストしていません。AI エージェントがやるべき仕事を残すためです。

**既存のテストを実行する（任意）:**

```bash
npm run test:run        # 一度だけ実行
npm run test:coverage   # カバレッジ付き
```

---

## ライセンス

MIT。[LICENSE](./LICENSE) を参照してください。
