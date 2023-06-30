import { expect, test } from '@jest/globals';
import { REMOTE_PRJ_CFG, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';
import { withProject } from '@push-based/node-cli-testing';

describe('main.js', () => {

  test('runs', withProject<any>({
    ...REMOTE_PRJ_CFG, env: {
      INPUT_CUSTOMSCRIPT: "npx @push-based/user-flow",
      INPUT_RCPATH: REMOTE_RC_NAME,
      INPUT_URL: 'url',
      INPUT_FORMAT: 'html,json'
    }
  }, async (prj :any) => {
    const { stdout, stderr, exitCode } = await prj.exec();

    expect(stdout).toContain('Run main');
    expect(stdout).toContain('CLI over custom script:');
    expect(stdout).toContain('Get inputs form action.yml');
    expect(stdout).toContain('Execute user-flow');
    expect(stdout).toContain('--format=md');
    expect(stdout).toContain('--url=url');
    //expect(stdout).toContain('--format=html');
    //expect(stdout).toContain('--format=json');
    expect(stdout).toContain('Validate results');
    expect(stdout).toContain('Process results');
    expect(exitCode).toBe(0);
  }), 180_000);

});
