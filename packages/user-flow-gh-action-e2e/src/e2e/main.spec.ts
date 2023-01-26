import { expect, test } from '@jest/globals';
import { RcJson } from '@push-based/user-flow';
import { CliProject } from '@push-based/node-cli-testing';
import { CliProjectFactory } from '../../../test-data/src/lib/cli-project-factory';
import { REMOTE_PRJ_CFG, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';

describe('main.js', () => {

  test('runs', async () => {
    let prj: CliProject<RcJson> = await CliProjectFactory.create<RcJson>({
      ...REMOTE_PRJ_CFG, env: {
        INPUT_RCPATH: REMOTE_RC_NAME
      }
    });
    prj.setup();

    const { stdout, stderr, exitCode } = await prj.exec();

    expect(stderr).toBe('');
    expect(stdout).toContain('Run main');
    expect(stdout).toContain('::set-output name=result::');
    const outputResult = process.env['OUTPUT_RESULT'];
    expect(outputResult).toContain('outputResult');
    expect(exitCode).toBe(1);
    prj.teardown();

  }, 180_000);

});
