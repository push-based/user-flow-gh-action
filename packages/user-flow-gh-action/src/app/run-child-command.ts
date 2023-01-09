import * as childProcess from 'child_process';
import * as ufCliBin from '@push-based/user-flow/src/cli.js';

export function runChildCommand(command, args = []) {
  const combinedArgs = [ufCliBin, command, ...args]
  const { status = -1 } = childProcess.spawnSync(process.argv[0], combinedArgs, {
    stdio: 'inherit',
  })
  return status || 0
}
