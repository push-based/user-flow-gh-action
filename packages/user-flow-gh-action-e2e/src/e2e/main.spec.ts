import { expect, test } from '@jest/globals';
import { RcJson } from '@push-based/user-flow';
import { CliProject, ProjectConfig } from '@push-based/node-cli-testing';
import { CliProjectFactory } from '../../../test-data/src/lib/cli-project-factory';
import { REMOTE_PRJ_CFG, REMOTE_RC_JSON, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

function withProject<T extends ProjectConfig<T>>(cfg: T, fn: (prj: CliProject<T>) => void): () => Promise<void> {
  return async () => {
    let prj: CliProject<T> = await CliProjectFactory.create<T>(cfg);
    prj.setup();
    await fn(prj);
    prj.teardown();
  }
}

describe('main.js', () => {
  test('runs', withProject<any>({
    ...REMOTE_PRJ_CFG, env: {
      INPUT_RCPATH: REMOTE_RC_NAME
    }
  }, async (prj) => {
    const { stdout, stderr, exitCode } = await prj.exec();

    expect(stderr).toBe('');
    expect(stdout).toContain('Run main');
    expect(stdout).toContain('::set-output name=result::');
    const outputResult = readFileSync(join(REMOTE_RC_JSON.persist.outPath, readdirSync(REMOTE_RC_JSON.persist.outPath)[0])).toString();
    expect(outputResult).toContain('Navigation report (www.google.com/)');
    expect(exitCode).toBe(0);
  }), 180_000);

});
