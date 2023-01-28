import { GhActionInputs } from './types';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as core from '@actions/core';
import { readJsonFileSync } from './utils';

export function processResult(ghActionInputs: GhActionInputs): Record<string, string>[] {
  core.startGroup(`Process result`);
  const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
  const allResults = readdirSync(rcFileObj.persist.outPath);
  if (!allResults.length) {
    throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
  }
  const results = allResults
    .filter(f => f.endsWith('.md'))
    .reduce((res, filename) => {
      const resultPath = join(rcFileObj.persist.outPath, allResults[0]);
      core.debug(`Process results form: ${resultPath}`);
      res.push({ [filename]: readFileSync(resultPath, 'utf8').toString() });
      return res;
    }, []);
  core.debug(`Reduced results: ${Object.keys(results).join(', ')}`);
  core.endGroup();
  return results;
}
