import { execSync } from 'child_process';

export function runUserFlowCliCommand(bin: string, command: string, args: string[] = []) {
  const combinedArgs = [bin, command, ...args];
  // @TODO use childProcess.execSync to get stdout and forward it
  return execSync(combinedArgs.join(' '), {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf-8'
  });
}
