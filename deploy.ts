import { Lambda } from '@aws-sdk/client-lambda';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const lambda = new Lambda({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const functions = ['userService', 'tenantService', 'schedulingService'];

async function deployLambda(functionName: string) {
  const zipFilePath = path.join(__dirname, `dist/${functionName}/index.js`);
  
  if (!fs.existsSync(zipFilePath)) {
    console.error(`File not found: ${zipFilePath}`);
    return;
  }

  const zipFile = fs.readFileSync(zipFilePath);

  const params = {
    FunctionName: `${process.env.STAGE}-${functionName}`,
    ZipFile: zipFile,
  };

  try {
    await lambda.updateFunctionCode(params);
    console.log(`Successfully deployed ${functionName}`);
  } catch (error) {
    console.error(`Error deploying ${functionName}:`, error);
  }
}

async function deployAll() {
  for (const func of functions) {
    await deployLambda(func);
  }
}

deployAll();