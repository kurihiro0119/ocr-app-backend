# ベースイメージの指定
FROM node:20-alpine

# 作業ディレクトリの作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli

# アプリケーションのソースをコピー
COPY . .
COPY .env .env

# アプリケーションをビルド（必要な場合）
RUN npm run build

# ビルドファイルをコピー
COPY dist ./dist

# アプリケーションの起動コマンド
CMD ["node", "dist/main"]