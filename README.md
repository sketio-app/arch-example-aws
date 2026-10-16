# arch-example-aws

[日本語](#日本語) | [English](#english)

## 日本語

[Sketio Arch](https://arch.sketio.app) のパーサー検証用サンプルです。実際に動くアプリではなく、同じ AWS の構成を 3 通りの書き方で書いた見本です。

構成は、API Gateway（HTTP API）から Lambda を呼び、Lambda が DynamoDB に書き、S3 から読み、SQS に送ります。

| 書き方 | 場所 |
|---|---|
| Terraform（HCL） | `terraform/main.tf` |
| AWS CDK（TypeScript のソースだけ。`cdk.out` は含まない） | `cdk/` |
| AWS SAM | `sam/template.yaml` |

Lambda のコードは `src/api/index.ts` です（3 通りとも同じものを使います）。`npm run build` で `dist/api/` に出力します。

3 通りで、リソースの名前をそろえています（`Uploads`（S3）、`Orders`（DynamoDB）、`Jobs`（SQS）、`Api`（Lambda）、HTTP API）。Terraform のラベルは小文字です（`uploads` `orders` `jobs` `api`）。

`.sketio.yml` で `ai.enabled: true` にしてあります。静的に読めないファイルは、Arch の AI が読んで補います。

ライセンスは MIT です。

## English

A sample for testing the parsers of [Sketio Arch](https://arch.sketio.app). It is not a working app; it is a reference showing the same AWS setup written in three ways.

The setup: an API Gateway (HTTP API) calls a Lambda function, which writes to DynamoDB, reads from S3 and sends to SQS.

| Way of writing it | Where |
|---|---|
| Terraform (HCL) | `terraform/main.tf` |
| AWS CDK (TypeScript source only; no `cdk.out`) | `cdk/` |
| AWS SAM | `sam/template.yaml` |

The Lambda code is `src/api/index.ts`, shared by all three. `npm run build` writes it to `dist/api/`.

The three use the same resource names (`Uploads` (S3), `Orders` (DynamoDB), `Jobs` (SQS), `Api` (Lambda), the HTTP API). The Terraform labels are lowercase (`uploads`, `orders`, `jobs`, `api`).

`.sketio.yml` sets `ai.enabled: true`, so Arch's AI reads the files the static parsers cannot.

MIT licensed.
