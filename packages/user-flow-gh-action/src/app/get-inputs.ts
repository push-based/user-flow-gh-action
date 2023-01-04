// A majority of this code is borrowed from [lhci-gh-action](https://github.com/treosh/lighthouse-ci-action)
import * as core from '@actions/core';
import { RcJson } from '@push-based/user-flow';
import { readRcConfig } from '@push-based/user-flow/src/lib/global/rc-json';
import { get } from 'lodash';
import { resolve } from 'path';

export function getInput() {
  // fallback to upload.serverBaseUrl + upload.token for previous API support
  const serverBaseUrl = core.getInput('serverBaseUrl') || core.getInput('upload.serverBaseUrl')
  const serverToken = core.getInput('serverToken') || core.getInput('upload.token')

  // Make sure we don't have UFCI xor API token
  if (!!serverBaseUrl != !!serverToken) {
    // Fail and exit
    core.setFailed(`Need both a UFCI server url and an API token.`)
    process.exit(1)
  }

  const temporaryPublicStorage = core.getInput('temporaryPublicStorage') === 'true' ? true : false
  if (serverBaseUrl && temporaryPublicStorage) {
    core.setFailed(`Both UFCI server and Temporary storage are set, choose one upload method.`)
    process.exit(1)
  }

  let urls = null

  // Inspect user-flowrc file for malformations
  const rcPath = core.getInput('rcPath') ? resolve(core.getInput('rcPath')) : null
  if (rcPath) {
    const rcFileObj: RcJson = readRcConfig(rcPath)

    // Check if we have a static-dist-dir
    if (rcFileObj.collect) {
      if (rcFileObj.collect.url) {
        urls = rcFileObj.collect.url
      }

    }
  }

  // Get and interpolate URL's
  urls = urls || interpolateProcessIntoUrls(getList('urls'))

  // Make sure we have either urls or a static-dist-dir
  if (!urls) {
    // Fail and exit
    core.setFailed(`Need either 'urls' in action parameters or a 'static_dist_dir' in user-flowrc file`)
    process.exit(1)
  }

  return {
    // collect
    urls,
    // assert
    budgetPath: core.getInput('budgetPath') || '',
    rcPath,
    // upload
    serverBaseUrl,
    serverToken,
    basicAuthUsername: core.getInput('basicAuthUsername') || 'user-flow',
    basicAuthPassword: core.getInput('basicAuthPassword'),
    artifactName: core.getInput('artifactName'),
  }
}

/**
 * Check if the file under `rcPath` has `assert` params set.
 *
 * @param {string | null} rcPath
 */
exports.hasAssertConfig = function hasAssertConfig(rcPath) {
  if (!rcPath) return false
  const rcFileObj = readRcConfig(rcPath)
  return Boolean(get(rcFileObj, 'ci.assert'))
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
function interpolateProcessIntoUrls(urls) {
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
