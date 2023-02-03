import * as core from '@actions/core';
import { executeUFCI } from './app/executeUFCI';
import { getInputs } from './app/get-inputs';
import { readJsonFileSync } from './app/utils';
import { readdirSync, readFileSync } from 'fs';
import { join } from "path";
import { processResult } from './app/process-result';

export async function run(): Promise<void> {
  core.debug(`Run main`);
  try {
    const ghActionInputs = getInputs()
    core.debug(`ghActionInputs are ${JSON.stringify(ghActionInputs)}`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    // @TODO retrieve result
    await executeUFCI(ghActionInputs);

    const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
    const allResults = readdirSync(rcFileObj.persist.outPath);
    if(!allResults.length) {
      throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
    }

    const resPath = join(rcFileObj.persist.outPath,allResults[0]);
    core.setOutput('resultPath', resPath);
    const { resultSummary } = processResult(ghActionInputs);
    core.setOutput('resultSummary', resultSummary);

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
    process.exitCode = 1;
    process.exit(1)
  }
}

run().catch((err) => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`))
