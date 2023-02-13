import { expect, test } from '@jest/globals';
import { REMOTE_PRJ_CFG, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';
import { withProject } from '@push-based/node-cli-testing';

describe('main.js', () => {
  test('runs', withProject<any>({
    ...REMOTE_PRJ_CFG, env: {
      INPUT_RCPATH: REMOTE_RC_NAME,
      INPUT_FORMAT: 'html,json'
    }
  }, async (prj :any) => {
    const { stdout, stderr, exitCode } = await prj.exec();


    expect(stdout).toContain('Run main');
    expect(stdout).toContain('Get inputs form action.yml');
     expect(stdout).toContain('html');
     expect(stdout).toContain('json');
     expect(stdout).toContain('md');
    expect(stdout).toContain('Execute user-flow');
    expect(stdout).toContain('Validate results');
    expect(stdout).toContain('Process results');
    expect(stderr).toBe('');
    //expect(exitCode).toBe(0);
  }), 180_000);

});
