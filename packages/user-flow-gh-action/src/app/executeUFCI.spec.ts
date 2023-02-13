import { executeUFCI } from './executeUFCI';
import { expect, test } from '@jest/globals';
import { processParamsToParamsArray } from './utils';
import { withProject } from '@push-based/node-cli-testing';
import { DEFAULT_RC_NAME } from '@push-based/user-flow';
import { join } from "path";

const rootFolder = 'user-flow-gh-action-e2e';
const rootPath = join(__dirname,'..','..','..',rootFolder);
const RcJSON = {
  collect: {
    url: 'test'
  }
};
let prjCfg = {
  root: rootPath,
  bin: '',
  rcFile: {
    [DEFAULT_RC_NAME]: RcJSON
  }
};

describe('executeUFCI mock', () => {

  test('throws invalid number', async () => {
    const p = ({ rcPath: false } as unknown as any);
    expect(executeUFCI(p)).rejects.toEqual(`rcPath ${p} not given`);
  });

  test('is call with run inside', withProject(prjCfg ,async () => {
    const rcPath = '.user-flowrc.json';
    const run = (bin: string, command: 'init' | 'collect', args: string[]) => {
      return `Execute CLI: npx @push-based/user-flow collect ${args.join(', ')}` as any;
    };

    const params =  { rcPath, verbose: true, dryRun: false } as unknown as any;
    const res = await executeUFCI((params), run);
    const paramsFormatted =  processParamsToParamsArray({ rcPath, verbose: true, dryRun: false, format: ['md'] });
    expect(res).toBe(`Execute CLI: npx @push-based/user-flow collect ${paramsFormatted.join(', ')}`);
  }));

});
