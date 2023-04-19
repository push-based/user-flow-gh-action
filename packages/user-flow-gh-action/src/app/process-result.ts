import { readdirSync, readFileSync, rmSync } from 'fs';
import {join} from 'path';
import * as core from '@actions/core';

export function processResult(outPath: string): { resultPath: string, resultSummary: string } {

  const allResults = readdirSync(outPath);
  core.debug(`Output folder content: ${allResults.join(', ')}`);
  if(!allResults.length) {
    throw new Error(`No results present in folder ${outPath}`);
  }

  const resultPaths = allResults
    .filter((v) => v.endsWith('.md'))
    .map(p => join(outPath, p));

  core.debug(`Process results form: ${outPath}`);

  const resultSummary: string = resultPaths.map(resultPath => {
       return readFileSync(resultPath).toString();
  }).join(`

  ---

  `);

  core.debug(`Results: ${resultSummary}`);
  return { resultPath: outPath, resultSummary };
}
