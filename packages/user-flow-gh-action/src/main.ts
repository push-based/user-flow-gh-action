import * as core from '@actions/core'
import {executeUFCI} from './app/executeUFCI'
import { getInputs } from './app/get-inputs';


// 1. get inputs form action
// 2. execute CLI
// 3. handle comments
// 4. save result
export async function run(): Promise<void> {
  core.debug(`Run main`);
  try {
    const ghActionParams = getInputs()
    core.debug(`ghActionParams are ${JSON.stringify(ghActionParams)}`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    const r = await executeUFCI(ghActionParams)

    core.setOutput('result', r)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
    process.exitCode = 1;
    process.exit(1)
  }
}

run().catch((err) => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`))
