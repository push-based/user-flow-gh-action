import { GhActionInputs } from './types';
import { runUserFlowCliCommand } from './run-user-flow-cli-command';
import * as core  from '@actions/core';
import { processParamsToParamsArray, readJsonFileSync } from './utils';

export async function executeUFCI(
  ghActionInputs: GhActionInputs,
  // for testing
  run: (bin: string, command: 'init' | 'collect', args: string[]) => any = runUserFlowCliCommand
): Promise<string> {
  const { rcPath, verbose, dryRun, ...unusedInputs } = ghActionInputs;
  return new Promise((resolve, reject) => {

    // as we need md format for the comment we have to ensure is is included
    if (!rcPath) {
      reject(`rcPath ${rcPath} not given`);
    }
    const rcFileObj: any = readJsonFileSync(rcPath);
    const { persist } = rcFileObj;
    ghActionInputs.format =  Array.from(new Set(['md'].concat(persist?.format || []).concat(ghActionInputs?.format || [])));


    const script =  'npx @push-based/user-flow';
    const command =  'collect';
    const processedParams =  processParamsToParamsArray(ghActionInputs);
    core.debug(`Execute CLI: ${script} ${command} ${processedParams.join(' ')}`);

    const res = run(script, command, processedParams);
    resolve(res);
  });
}
