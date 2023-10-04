import { GhActionInputs } from './types';
import { runUserFlowCliCommand } from './run-user-flow-cli-command';
import * as core  from '@actions/core';
import { processParamsToParamsArray } from './utils';

export async function executeUFCI(
  ghActionInputs: GhActionInputs,
  // for testing
  run: (bin: string, args: string[]) => any = runUserFlowCliCommand
): Promise<string> {
  return new Promise((resolve) => {
    // override format
    if (!ghActionInputs.format) {
      ghActionInputs.format =  ['md'];
    } else if (!ghActionInputs.format.includes('md')) {
      ghActionInputs.format.push('md');
    }

    const command =  'collect';
    const script = `npx @push-based/user-flow ${command}`;
    const processedParams =  processParamsToParamsArray(ghActionInputs);
    core.debug(`Execute CLI: ${script} ${processedParams.join(' ')}`);
    const res = run(script, processedParams);
    resolve(res);
  });
}
