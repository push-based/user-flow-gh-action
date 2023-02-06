import { expect, test } from '@jest/globals';
import {
  getInputs,
  noUrlError,
  rcPathError,
  serverBaseUrlServerTokenXorError,
  wrongDryRunValue,
  wrongVerboseValue
} from './get-inputs';
import { CliProject, ProjectConfig } from '@push-based/node-cli-testing';
import { DEFAULT_RC_NAME } from '@push-based/user-flow';
import { join } from 'path';

export class CliProjectFactory {
  static async create(cfg: ProjectConfig<{}>): Promise<CliProject<{}>> {
    const prj = new CliProject();
    await prj._setup(cfg);
    return prj;
  }
}

const rootFolder = 'user-flow-gh-action-e2e';
const rootPath = join(__dirname,'..','..','..',rootFolder);
let prj: CliProject<any>;
const RcJSON = {
  collect: {
    url: 'test'
  }
};
let prjCfg = {
  root: rootPath,
  bin: '',
  rcFile: {
    [DEFAULT_RC_NAME]: RcJSON
  }
};

let prjCfgWithWrongUrl = {
  root: rootPath,
  bin: '',
  rcFile: {
    [DEFAULT_RC_NAME]: {
      collect: {
        url: ''
      }
    }
  }
};
let rcPath: string;

function resetProcessParams(): void {
  // GLOBAL
  delete process.env['INPUT_RCPATH'];
  delete process.env['INPUT_VERBOSE'];
  delete process.env['INPUT_DRYRUN'];
  // UPLOAD
  delete process.env['INPUT_SERVERBASEURL'];
  delete process.env['INPUT_SERVERTOKEN'];
  delete process.env['INPUT_BASICAUTHUSERNAME'];
  delete process.env['INPUT_BASICAUTHPASSWORD'];
}

describe('getInputs global', () => {
  beforeAll(async () => {
    prj = await CliProjectFactory.create(prjCfg);
    prj.setup();
    rcPath = join(prj.root, DEFAULT_RC_NAME)
    process.chdir(rootPath);
  });

  beforeEach(() => {
    resetProcessParams()
  });
  afterAll(async () => {
    prj.teardown();
  })
  // rcPath
  test('should throw if no rcPath is given', () => {
    expect(() => getInputs()).toThrow(rcPathError);
  });

  // verbose
  test('should throw if wrong value is passed as verbose', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'wrongValue';
    expect(() => getInputs()).toThrow(wrongVerboseValue(process.env['INPUT_VERBOSE']));
  });

  test('should parse verbose on to true', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'on';
    const { verbose } = getInputs();
    expect(verbose).toBe(true);
  });

  test('should parse verbose off to false', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'off';
    const { verbose } = getInputs();
    expect(verbose).toBe(false);
  });

  // dryRun
  test('should throw if wrong value is passed as dryRun', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_DRYRUN'] = 'wrongValue';
    expect(() => getInputs()).toThrow(wrongDryRunValue(process.env['INPUT_DRYRUN']));
  });

  test('should parse verbose on to true', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_DRYRUN'] = 'on';
    const { dryRun } = getInputs();
    expect(dryRun).toBe(true);
  });

  test('should parse verbose off to false', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_DRYRUN'] = 'off';
    const { dryRun } = getInputs();
    expect(dryRun).toBe(false);
  });


});

describe('getInputs', () => {

  beforeAll(async () => {
    prj = await CliProjectFactory.create(prjCfg);
    prj.setup();
    rcPath = join(prj.root, DEFAULT_RC_NAME)
    process.chdir(rootPath);
  });

  beforeEach(() => {
    resetProcessParams()
  });
  afterAll(async () => {
    prj.teardown();
  })

  test('should throw if serverBaseUrl is given and serverToken is not', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_SERVERBASEURL'] = 'http://my.thing.test';
    expect(() => getInputs()).toThrow(serverBaseUrlServerTokenXorError);
  });

  test('should throw if serverToken is given and serverBaseUrl is not', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_SERVERTOKEN'] = '1234';
    expect(() => getInputs()).toThrow(serverBaseUrlServerTokenXorError);
  });

  test('rcPath returns default cgf object', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    const res = getInputs();
    expect(res.rcPath).toBe(process.env['INPUT_RCPATH']);
    expect(res.url).toBe(RcJSON.collect.url);
    expect(res.serverBaseUrl).toBe('');
    expect(res.serverToken).toBe('');
    expect(res.basicAuthUsername).toBe('user-flow'); // default value
    expect(res.basicAuthPassword).toBe('');
  });

  test('rcPath returns cgf object filled with action params', () => {
    // GLOBAL
    process.env['INPUT_RCPATH'] = rcPath;
    process.env['INPUT_VERBOSE'] = 'on';
    process.env['INPUT_DRYRUN'] = 'on';
    // UPLOAD
    process.env['INPUT_SERVERBASEURL'] = 'INPUT_SERVERBASEURL';
    process.env['INPUT_SERVERTOKEN'] = 'INPUT_SERVERTOKEN';
    process.env['INPUT_BASICAUTHUSERNAME'] = 'INPUT_BASICAUTHUSERNAME';
    process.env['INPUT_BASICAUTHPASSWORD'] = 'INPUT_BASICAUTHPASSWORD';
    const res = getInputs();
    expect(res.rcPath).toBe(process.env['INPUT_RCPATH']);
    expect(res.verbose).toBe(process.env['INPUT_VERBOSE'] === 'on');
    expect(res.verbose).toBe(process.env['INPUT_DRYRUN'] === 'on');
    expect(res.url).toBe(RcJSON.collect.url);
    expect(res.serverBaseUrl).toBe('INPUT_SERVERBASEURL');
    expect(res.serverToken).toBe('INPUT_SERVERTOKEN');
    expect(res.basicAuthUsername).toBe('INPUT_BASICAUTHUSERNAME');
    expect(res.basicAuthPassword).toBe('INPUT_BASICAUTHPASSWORD');
  });

});

describe('getInputs with wrong RC', () => {

  beforeAll(async () => {
    prj = await CliProjectFactory.create(prjCfgWithWrongUrl);
    prj.setup();
    rcPath = join(prj.root, DEFAULT_RC_NAME)
    process.chdir(rootPath);
  });
  beforeEach(() => {
    resetProcessParams()
  });
  afterAll(async () => {
    prj.teardown();
  })

  test('rcPath has NO collect.url given', () => {
    process.env['INPUT_RCPATH'] = rcPath;
    expect(() => getInputs()).toThrow(noUrlError);
  });

});
