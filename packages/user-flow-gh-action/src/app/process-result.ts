import { GhActionInputs } from './types';
import { userFlowReportToMdTable } from '@push-based/user-flow/src/lib/commands/assert/utils/md-table';
import { readdirSync, readFileSync } from 'fs';
import {join} from 'path';
import * as core from '@actions/core';
import { readJsonFileSync } from './utils';

export function processResult(ghActionInputs: GhActionInputs): string {
  core.startGroup(`Process result`);
  const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
  const allResults = readdirSync(rcFileObj.persist.outPath);
  if(!allResults.length) {
    throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
  }

  const resultPath = join(rcFileObj.persist.outPath,allResults[0]);
  core.debug(`Process results form: ${resultPath}`);
  const resultStr = readFileSync(resultPath).toString();
  const reducedResult = userFlowReportToMdTable(JSON.parse(resultStr));
  core.debug(`Reduced results: ${reducedResult}`);
  core.endGroup();
  return reducedResult;
}
