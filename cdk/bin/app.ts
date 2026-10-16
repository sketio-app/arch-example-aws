import * as cdk from "aws-cdk-lib"
import { AppStack } from "../lib/app-stack"

const app = new cdk.App()
new AppStack(app, "ArchExample", { env: { region: "ap-northeast-1" } })
