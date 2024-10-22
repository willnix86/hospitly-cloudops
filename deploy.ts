import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const lambda = new AWS.Lambda();

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
    await lambda.updateFunctionCode(params).promise();
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