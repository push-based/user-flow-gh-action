import { expect, test } from '@jest/globals';
import { REMOTE_PRJ_CFG, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';
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
    expect(stdout).toContain('::set-output name=resultPath::');
    expect(stdout).toContain('::set-output name=resultSummary::');
    expect(exitCode).toBe(0);
  }), 180_000);

});
