import { expect, test } from '@jest/globals';
import { REMOTE_PRJ_CFG, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';
import { withProject } from '@push-based/node-cli-testing';

describe('main.js', () => {
  test('runs', withProject<any>({
    ...REMOTE_PRJ_CFG, env: {
      INPUT_RCPATH: REMOTE_RC_NAME
    }
  }, async (prj :any) => {
    process.chdir(prj.root);
    const { stdout, stderr, exitCode } = await prj.exec();


    expect(stdout).toContain('Run main');
    expect(stdout).toContain('Get inputs form action.yml');
    expect(stdout).toContain('Execute user-flow');
    expect(stdout).toContain('Validate results');
    expect(stdout).toContain('Process results');
    expect(exitCode).toBe(0);
  }), 180_000);

});
