import {executeUFCI} from './executeUFCI';
import {expect, test} from '@jest/globals';
import {processParamsToParamsArray} from './utils';
import {withProject} from '@push-based/node-cli-testing';
import {DEFAULT_RC_NAME} from '@push-based/user-flow';
import {join} from "path";

const rootFolder = 'user-flow-gh-action-e2e';
const rootPath = join(__dirname, '..', '..', '..', rootFolder);
const RcJSON = {
  collect: {
    url: 'test'
  }
};
const prjCfg = {
  root: rootPath,
  bin: '',
  rcFile: {
    [DEFAULT_RC_NAME]: RcJSON
  }
};

describe('executeUFCI mock', () => {

  test('is call with run inside', withProject(prjCfg, async () => {
    const rcObj = {
        "url": "https://google.com",
        "ufPath": "./user-flows",

        "outPath": "./packages/user-flow-gh-action-e2e/measures",
        "format": [
          "md"
        ]
    };
    const run = (bin: string, args: string[]) => {
      return `Execute CLI: npx @push-based/user-flow collect ${args.join(', ')}` as any;
    };

    const params = {...rcObj, verbose: true, dryRun: false} as unknown as any;
    const res = await executeUFCI((params), run);
    const paramsFormatted = processParamsToParamsArray({...rcObj, verbose: true, dryRun: false, format: ['md']});
    expect(res).toBe(`Execute CLI: npx @push-based/user-flow collect ${paramsFormatted.join(', ')}`);
  }));
  test('respects custom script', withProject(prjCfg, async () => {
    const rcObj = {
      "url": "https://google.com",
      "ufPath": "./user-flows",

      "outPath": "./packages/user-flow-gh-action-e2e/measures",
      "format": [
        "md"
      ]
    };
    const run = (bin: string, args: string[]) => {
      return `Execute CLI: npx @push-based/user-flow collect ${args.join(', ')}` as any;
    };

    const params = {...rcObj, verbose: true, dryRun: false, customScript: 'custom script'} as unknown as any;
    const res = await executeUFCI((params), run);
    expect(res).toContain(`custom script`);
  }));

});
