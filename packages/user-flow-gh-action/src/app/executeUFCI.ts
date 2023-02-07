import { GhActionInputs } from './types';
import { runUserFlowCliCommand } from './run-user-flow-cli-command';
import * as core  from '@actions/core';
import { processParamsToParamsArray } from './utils';

export async function executeUFCI(
  ghActionInputs: GhActionInputs,
  // for testing
  run: (bin: string, command: 'init' | 'collect', args: string[]) => any = runUserFlowCliCommand
): Promise<string> {
  const { rcPath, verbose, dryRun, ...unusedInputs } = ghActionInputs;
  return new Promise((resolve, reject) => {
    if (!rcPath) {
      reject('rcPath not given');
    }
    const params =  { rcPath, verbose, dryRun };

    const script =  'npx @push-based/user-flow';
    const command =  'collect';
    const processedParams =  processParamsToParamsArray({ rcPath, verbose, dryRun, format: ['md'] });
    core.debug(`Execute CLI: ${script} ${command} ${processedParams.join(', ')}`);

    const res = run(script, command, processedParams);
    resolve(res);
  });
}
