import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import { OUT_PATH } from '../support/constants';
import * as core from '@actions/core';

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500'
  const np = process.execPath;

  const ip = path.join(process.cwd(), OUT_PATH, 'src', 'index.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  const out = cp.execFileSync(np, [ip], options).toString();
  core.debug('out: '+ out);
  expect(out.includes('::debug::-> wait')).toBeTruthy();
})
