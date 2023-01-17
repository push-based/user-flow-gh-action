import { GhActionInputs } from './types';
import { runUserFlowCliCommand } from './run-user-flow-cli-command';
import { processParamsToParamsArray } from '@push-based/node-cli-testing';

export async function executeUFCI(
  ghActionInputs: GhActionInputs,
  // for testing
  run: (bin: string, command: 'init' | 'collect', args: string[]) => any = runUserFlowCliCommand
): Promise<string> {
  const { rcPath, ...actionInputs } = ghActionInputs;
  return new Promise((resolve, reject) => {
    if(!rcPath) {
      reject('rcPath not given');
    }
    const res = run('npx @push-based/user-flow', 'collect', processParamsToParamsArray({ rcPath }));
    resolve(res);
  });
}
