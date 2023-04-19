import * as core from '@actions/core';
import { executeUFCI } from './app/executeUFCI';
import { getInputs } from './app/get-inputs';
import { readJsonFileSync } from './app/utils';
import {existsSync, readdirSync, rmdirSync} from 'fs';
import { join } from 'path';
import { processResult } from './app/process-result';
import { GhActionInputs } from './app/types';

export async function run(): Promise<void> {
  core.debug(`Run main`);
  let ghActionInputs: GhActionInputs;
  const outPath = "./user-flow-gh-tmp";
  try {
    core.startGroup(`Get inputs form action.yml`);
    ghActionInputs = getInputs();
    ghActionInputs.outPath = outPath;
    core.endGroup();

    core.startGroup(`Execute user-flow`);
    // @TODO retrieve result
    await executeUFCI(ghActionInputs);
    core.endGroup();

    core.startGroup(`Validate results`);
    const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
    const allResults = readdirSync(outPath);
    if (!allResults.length) {
      throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
    }

    core.endGroup();
  } catch (error) {
    if (error instanceof Error) {
      core.debug(`Error in main ${error}`)
    }
    process.exitCode = 1;
    process.exit(1);
  }

  try {

    core.startGroup(`Process results`);
    const { resultSummary, resultPath } = processResult(outPath);
    // cleanup tmp folder
    if(existsSync(outPath)) {
      rmdirSync(outPath);
    }

    core.setOutput('resultPath', resultPath);
    core.setOutput('resultSummary', resultSummary);
    core.endGroup();
  } catch (error) {
    if (error instanceof Error) {
      core.debug(`Error in processResult ${error}`)
    }
    process.exitCode = 1;
    process.exit(1);
  }
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
