import * as core from '@actions/core';
import { expect, test } from '@jest/globals';
import * as cp from 'child_process';
import { join } from 'path';
import { OUT_PATH } from '../support/constants';


describe('', () => {

// shows how the runner will run a javascript action with env / stdout protocol
  test('test runs', () => {
    process.env['INPUT_MILLISECONDS'] = '500';
    const np = process.execPath;

    const ip = join(process.cwd(), OUT_PATH, 'main.js');
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    };
    const out = cp.execFileSync(np, [ip], options).toString();
    core.debug('out: ' + out);
    expect(out.includes('::debug::-> getInputs')).toBeTruthy();
  });

});
