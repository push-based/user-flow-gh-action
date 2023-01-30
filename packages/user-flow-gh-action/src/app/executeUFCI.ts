import { GhActionInputs } from './types';
import { runUserFlowCliCommand } from './run-user-flow-cli-command';
import * as core  from '@actions/core';
import { processParamsToParamsArray } from './utils';

export async function executeUFCI(
  ghActionInputs: GhActionInputs,
  // for testing
  run: (bin: string, command: 'init' | 'collect', args: string[]) => any = runUserFlowCliCommand
): Promise<string> {
  const { rcPath, verbose, dryRun, ...actionInputs } = ghActionInputs;
  return new Promise((resolve, reject) => {
    if (!rcPath) {
      reject('rcPath not given');
    }
    const script =  'npx @push-based/user-flow';
    const command =  'collect';
    const params =  processParamsToParamsArray({ rcPath, verbose, dryRun });
    core.debug(`Execute CLI: ${script} ${command} ${params}`);

    const res = run(script, command, params);
    resolve(res);
  });
}
