import { Lambda, CreateFunctionCommandInput, UpdateFunctionCodeCommandInput } from '@aws-sdk/client-lambda';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import JSZip from 'jszip';

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
  const jsFilePath = path.join(__dirname, `dist/${functionName}/index.js`);
  
  if (!fs.existsSync(jsFilePath)) {
    console.error(`File not found: ${jsFilePath}`);
    return;
  }

  // Create a new zip file
  const zip = new JSZip();
  zip.file('index.js', fs.readFileSync(jsFilePath));
  const zipBuffer = await zip.generateAsync({type: 'nodebuffer'});

  const fullFunctionName = `${process.env.STAGE}-${functionName}`;

  try {
    // Try to get the function
    await lambda.getFunction({ FunctionName: fullFunctionName });

    const updateParms: UpdateFunctionCodeCommandInput = {
      FunctionName: fullFunctionName,
      ZipFile: zipBuffer,
    };
    
    // If the function exists, update its code
    await lambda.updateFunctionCode(updateParms);
    console.log(`Successfully updated ${fullFunctionName}`);
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'ResourceNotFoundException') {
      // If the function doesn't exist, create it
      const createParams: CreateFunctionCommandInput = {
        FunctionName: fullFunctionName,
        Code: { ZipFile: zipBuffer },
        Handler: 'index.handler',
        Role: process.env.LAMBDA_EXECUTION_ROLE,
        Runtime: 'nodejs20.x',
      };

      await lambda.createFunction(createParams);
      console.log(`Successfully created ${fullFunctionName}`);
    } else {
      console.error(`Error deploying ${fullFunctionName}:`, error);
    }
  }
}

async function deployAll() {
  for (const func of functions) {
    await deployLambda(func);
  }
}

deployAll();