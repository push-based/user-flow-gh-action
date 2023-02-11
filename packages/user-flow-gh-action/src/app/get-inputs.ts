// A majority of this code is borrowed from [lhci-gh-action](https://github.com/treosh/lighthouse-ci-action)
import * as core from '@actions/core';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { GhActionInputs } from './types';
import { readJsonFileSync } from './utils';

export const rcPathError = 'Need rcPath to run.';
export const serverBaseUrlServerTokenXorError = 'Need both a UFCI server url and an API token.';
export const noUrlError = `URL not given in rc config.`;
export const wrongBooleanValue = (val: string, prop: string) => `${prop} is ${val} but can only be set to 'on' or 'off'.`;
export const wrongVerboseValue = (val: string) => wrongBooleanValue(val, 'verbose');
export const wrongDryRunValue = (val: string) => wrongBooleanValue(val, 'dryRun');
export const wrongKeepCommentsValue = (val: string) => wrongBooleanValue(val, 'keepComments');

export function getInputs(): GhActionInputs {
  // GLOBAL PARAMS

  // Inspect user-flowrc file for malformations
  const rcPath: string | null = core.getInput('rcPath') ? resolve(core.getInput('rcPath')) : null;
  core.debug(`Input rcPath is ${rcPath}`);
  if (!rcPath) {
    // Fail and exit
    core.setFailed(rcPathError);
    throw new Error(rcPathError);
  }

  // convert action input to boolean
  const dryRun =  parseOnOff('dryRun', wrongDryRunValue);
  core.debug(`Input dryRun is ${dryRun}`);

  // convert action input to boolean
  const verbose = parseOnOff('verbose', wrongVerboseValue);
  core.debug(`Input verbose is ${verbose}`);

  // convert action input to boolean
  const keepComments = parseOnOff('keepComments', wrongKeepCommentsValue);
  core.debug(`Input keepComments is ${keepComments}`);

  // RC JSON
  const rcFileObj: any = readJsonFileSync(rcPath);
  core.debug(`rcFileObj is ${JSON.stringify(rcFileObj)}`);

  const { collect, persist, assert } = rcFileObj;
  // COLLECT PARAMS
  if (!collect) {
    throw new Error(`collect configuration has to be present in rc config.`);
  }

  let { url } = collect;

  // Check if we have a url
  if (!url) {
    core.setFailed(noUrlError);
    throw new Error(noUrlError);
  }
  // Get and interpolate URL's
  url = interpolateProcessIntoUrl(url);

  // upload (action only?)
  const serverBaseUrl: string = core.getInput('serverBaseUrl');
  core.debug(`Input serverBaseUrl is ${serverBaseUrl}`);
  const serverToken: string = core.getInput('serverToken');
  core.debug(`Input serverToken is ${serverToken}`);
  // Make sure we don't have UFCI xor API token
  if (!!serverBaseUrl != !!serverToken) {
    // Fail and exit
    core.setFailed(serverBaseUrlServerTokenXorError);
    throw new Error(serverBaseUrlServerTokenXorError);
  }

  const basicAuthUsername = core.getInput('basicAuthUsername') || 'user-flow';
  core.debug(`Input basicAuthUsername is ${basicAuthUsername}`);
  const basicAuthPassword = core.getInput('basicAuthPassword');
  core.debug(`Input basicAuthPassword is ${basicAuthPassword}`);

  return {
    rcPath,
    verbose,
    dryRun,
    keepComments,
    // assert
    // collect
    url,
    serverBaseUrl,
    // upload
    serverToken,
    basicAuthUsername,
    basicAuthPassword
  };
}

function parseOnOff(name: string, errorMsg: (v?: string) => string): boolean  {
  let onOffInput = core.getInput(name, { trimWhitespace: true });
  if (onOffInput === '') {
    onOffInput = 'off';
  }
  if (onOffInput !== 'on' && onOffInput !== 'off') {
    throw new Error(errorMsg(onOffInput));
  }
  // convert action input to boolean
  return onOffInput === 'on';
}

/**
 * Check if the file under `rcPath` has `assert` params set.
 *
 * @param {string | null} rcPath
 */
export function hasAssertConfig(rcPath: string): boolean {
  if (!rcPath) return false;
  const rcFileObj = readJsonFileSync(rcPath);
  return Boolean(rcFileObj.assert);
}

/**
 * Takes a set of URL strings and interpolates
 * any declared ENV vars into them
 *
 */
function interpolateProcessIntoUrl(url: string): string {
  if (!url.includes('$')) return url;
  Object.keys(process.env).forEach((key) => {
    if (url.includes(`${key}`)) {
      url = url.replace(`$${key}`, `${process.env[key]}`);
    }
  });
  return url;
}
