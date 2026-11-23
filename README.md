# 煙管システムの導入と使い方

VRChatアバター用「煙管システム」の日本語説明書です。[説明書を開く](https://moffcovrc.github.io/KiseruSystem_Docs/)

初めての方は[購入前の確認と導入の準備](https://moffcovrc.github.io/KiseruSystem_Docs/docs/getting-ready/)、導入済みの方は[VRでの煙管の使い方](https://moffcovrc.github.io/KiseruSystem_Docs/docs/ritual/)からご覧ください。

このリポジトリは説明書専用です。Unityの製品ソース、Unitypackage、アバター、Scene、診断ログ、ユーザーの設定は含めません。

## ローカルで確認する

Node.js 24を使用します。

```sh
npm ci
npm run build
npm run check
npm run serve -- --port 4173
```

表示先は `http://localhost:4173/KiseruSystem_Docs/` です。ページを直接開く場合も、この配下のURLを使用します。停止はCtrl+Cです。

編集しながら表示する場合は `npm start` を使います。検索内容を更新するときは `node scripts/build-search.mjs` を実行します。本番ビルドでは自動で更新されます。

## 文章を編集する

本文は `docs/` のMarkdown、トップページは `src/pages/index.jsx`、色や余白は `src/css/custom.css` です。Unity画面のボタン名は実装の表記を維持してください。

画像を追加する場合は `static/img/` へ、公開する権利のある画像だけを入れます。現在のSVGは本サイト用のオリジナル図案で、製品形状を示す設計図ではありません。

### VR撮影素材

表紙と「VRでの煙管の使い方」には、VRChatで撮影したアバターの写真と動画の切り出しを使用しています。掲載画像は `static/img/ritual/` のWebPです。表紙は4:5、取り出しと煙草を詰める写真は1:1、それ以外は16:9です。掲載写真のファイル名・用途・代替テキストは `docs/ritual.md` にあります。

取り出しの写真は、通常操作で道具が現れ、手を懐から離す流れです。判定内でONにしてから再接触する例は未収録です。「VRでの煙管の使い方」と「VRで持ち方と操作を確認する」には、くわえた直後、煙草玉を載せた時、火のついたマッチを運ぶ時の本人視点を掲載しています。点火後に赤く光った火皿は横からの写真です。

## 名前を後から変更する

`site.config.json` の次の値を編集します。

| 設定 | 反映される場所 |
| --- | --- |
| `title` | サイト全体の名前 |
| `productName` | ナビゲーションの製品名 |
| `tagline` | サイトの説明 |
| `organizationName` | GitHubアカウント、公開先ホスト |
| `projectName` | リポジトリ名、公開URLのパス |
| `version` | 対応している製品のバージョン |

見出しや本文はMarkdownから自由に変更できます。リポジトリを改名する場合はGitHub側の名前も変更し、`projectName`、Gitのremote、READMEのプレビューURL、外部の案内リンクを更新して再公開します。GitHub Pagesの旧URLは、リポジトリの転送と同じようには転送されません。

## GitHub Pagesに公開する

1. 説明書だけを入れる公開リポジトリ `KiseruSystem_Docs` を作成します。
2. **このフォルダの公開対象ファイルのみ**をそのリポジトリへ登録します。既存の製品リポジトリの公開設定は変更しません。
3. GitHubの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にします。
4. `main` へpushします。必要ならActionsの「Publish documentation」を手動実行します。
5. Actionsのビルドと公開が完了したら、PagesのURLで確認します。

`node_modules/`、`build/`、`.docusaurus/`、`verification/`は登録しません。`package-lock.json`は登録します。サイトは静的ファイルで動作し、外部フォント・アクセス解析・ログのアップロード・製品ダウンロード機能は使用しません。

公開先は[煙管システムの導入と使い方](https://moffcovrc.github.io/KiseruSystem_Docs/)です。

## 英語版を追加するとき

現在は日本語のみです。Docusaurusのi18n設定へ `en` を追加し、翻訳した本文とUIを用意してから言語切替を表示します。未翻訳の切替ボタンは表示しません。

## 検証

`npm run build` はMarkdownリンクとサイト内リンクの欠落をエラーにします。`npm run check` は生成ページのローカル参照、検索対象、日本語設定、公開ソースへの製品ファイル・個人パス混入を確認します。自動検査に加えて、公開前に本文・画像・ファイル一覧を確認してください。

Chromeをインストールした環境では、上記のポート4173でプレビューを起動し、別のターミナルから `npm run check:browser` を実行できます。デスクトップとスマートフォン幅、検索、テーマ切替、メニュー操作を確認し、スクリーンショットをローカルの `verification/` に保存します。

参考: [Docusaurusの公開手順](https://docusaurus.io/docs/deployment)、[GitHubのリポジトリ名変更](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)。
