// A majority of this code is borrowed from [lhci-gh-action](https://github.com/treosh/lighthouse-ci-action)
import * as core from '@actions/core';
import { RcJson, readRcConfig } from '@push-based/user-flow';
import { resolve } from 'path';
import { GhActionInputs } from './types';

export function getInputs(): GhActionInputs {
  const serverBaseUrl: string = core.getInput('serverBaseUrl');
  const serverToken: string = core.getInput('serverToken');

  // Make sure we don't have UFCI xor API token
  if (!!serverBaseUrl != !!serverToken) {
    // Fail and exit
    core.setFailed(`Need both a UFCI server url and an API token.`);
    throw new Error(`Need both a UFCI server url and an API token.`);
  }

  // Inspect user-flowrc file for malformations
  const rcPath: string | null = core.getInput('rcPath') ? resolve(core.getInput('rcPath')) : null;

  let url: string | null = null;
  if (rcPath) {
    const rcFileObj: RcJson = readRcConfig(rcPath);
    core.debug(`rcFileObj id ${JSON.stringify(rcFileObj)}`);
    // Check if we have a url
    if (rcFileObj.collect) {
      if (rcFileObj.collect.url) {
        url = rcFileObj.collect.url;
      }
    }
    if(!url) {
      throw new Error(`URL not given in Rc config.`);
    }
  } else {
    // Fail and exit
    core.setFailed(`Need rcPath to run.`);
    throw new Error(`Need rcPath to run.`);
  }

  // Get and interpolate URL's
  url = interpolateProcessIntoUrls([url])[0];

  // Make sure we have a url
  if (!url) {
    // Fail and exit
    core.setFailed(`Need 'url' in user-flowrc file`);
    throw new Error(`Need 'url' in user-flowrc file`);
  }

  return {
    rcPath,
    // collect
    url,
    // assert
    // upload
    serverBaseUrl,
    serverToken,
    basicAuthUsername: core.getInput('basicAuthUsername') || 'user-flow',
    basicAuthPassword: core.getInput('basicAuthPassword')
  };
}

/**
 * Check if the file under `rcPath` has `assert` params set.
 *
 * @param {string | null} rcPath
 */
export function hasAssertConfig(rcPath: string): boolean {
  if (!rcPath) return false;
  const rcFileObj = readRcConfig(rcPath);
  return Boolean(rcFileObj.assert);
}

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */
function getList(arg, separator = '\n') {
  const input = core.getInput(arg);
  if (!input) return [];
  return input.split(separator).map((url) => url.trim());
}

/**
 * Takes a set of URL strings and interpolates
 * any declared ENV vars into them
 *
 * @param {string[]} urls
 */
function interpolateProcessIntoUrls(urls: string[]): string[] {
  return urls.map((url) => {
    if (!url.includes('$')) return url;
    Object.keys(process.env).forEach((key) => {
      if (url.includes(`${key}`)) {
        url = url.replace(`$${key}`, `${process.env[key]}`);
      }
    });
    return url;
  });
}
