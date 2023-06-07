import { expect, test } from '@jest/globals';
import { getInputs, rcPathError, wrongDryRunValue, wrongVerboseValue } from './get-inputs';
import { withProject } from '@push-based/node-cli-testing';
import { DEFAULT_RC_NAME } from '@push-based/user-flow';
import { join } from 'path';

const rootFolder = 'user-flow-gh-action-e2e';
const rootPath = join(__dirname,'..','..','..',rootFolder);
const RcJSON = {
  collect: {
    url: 'test'
  }
};
const prjCfg = {
  root: rootPath,
  bin: '',
  rcFile: {
    [DEFAULT_RC_NAME]: RcJSON
  }
};

let rcPath: string;

function resetProcessParams(): void {
  // GLOBAL
  delete process.env['INPUT_CUSTOMSCRIPT'];
  delete process.env['INPUT_RCPATH'];
  delete process.env['INPUT_VERBOSE'];
  // COLLECT
  delete process.env['INPUT_DRYRUN'];
  delete process.env['INPUT_URL'];
  delete process.env['INPUT_UFPATH'];
  delete process.env['INPUT_CONFIGPATH'];
  delete process.env['INPUT_BUDGETPATH'];
  delete process.env['INPUT_SERVECOMMAND'];
  delete process.env['INPUT_AWAITSTDOUTFROMSERVE'];
  delete process.env['INPUT_FORMAT'];
  delete process.env['INPUT_OUTPATH'];
}

describe('getInputs global', () => {
  beforeAll(async () => {
    process.chdir(rootPath);
  });

  beforeEach(() => {
    resetProcessParams()
  });
  // rcPath
  test('should throw if no rcPath is given', withProject(prjCfg, async (_) => {
    expect(() => getInputs()).toThrow(rcPathError);
  }));

  // verbose
  test('should throw if wrong value is passed as verbose', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'wrongValue';
    expect(() => getInputs()).toThrow(wrongVerboseValue(process.env['INPUT_VERBOSE']));
  }));

  // rcPath
  test('should parse verbose on to true', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'on';
    const { verbose } = getInputs();
    expect(verbose).toBe(true);
  }));

  test('should parse verbose off to false', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'off';
    const { verbose } = getInputs();
    expect(verbose).toBe(false);
  }));

});

describe('getInputs collect', () => {
  // dryRun
  test('should throw if wrong value is passed as dryRun', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_DRYRUN'] = 'wrongValue';
    expect(() => getInputs()).toThrow(wrongDryRunValue(process.env['INPUT_DRYRUN']));
  }));

  test('should parse customScript', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_CUSTOMSCRIPT'] = 'nx user-flow project-name';
    const { customScript } = getInputs();
    expect(customScript).toBe( process.env['INPUT_CUSTOMSCRIPT'] );
  }));
  test('should parse rcPath on to true', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_DRYRUN'] = 'on';
    const { dryRun } = getInputs();
    expect(dryRun).toBe(true);
  }));

  test('should parse rcPath off to false', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_DRYRUN'] = 'off';
    const { dryRun } = getInputs();
    expect(dryRun).toBe(false);
  }));

  test('should parse url on to true',  withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_URL'] = 'url-from-action';
    const { url } = getInputs();
    expect(url).toBe('url-from-action');
  }));

  test('should parse ufPath on to true', withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_UFPATH'] = 'ufPath-from-action';
    const { ufPath } = getInputs();
    expect(ufPath).toBe('ufPath-from-action');
  }));

})
/*
describe('getInputs upload', () => {

  beforeAll(async () => {
    process.chdir(rootPath);
  });

  beforeEach(() => {
    resetProcessParams()
  });

  test('should throw if serverBaseUrl is given and serverToken is not',  withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_SERVERBASEURL'] = 'http://my.thing.test';
    expect(() => getInputs()).toThrow(serverBaseUrlServerTokenXorError);
  }));

  test('should throw if serverToken is given and serverBaseUrl is not',  withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_SERVERTOKEN'] = '1234';
    expect(() => getInputs()).toThrow(serverBaseUrlServerTokenXorError);
  }));

  test('rcPath returns default cgf object',  withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    process.env['INPUT_RCPATH'] = rcPath;
    const res = getInputs();
    expect(res.rcPath).toBe(process.env['INPUT_RCPATH']);
    expect(res.url).toBe(RcJSON.collect.url);
    //expect(res.serverBaseUrl).toBe('');
    //expect(res.serverToken).toBe('');
    //expect(res.basicAuthUsername).toBe('user-flow'); // default value
    //expect(res.basicAuthPassword).toBe('');
  }));

  test('rcPath returns cgf object filled with action params',  withProject(prjCfg, async (prj) => {
    rcPath = join(prj.root, DEFAULT_RC_NAME);
    // GLOBAL
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'on';
    process.env['INPUT_DRYRUN'] = 'on';
    // UPLOAD
    //process.env['INPUT_SERVERBASEURL'] = 'INPUT_SERVERBASEURL';
    //process.env['INPUT_SERVERTOKEN'] = 'INPUT_SERVERTOKEN';
    //process.env['INPUT_BASICAUTHUSERNAME'] = 'INPUT_BASICAUTHUSERNAME';
    //process.env['INPUT_BASICAUTHPASSWORD'] = 'INPUT_BASICAUTHPASSWORD';
    const res = getInputs();
    expect(res.rcPath).toBe(process.env['INPUT_RCPATH']);
    expect(res.verbose).toBe(process.env['INPUT_VERBOSE'] === 'on');
    expect(res.verbose).toBe(process.env['INPUT_DRYRUN'] === 'on');
    expect(res.url).toBe(RcJSON.collect.url);
    //expect(res.serverBaseUrl).toBe('INPUT_SERVERBASEURL');
    //expect(res.serverToken).toBe('INPUT_SERVERTOKEN');
    //expect(res.basicAuthUsername).toBe('INPUT_BASICAUTHUSERNAME');
    //expect(res.basicAuthPassword).toBe('INPUT_BASICAUTHPASSWORD');
  }));

});
*/
