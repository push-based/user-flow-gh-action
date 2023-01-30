import * as core from '@actions/core';
import { executeUFCI } from './app/executeUFCI';
import { getInputs } from './app/get-inputs';
import { readJsonFileSync } from './app/utils';
import { readdirSync, readFileSync } from 'fs';
import { join } from "path";
import { processResult } from './app/process-result';

// 1. get inputs form action
// 2. execute CLI
//     2.1. process result
//     2.2. persist result
// 3. handle comments
export async function run(): Promise<void> {
  core.debug(`Run main`);
  try {
    const ghActionInputs = getInputs()
    core.debug(`ghActionInputs are ${JSON.stringify(ghActionInputs)}`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    const executeUFCIRes = await executeUFCI(ghActionInputs);

    const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
    const allResults = readdirSync(rcFileObj.persist.outPath);
    if(!allResults.length) {
      throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
    }

    const resultPath = join(rcFileObj.persist.outPath,allResults[0]);
    core.setOutput('resultPath', resultPath);
    const resultSummary = processResult(ghActionInputs);
    core.setOutput('resultSummary', resultSummary);

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
    process.exitCode = 1;
    process.exit(1)
  }
}

run().catch((err) => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`))
