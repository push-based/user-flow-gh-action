import { expect, test } from '@jest/globals';
import { existsSync } from 'fs';
import { processResult } from './process-result';
import { withProject } from '@push-based/node-cli-testing';
import {
  getReportContent,
  REMOTE_PRJ_CFG,
  REMOTE_RC_JSON
} from '@user-flow-gh-action-workspace/test-data';
import { join } from 'path';

const reportPath = (rcJson, path) => join(rcJson.persist.outPath, path);
const lhr9MdName = 'lhr-9_reduced.md';
const lhr9MdName2 = 'lhr-9_reduced-2.md';
const lhr9MdPath = reportPath(REMOTE_RC_JSON, lhr9MdName);
const lhr9MdPath2 = reportPath(REMOTE_RC_JSON, lhr9MdName2);
const lhr9Md = getReportContent(lhr9MdName);
const lhr9Md2 = getReportContent(lhr9MdName2);


const cwd = process.cwd();

describe('process-results', () => {

  test('runs after CLI execution', withProject<any>({
    ...REMOTE_PRJ_CFG,
    create: {
      [REMOTE_RC_JSON.collect.ufPath]: undefined,
      [REMOTE_RC_JSON.persist.outPath]: undefined,
      [lhr9MdPath]: lhr9Md,
      [lhr9MdPath2]: lhr9Md2
    },
    delete: REMOTE_PRJ_CFG.delete.concat([lhr9MdPath, REMOTE_RC_JSON.persist.outPath])
  }, async (prj) => {
    process.chdir(REMOTE_PRJ_CFG.root);

    expect(existsSync(lhr9MdPath)).toBeTruthy();

    const { resultPath, resultSummary } = processResult(REMOTE_RC_JSON.persist.outPath);
    expect(resultPath).toContain(REMOTE_RC_JSON.persist.outPath);
    expect(resultSummary).toContain('Navigation report (127.0.0.1/)');

    process.chdir(cwd);
  }), 180_000);

});
