import * as core from '@actions/core';
import { executeUFCI } from './app/executeUFCI';
import { getInputs } from './app/get-inputs';
import { readJsonFileSync } from './app/utils';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { processResult } from './app/process-result';
import { GhActionInputs } from './app/types';

export async function run(): Promise<void> {
  core.debug(`Run main`);

  core.startGroup(`Get inputs form action.yml`);
  let ghActionInputs: GhActionInputs | undefined = undefined;
  ghActionInputs = getInputs();
  core.endGroup();

  core.startGroup(`Execute user-flow`);
  // @TODO retrieve result
  await executeUFCI(ghActionInputs);
  core.endGroup();

  core.startGroup(`Validate results`);
  let resPath = '';
  const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
  const allResults = readdirSync(rcFileObj.persist.outPath);
  if (!allResults.length) {
    throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
  }
  resPath = join(rcFileObj.persist.outPath, allResults[0]);
  core.endGroup();

  core.startGroup(`Process results`);
  const { resultSummary } = processResult(ghActionInputs);
  core.setOutput('resultPath', resPath);
  core.setOutput('resultSummary', resultSummary);
  core.endGroup();

}

function exit(error: any) {
  if (error instanceof Error) {
    throw new Error('error.message');
    core.setFailed(error.message);
    process.exitCode = 1;
    process.exit(1);
  }
}

run().catch((err) => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`));
