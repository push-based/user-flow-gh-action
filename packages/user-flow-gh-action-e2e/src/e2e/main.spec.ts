import { expect, test } from '@jest/globals';
import {REMOTE_PRJ_CFG, REMOTE_RC_JSON, REMOTE_RC_NAME} from '@user-flow-gh-action-workspace/test-data';
import { withProject } from '@push-based/node-cli-testing';

describe('main.js', () => {

  test('runs', withProject<any>({
    ...REMOTE_PRJ_CFG, env: {
      INPUT_RCPATH: REMOTE_RC_NAME,
      INPUT_URL: 'https://google.com',
      INPUT_FORMAT: 'html,json'
    }
  }, async (prj :any) => {
    const { stdout, _, exitCode } = await prj.exec();

    expect(stdout).toContain('Run user-flow login in main');
    expect(stdout).toContain('Get inputs form action.yml');
    expect(stdout).toContain('onlyComments is false');
    expect(stdout).toContain('Execute user-flow');
    expect(stdout).toContain('--format=md');
    expect(stdout).toContain('--url=https://google.com');
    //expect(stdout).toContain('--format=html');
    //expect(stdout).toContain('--format=json');
    expect(stdout).toContain('Validate results');
    expect(stdout).toContain('Process results');
    expect(exitCode).toBe(0);
  }), 180_000);


  test('runs only comment if onlyComments is given', withProject<any>({
    ...REMOTE_PRJ_CFG,
    create: {
      ...REMOTE_PRJ_CFG.create,
      // onlyComments assumes a result is already there
      [REMOTE_RC_JSON.persist.outPath+'/flow.uf.md']: 'flowcontent',
    },
    env: {
      INPUT_ONLYCOMMENTS: "on",
      INPUT_RCPATH: REMOTE_RC_NAME,
      INPUT_URL: 'https://google.com',
      INPUT_FORMAT: 'html,json'
    }
  }, async (prj :any) => {
    const { stdout, stderr, exitCode } = await prj.exec();

    expect(stdout).toContain('Run user-flow login in main');
    expect(stdout).toContain('Get inputs form action.yml');
    expect(stdout).toContain('onlyComments is true');
    expect(stdout).not.toContain('Execute user-flow');
    expect(stdout).not.toContain('--format=md');
    expect(stdout).not.toContain('--url=https://google.com');
    expect(stdout).toContain(`Skip running tests. onlyComments is given`);
    expect(stdout).toContain('Validate results');

    expect(stdout).toContain('Process results');
    expect(exitCode).toBe(0);
  }), 180_000);


});
