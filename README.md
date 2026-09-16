# COLOR FIT

服のアイテムを長方形で表現し、トップス・パンツ・シューズ・アウターの配色を試せる静的Webサイトです。

## ローカルで確認する

`index.html` をブラウザで開くか、このフォルダでローカルサーバーを起動してください。

```sh
python3 -m http.server 8000
```

起動後、ブラウザで `http://localhost:8000` を開きます。画面全体から色を取得するスポイト機能は、HTTPSか対応ブラウザの安全なローカル環境でのみ動作します。

## GitHub Pagesで公開する

1. このフォルダのファイルをGitHubリポジトリの `main` ブランチへpushします。
2. GitHubのリポジトリ画面で **Settings → Pages** を開きます。
3. **Build and deployment** のSourceを **Deploy from a branch** にします。
4. Branchに `main`、フォルダに `/ (root)` を指定して保存します。

外部ライブラリやビルド処理は使用していないため、そのままGitHub Pagesで配信できます。
