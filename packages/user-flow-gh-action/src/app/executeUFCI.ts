import { GhActionInputs } from './types';
import { runUserFlowCliCommand } from './run-user-flow-cli-command';
import * as core  from '@actions/core';
import { processParamsToParamsArray, readJsonFileSync } from './utils';

export async function executeUFCI(
  ghActionInputs: GhActionInputs,
  // for testing
  run: (bin: string, command: 'init' | 'collect', args: string[]) => any = runUserFlowCliCommand
): Promise<string> {
  return new Promise((resolve, reject) => {
    // override format
    ghActionInputs.format =  ['md'];

    const script =  'npx @push-based/user-flow';
    const command =  'collect';
    const processedParams =  processParamsToParamsArray(ghActionInputs);
    core.debug(`Execute CLI: ${script} ${command} ${processedParams.join(' ')}`);

    const res = run(script, command, processedParams);
    resolve(res);
  });
}
