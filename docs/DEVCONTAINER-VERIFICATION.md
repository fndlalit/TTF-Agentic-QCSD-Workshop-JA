# コンテナの検証

2026年11月6日に、agentic-qe 3.15.18、Node 22.23、Linux で検証しました。このリポジトリの使い捨てコピーで、コンテナ自身のスクリプトを実行して確認しました。この日本語版リポジトリのアプリのコード、`.devcontainer`、ワークフローは、英語版（[TTF-Agentic-QCSD-Workshop](https://github.com/fndlalit/TTF-Agentic-QCSD-Workshop)）と同一です。違いは、説明文の言語だけです。

| チェック | 結果 |
|---|---|
| `npm ci` と `aqe init --auto --skip-code-index`（post-create が実行する内容） | 成功: 86 skills、60 AI エージェント |
| `bash .devcontainer/prepare-workshop.sh` | 成功: バックアップ作成、`src/` のインデックス作成、シードパターン6件の import |
| `bash .devcontainer/verify.sh` | 成功: ソースファイル21個がインデックス済み、384次元の埋め込み付きシードパターン 6/6、76パターン、整合性 `ok` |
| `node .devcontainer/verify-mcp.mjs` | 成功: ハンドシェイクとツール一覧（91 ツール）。メモリの想起クエリは0件（制限として報告） |
| `bash .devcontainer/test-lifecycle.sh` | 成功 |
| `bash .devcontainer/smoke-app.sh` | 成功: カタログ、カート、存在しない注文の HTTP 400。決済は試行していない |
| `npm run test:coverage` | 12 ファイル、333 テスト成功、全体のステートメント 61.62% |
| `npx --no-install tsc --noEmit` | 成功 |
| コンテナ方式のインデックス作成後のハイパーグラフ | 110 ノード / 89 エッジ（function 68、module 21、file 21） |

## GitHub Actions での検証

英語版リポジトリの `.github/workflows/devcontainer.yml` の初回実行（コミット bea184a、`main`）が成功しました。所要時間は 3分47秒です。このワークフローは、Linux amd64 でコンテナイメージをビルドし、準備、MCP チェック、カバレッジ、型チェック、アプリのスモークチェックを繰り返します。コンテナイメージのビルドを、実際に通した最初の確認です。この日本語版リポジトリの初回実行の結果は、Actions タブで確認してください。

## ここでは検証していない項目

- **実際の Codespace。** Codespace を実際に作成する確認はしていません。セッションの前に、Codespace を1つ作成して、全体の経路を確認してください。
- **コンテナ内でのエージェントのサインイン** と、コンテナから実行した有料の演習。演習は、手動セットアップから Claude Code で無人実行しました。実測の結果は LAB.md を参照してください。
- **Claude Code 以外のツール。** ステップ一覧のプロンプトは Claude Code でのみ実行しており、Copilot、Kiro、Codex では実行していません。
- **Claude 以外のエージェントでの MCP メモリの想起。** TROUBLESHOOTING.md から変わりません。選んだエージェントで想起を確認し、必要なら演習5のレポート経由の方法を使ってください。
- **日本語のプロンプト。** LAB.md のプロンプトは英語のまま使います。日本語に翻訳したプロンプトは、実行して検証していません。

アプリの意図的な欠陥と、依存関係のロックファイルは、そのまま保持しています。
