import { executeUFCI } from './executeUFCI';
import { expect, test } from '@jest/globals';


describe('executeUFCI mock', () => {

  test('throws invalid number', async () => {
    const p = ({ rcPath: false } as unknown as any);
    expect(executeUFCI(p)).rejects.toEqual('rcPath not given');
  });

  test('is call with run inside', async () => {
    const rcPath = 'user-flowrc.json';
    const run = (...args: any) => {
      return `bin is ${JSON.stringify(args[0])} command is collect param is ${JSON.stringify(args[2])}` as any;
    };
    const res = await executeUFCI(({ rcPath } as unknown as any), run);
    expect(res).toBe(`bin is "npx @push-based/user-flow" command is collect param is ["--rcPath=${rcPath}"]`);
  });

});
