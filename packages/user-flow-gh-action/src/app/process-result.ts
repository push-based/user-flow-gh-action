import { GhActionInputs } from './types';
import { RcJson, readRcConfig, createReducedReport } from '@push-based/user-flow';
import { readdirSync, readFileSync } from 'fs';

export function processResult(ghActionInputs: GhActionInputs): string {
  const rcFileObj: RcJson = readRcConfig(ghActionInputs.rcPath, { fail: true });
  const result = JSON.parse(readFileSync(readdirSync(rcFileObj.persist.outPath)[0]).toString());
  return JSON.stringify(createReducedReport(result));
}
