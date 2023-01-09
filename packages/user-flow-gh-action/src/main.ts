import * as core from '@actions/core'
import { processParamsToParamsArray } from '@push-based/node-cli-testing';
import {executeUFCI} from './app/executeUFCI'
import { getInputs } from './app/get-inputs';
import { runChildCommand } from './app/run-child-command';


export async function run(): Promise<void> {
  core.debug(`getInputs`);
  const ghActionInputs = getInputs();

 // runChildCommand('collect', processParamsToParamsArray(ghActionInputs));

  try {
    const rcPath: string = core.getInput('rcPath')
    core.debug(`rcPath is ${rcPath} ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await executeUFCI(rcPath)
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}


