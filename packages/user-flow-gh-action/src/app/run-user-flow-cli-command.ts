import { execSync, ExecSyncOptions } from 'child_process';
import * as core from '@actions/core';

export function runUserFlowCliCommand(bin: string, command: 'collect' = 'collect', args: string[] = [], processOptions: { cwd?: string, env?: {} } = {}) {
  const combinedArgs = [bin, command, ...args];
  let { cwd, env } = processOptions;
  env = env || process.env;
  // Ensure we run in cliMode "CI"
  if(env['CI'] === undefined) {
    env['CI'] = true;
  }
  const options: ExecSyncOptions = {
    cwd: cwd || process.cwd(),
    env
  };

  core.debug(`CLI process options: ${JSON.stringify(options.env.CI)}`);
  // @TODO use childProcess.execSync to get stdout and forward it
  return execSync(combinedArgs.join(' '), options);
}
