/**
 * This file is here to test all cases in a locally executed setup
 * For now just a hack to test GH action output
 */


import {readdirSync, readFileSync} from "fs";
import {join} from "path";

/**
 * GH Action Output's
 *
 * 1. We assume that the action was executed in a step called "localRun".
 * ```yml
 * - name: Run test user-flow-gh-action locally
 *   id: localRun #The naming is important as it is used later
 *   uses: ./
 *   with:
 *     rcPath: ./.user-flowrc.json
 * ```
 *
 * 2. In addition to that we assume that this script is called in the following way in the following sep:
 * ```yml
 * - name: Test the action output
 *   run: ts-node local.run.ts --rp=${{ steps.localRun.outputs.result-path }} --r=${{ steps.localRun.outputs.results }}
 * ```
 */
// @TODO retrieve from file
const resultPathExpected = 'user-flow-gh-tmp';
/*
console.log(`resultPath: ${resultPath}`);
if(!resultPath.includes(resultPathExpected)) {
  throw new Error(`wrong resultPath expected: ${resultPathExpected} received: ${resultPath}`);
}
*/

const resultSummaryExpected = `Date/Time: **`;
const resultSummary = process.argv[2];
console.log(`resultSummaryExpected: ${resultSummary}`);
const hits = resultSummary.match(/`${resultSummaryExpected}`/gm).length;
if(hits <= 1) {
  throw new Error(`wrong resultSummary expected 2 matches for: ${resultSummaryExpected} received: ${hits}`);
  process.exitCode = 1;
  process.exit(1);
}
