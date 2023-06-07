import { execSync, ExecSyncOptions } from 'child_process';
import * as core from '@actions/core';

export function runUserFlowCliCommand(bin: string, args: string[] = [], processOptions: { cwd?: string, env?: {} } = {}) {
  const combinedArgs = [bin, ...args];
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
  // @TODO use better approach
  return execSync(combinedArgs.join(' '), options);
}
