import { GhActionInputs } from './types';
import { runChildCommand } from './run-child-command';
import { processParamsToParamsArray } from '@push-based/node-cli-testing';

export async function executeUFCI(
  ghActionInputs: GhActionInputs,
  // for testing
  run: (bin: string, command: 'init' | 'collect', args: string[]) => any = runChildCommand
): Promise<string> {
  const { rcPath, ...actionInputs } = ghActionInputs;
  return new Promise((resolve, reject) => {
    if(!rcPath) {
      reject('rcPath not given');
    }
    const res = run('user-flow', 'collect', processParamsToParamsArray({ rcPath }));
    resolve(res);
  });
}
