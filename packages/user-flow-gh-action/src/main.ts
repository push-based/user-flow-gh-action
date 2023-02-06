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
  let error = undefined;

  core.startGroup(`Get inputs form action.yml`);
  let ghActionInputs: GhActionInputs | undefined = undefined;
  try {
    ghActionInputs = getInputs();
    core.debug(`ghActionInputs are ${JSON.stringify(ghActionInputs)}`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
  } catch (e) {
    error = e;
  } finally {
    core.endGroup();
    exit(error);
  }

  core.startGroup(`Execute user-flow`);
  try {
    // @TODO retrieve result
    await executeUFCI(ghActionInputs);
  } catch (e) {
    error = e;
  } finally {
    core.endGroup();
    exit(error);
  }

  core.startGroup(`Validate results`);
  let resPath = '';
  try {
    const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
    const allResults = readdirSync(rcFileObj.persist.outPath);
    if (!allResults.length) {
      throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
    }
    resPath = join(rcFileObj.persist.outPath, allResults[0]);
  } catch (e) {
    error = e;
  } finally {
    core.endGroup();
    exit(error);
  }

  core.startGroup(`Process results`);
  try {
    const { resultSummary } = processResult(ghActionInputs);
    core.setOutput('resultPath', resPath);
    core.setOutput('resultSummary', resultSummary);
  } catch (e) {
    error = e;
  } finally {
    core.endGroup();
    exit(error);
  }

}

function exit(error: any) {
  if (error instanceof Error) core.setFailed(error.message);
  process.exitCode = 1;
  process.exit(1);
}

run().catch((err) => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`));
