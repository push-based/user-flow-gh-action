// A majority of this code is borrowed from [lhci-gh-action](https://github.com/treosh/lighthouse-ci-action)
import * as core from '@actions/core';
import { RcJson, readRcConfig } from '@push-based/user-flow';
import { resolve } from 'path';

type GhActionParams = {
  // global
  rcPath: string;
  // collect
  url: string;
  // assert
  // upload
  serverBaseUrl: string;
  serverToken: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
}

export function getInput(): GhActionParams {
  const serverBaseUrl: string = core.getInput('serverBaseUrl');
  const serverToken: string = core.getInput('serverToken');

  // Make sure we don't have UFCI xor API token
  if (!!serverBaseUrl != !!serverToken) {
    // Fail and exit
    core.setFailed(`Need both a UFCI server url and an API token.`)
    process.exit(1)
  }

  let url: string | null = null

  // Inspect user-flowrc file for malformations
  const rcPath: string | null = core.getInput('rcPath') ? resolve(core.getInput('rcPath')) : null
  if (rcPath) {
    const rcFileObj: RcJson = readRcConfig(rcPath);

    // Check if we have a static-dist-dir
    if (rcFileObj.collect) {
      if (rcFileObj.collect.url) {
        url = rcFileObj.collect.url
      }
    }
  } else {
    // Fail and exit
    core.setFailed(`Need user-flowrc json to run.`)
    process.exit(1)
  }


  // Get and interpolate URL's
  url = interpolateProcessIntoUrls([url])[0];

  // Make sure we have either urls or a static-dist-dir
  if (!url) {
    // Fail and exit
    core.setFailed(`Need either 'urls' in action parameters or a 'static_dist_dir' in user-flowrc file`)
    process.exit(1)
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
  }
}

/**
 * Check if the file under `rcPath` has `assert` params set.
 *
 * @param {string | null} rcPath
 */
export function hasAssertConfig(rcPath: string): boolean {
  if (!rcPath) return false
  const rcFileObj = readRcConfig(rcPath)
  return Boolean(rcFileObj.assert)
}

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */
function getList(arg, separator = '\n') {
  const input = core.getInput(arg)
  if (!input) return []
  return input.split(separator).map((url) => url.trim())
}

/**
 * Takes a set of URL strings and interpolates
 * any declared ENV vars into them
 *
 * @param {string[]} urls
 */
function interpolateProcessIntoUrls(urls: string[]): string[] {
  return urls.map((url) => {
    if (!url.includes('$')) return url
    Object.keys(process.env).forEach((key) => {
      if (url.includes(`${key}`)) {
        url = url.replace(`$${key}`, `${process.env[key]}`)
      }
    })
    return url
  })
}
