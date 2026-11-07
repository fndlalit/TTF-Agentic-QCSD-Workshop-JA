# トラブルシューティング

[LAB.md](./LAB.md) の短い注記の詳細です。ワークショップの実行にこの内容は必要ありません。次のどれかに当たって、理由を知りたい方のために置いています。

## `aqe learning import` は、成功しても失敗しても同じ出力になる

import は、いつも次の形の出力で終わります。

```
  Total patterns: 6
  Imported: 0
  Skipped: 6
```

CLI は、オプションの ANN インデックスを開けないときは常にパターンを「skipped」と数えます。権威あるストアである SQLite が書き込みを受け付けた場合も同じです。そのため、`Imported: 0` からは、成功したかどうかは分かりません。

確実な確認方法は `aqe learning stats` です。

- **`Total: 0`**: embedder がなく、何も保存されていません。インストールするまで保存されません。README のセットアップのステップ5を確認し、import をやり直してください。
- **`Total: 28`**: 成功していますが、ベースが小さい状態です。`aqe learning stats` を、embedder のインストール前に一度実行したため、AQE の1回限りのドメイン横断シードを使い切っています。AQE の基礎パターン22件に、今回の6件が加わった状態です。演習5は、記載どおりに動きます。
- **`Total: 76`**: 成功しています。AQE 自身の基礎パターンに、今回の6件を加えた数です。import を再実行しないでください。演習が学びを保存するたびに、合計は増えます。

3つのケースはすべて、このリポジトリで agentic-qe 3.14.1 と 3.14.8（embedder あり、削除、後から追加）で確認しました。76 のケースは、3.15.18 でも再確認しています（2026年11月6日）。

## `[VectorSearch] WARN: semantic vector search is not active`

AQE 3.15 以降では、embedder をインストールしていても、`aqe learning stats` と、ベクトルインデックスを最初に開くコマンドが、この1行を表示することがあります。オプションの近似最近傍インデックスが、埋め込みランタイムの初期化前に開かれたため、AQE はそれを開かないままにして、SQLite を検索するという意味です。パターンは、どちらの場合も384次元の埋め込みとともに保存されています。確認方法は変わりません。シードの import 後に `aqe learning stats` が `Total: 76` なら、セットアップは成功です。agentic-qe 3.15.18 で、2026年11月6日に確認しました。同じ日の Claude Code での演習5は、保存済みの4パターンを想起しました。

## `VECTOR_SPACE_UNVERIFIED` と `brain.rvf`

ネイティブの RuVector の来歴情報がないと、永続ベクトルインデックスは未検証のままになり、AQE は SQLite にフォールバックします。SQLite が権威あるストアなので、パターンは保存されています。省略されるのは、近似最近傍インデックスだけです。`.agentic-qe/` の中の `brain.rvf.corrupt-NNNN` ファイルは、隔離された空のインデックスで、失われたデータではありません。

## Claude 以外のエージェントでの MCP ツール経由のメモリ

Claude Code は、ReasoningBank フックで学びを記録し、想起します。他のエージェントは `memory_store` / `memory_query` MCP ツールを使います。3.14.1 では、この往復は信頼できませんでした。`memory_store` が応答を返さずに書き込むことがあり、`memory_retrieve` がキーを読み戻せないことがあります。これらのツールで演習5を行うには、シードを読み込み、`aqe learning stats` が 76 であることを確認するのが、サポートされた方法です。

## `npm install -g agentic-qe@latest` または `aqe init --auto` が失敗する

- **まず Node のバージョン。** `node -v` を実行してください。AQE は `node >= 22.13` を要求します。セッションのページには Node 20 と書かれていますが、Node 20 では `EBADENGINE` の警告が出て（ネイティブビルドも遅くなり）、サポート対象外です。Node 22 LTS 以上をインストールし、新しいターミナルを開いて、再実行してください。
- **グローバルインストールで `EACCES` または `permission denied` が出る。** 代わりに、ご自身のフォルダにインストールします。

  ```bash
  mkdir -p ~/.npm-global
  npm config set prefix ~/.npm-global
  export PATH=~/.npm-global/bin:$PATH
  npm install -g agentic-qe@latest
  ```

  `export PATH=...` の行は、`~/.zshrc` または `~/.bashrc` に追加してください。
- **社内プロキシや会場の Wi-Fi。** `npm config set proxy` と `https-proxy` を設定するか、[docs/DEVCONTAINER.md](./docs/DEVCONTAINER.md) の Codespaces を使ってください。
- Linux では、agentic-qe 3.15.6 で Node 20、22、24、3.15.18 で Node 22 のクリーンインストールと `aqe init --auto` が成功しました。お使いの PC での失敗は、ほとんどが上の3つのどれかです。エラーの最初の数行を、ファシリテーターに見せてください。

## カバレッジが約 38% と表示される

クローンが、テスト範囲の修正より前のものです。AQE 自身のスキャフォールディングが分母に入っています。`git pull` して、`npm run test:coverage` を再実行してください。アプリ全体は **61.62%**、`src/lib/payment-retry.ts` はステートメント 100%、ブランチ 97.29% と表示されます。
