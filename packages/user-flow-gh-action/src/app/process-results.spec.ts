import { expect, test } from '@jest/globals';
import { join } from 'path';
import { CliProject } from '@push-based/node-cli-testing';
import { RcJson } from '@push-based/user-flow';
import { CliProjectFactory } from './get-inputs.spec';
import { processResult } from './process-result';
import { getReportContent, REMOTE_RC_NAME } from '@user-flow-gh-action-workspace/test-data';


const originalPath = process.cwd();
const rootFolder = 'user-flow-gh-action-e2e';
const rootPath = join(__dirname, '..', '..', '..', rootFolder);
let prj: CliProject<any>;
let rcPath: string;
const rcJsonWrong: RcJson = {
  persist: {
    outPath: 'invalid'
  }
} as any;
let prjCfgWrong = {
  root: rootPath,
  bin: '',
  rcFile: {
    [REMOTE_RC_NAME]: rcJsonWrong
  }
};

const rcJson: RcJson = {
  collect: {
    url: 'https://google.com'
  },
  persist: {
    outPath: 'measures'
  }
} as any;
let prjCfg = {
  root: rootPath,
  bin: '',
  rcFile: {
    [REMOTE_RC_NAME]: rcJson
  },
  create: { [join(rcJson.persist.outPath, 'lhr-9.json')]: getReportContent('lhr-9.json') },
  delete: [rcJson.persist.outPath]
};

/*
describe('processResults with wrong values', () => {

  beforeAll(async () => {
    prj = await CliProjectFactory.create(prjCfgWrong);
    prj.setup();
    rcPath = join(prj.root, REMOTE_RC_NAME);
    process.chdir(rootPath);
  });

  afterAll(async () => {
    prj.teardown();
    process.chdir(originalPath);
  });

  test('throws for invalid rcPath', async () => {
    const rcPath = 'invalid';
    expect(() => processResult({ rcPath, ...rcJsonWrong } as any)).toThrow(`no such file or directory, open '${rcPath}'`);
  });
  test('throws for invalid outPath', async () => {
    expect(() => processResult({ rcPath, persist: { outPath: 'invalid' } } as unknown as any))
      .toThrow(`ENOENT: no such file or directory, scandir '${rcJsonWrong.persist.outPath}'`);
  });

});

describe('processResults', () => {

  beforeAll(async () => {
    prj = await CliProjectFactory.create(prjCfg);
    prj.setup();
    rcPath = join(prj.root, REMOTE_RC_NAME);
    process.chdir(rootPath);
  });

  afterAll(async () => {
    prj.teardown();
    process.chdir(originalPath);
  });

  test('returns the reduced report as string', async () => {
   // expect(processResult({ rcPath, ...rcJson } as unknown as any)).toContain('| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |');
  });
});
*/
