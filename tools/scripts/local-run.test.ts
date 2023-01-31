/**
 * This file is here to test all cases in a locally executed setup
 * For now just a hack to test GH action output
 */


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
 *   run: ts-node local.run.ts --rp=${{ steps.localRun.outputs.resultPath }} --r=${{ steps.localRun.outputs.resultSummary }}
 * ```
 */
// @TODO retrieve from file
const resultPathExpected = 'user-flow-gh-action-e2e';
const resultPath = process.argv[2];

console.log(`resultPath: ${resultPath}`);
if(!resultPath.includes(resultPathExpected)) {
  throw new Error(`wrong resultPath expected: ${resultPathExpected} received: ${resultPath}`);
}

const date = resultPath.split('-').pop().split('.').shift();
const y = date.slice(0,4);
const m = date.slice(4,6);
const d = date.slice(6,8);
const resultSummaryExpected = `Date/Time: ${y}-${m}-${d}`;
const resultSummary = process.argv[3];
console.log(`resultSummaryExpected: ${resultSummary}`);
if(!resultSummary.includes(resultSummaryExpected)) {
  throw new Error(`wrong resultSummary expected: ${resultSummaryExpected} received: ${resultSummary}`);
}
