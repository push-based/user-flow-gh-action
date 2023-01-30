import { executeUFCI } from './executeUFCI';
import { expect, test } from '@jest/globals';
import { processParamsToParamsArray } from './utils';


describe('executeUFCI mock', () => {

  test('throws invalid number', async () => {
    const p = ({ rcPath: false } as unknown as any);
    expect(executeUFCI(p)).rejects.toEqual('rcPath not given');
  });

  test('is call with run inside', async () => {
    const rcPath = 'user-flowrc.json';
    const run = (bin: string, command: 'init' | 'collect', args: string[]) => {
      return `Execute CLI: npx @push-based/user-flow collect ${args.join(', ')}` as any;
    };

    const params =  { rcPath, verbose: true, dryRun: false } as unknown as any;
    const paramsFormatted =  processParamsToParamsArray({ rcPath });
    const res = await executeUFCI((params), run);
    expect(res).toBe(`Execute CLI: npx @push-based/user-flow collect ${paramsFormatted.join(', ')}`);
  });

});
