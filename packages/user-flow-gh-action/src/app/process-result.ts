import { GhActionInputs } from './types';
import { RcJson, readRcConfig, createReducedReport } from '@push-based/user-flow';
import { readdirSync, readFileSync } from 'fs';
import * as core from '@actions/core';

export function processResult(ghActionInputs: GhActionInputs): string {
  core.startGroup(`Process result`);
  const rcFileObj: RcJson = readRcConfig(ghActionInputs.rcPath, { fail: true });
  const resultStr = readFileSync(readdirSync(rcFileObj.persist.outPath)[0]).toString();
  core.debug(`Processed results: ${resultStr}`);
  const reducedResult = JSON.stringify(createReducedReport(JSON.parse(resultStr)));
  core.debug(`Processed results: ${reducedResult}`);
  core.endGroup();
  return reducedResult;
}
