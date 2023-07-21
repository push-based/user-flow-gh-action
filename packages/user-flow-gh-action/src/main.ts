import * as core from '@actions/core';
import {executeUFCI} from './app/executeUFCI';
import {getInputs} from './app/get-inputs';
import {existsSync, readdirSync, rmdirSync} from 'fs';
import {processResult} from './app/process-result';
import {GhActionInputs} from './app/types';
import {readJsonFileSync} from "./app/utils";



export async function run(): Promise<void> {
  core.debug(`Run user-flow login in main`);
  let ghActionInputs: GhActionInputs;
  let resultsOutPath: string | undefined = undefined;

  try {
    core.startGroup(`Get inputs form action.yml`);
    ghActionInputs = getInputs();
    core.endGroup();

    if(ghActionInputs.onlyComments) {
      core.debug(`Skip running tests. onlyComments is given`);
    } else {
    core.startGroup(`Execute user-flow`);
    // @TODO retrieve result instead of readdirSync(ghActionInputs.outPath)
    await executeUFCI(ghActionInputs);
    core.endGroup();
    }
    core.startGroup(`Validate results`);

    const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
    const { persist } = rcFileObj;
    const rcOutPath = persist.outPath;
    resultsOutPath = ghActionInputs.outPath || rcOutPath;

    const allResults = readdirSync(resultsOutPath);
    if (!allResults.length) {
      throw new Error(`No results present in folder ${resultsOutPath}`);
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
    const {resultSummary, resultPath} = processResult(resultsOutPath);
    // cleanup tmp folder
    if (existsSync(resultsOutPath)) {
      rmdirSync(resultsOutPath, {recursive: true});
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
