import { execSync } from 'child_process';

export function runChildCommand(bin: string, command: string, args: string[] = []) {
  const combinedArgs = [bin, command, ...args];

  return execSync(combinedArgs.join(' '), {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf-8'
  });
}
