import { GhActionInputs } from './types';
import { RcJson, readRcConfig } from '@push-based/user-flow';
import { userFlowReportToMdTable } from '@push-based/user-flow/src/lib/commands/assert/utils/md-table';
import { readdirSync, readFileSync } from 'fs';
import {join} from 'path';
import * as core from '@actions/core';

export function processResult(ghActionInputs: GhActionInputs): string {
  core.startGroup(`Process result`);
  const rcFileObj: RcJson = readRcConfig(ghActionInputs.rcPath, { fail: true });
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
