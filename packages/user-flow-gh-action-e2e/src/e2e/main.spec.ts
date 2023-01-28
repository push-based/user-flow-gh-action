import { expect, test } from '@jest/globals';
import * as core from '@actions/core';

import { REMOTE_PRJ_CFG, REMOTE_RC_JSON, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { withProject } from '../support/test-helper';

describe('main.js', () => {
  test('runs', withProject<any>({
    ...REMOTE_PRJ_CFG, env: {
      INPUT_RCPATH: REMOTE_RC_NAME
    }
  }, async (prj :any) => {
    const { stdout, stderr, exitCode } = await prj.exec();

    expect(stderr).toBe('');
    expect(stdout).toContain('Run main');
    expect(stdout).toContain('::set-output name=result-path::');
    const outputResult = readFileSync(join(REMOTE_RC_JSON.persist.outPath, readdirSync(REMOTE_RC_JSON.persist.outPath)[0])).toString();
    expect(outputResult).toContain('Navigation report (www.google.com/)');
    expect(exitCode).toBe(0);
  }), 180_000);

});
