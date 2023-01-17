import * as path from 'path';
import { expect, test } from '@jest/globals';
import { OUT_PATH } from '../support/constants';
import * as core from '@actions/core';
import { Options } from 'execa';
import { testProcessE2e } from '@push-based/node-cli-testing';

describe('main.js', () => {

  test('runs', async () => {

    process.env['INPUT_RCPATH'] = '.user-flowrc.json';
    const bin = path.join('..', '..', OUT_PATH, 'main.js');
    const options: Options = {
      env: process.env,
      cwd: process.cwd()
    };
    const {stdout, stderr, exitCode} = await testProcessE2e([bin], [], options);

    expect(stderr).toBe('');
    expect(stdout).toContain('Run main');
    expect(exitCode).toBe(1);

  });

});
