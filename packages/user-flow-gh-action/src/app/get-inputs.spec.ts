import { expect, test } from '@jest/globals';
import { getInputs } from './get-inputs';
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

const rcPathError = 'Need rcPath to run.';
const serverBaseUrlServerTokenXorError = 'Need both a UFCI server url and an API token.';
const noUrlError = `URL not given in Rc config.`;

function resetProcessParams(): void {
  delete process.env['INPUT_RCPATH'];
  delete process.env['INPUT_SERVERBASEURL'];
  delete process.env['INPUT_SERVERTOKEN'];
  delete process.env['INPUT_BASICAUTHUSERNAME'];
  delete process.env['INPUT_BASICAUTHPASSWORD'];
}

describe('getInputs', () => {

  beforeAll(async () => {
    process.chdir(rootPath);
    prj = await CliProjectFactory.create(prjCfg);
    prj.setup();
  });

  beforeEach(() => {
    resetProcessParams()
  });
  afterAll(async () => {
    prj.teardown();
  })

  test('no rcPath given', () => {
    expect(() => getInputs()).toThrow(rcPathError);
  });

  test('should throw if serverBaseUrl is given and serverToken is not', () => {
    process.env['INPUT_RCPATH'] = 'path/to/rcFile';
    process.env['INPUT_SERVERBASEURL'] = 'http://my.thing.test';
    expect(() => getInputs()).toThrow(serverBaseUrlServerTokenXorError);
  });

  test('should throw if serverToken is given and serverBaseUrl is not', () => {
    process.env['INPUT_RCPATH'] = 'path/to/rcFile';
    process.env['INPUT_SERVERTOKEN'] = '1234';
    expect(() => getInputs()).toThrow(serverBaseUrlServerTokenXorError);
  });

  test('rcPath returns default cgf object', () => {
    process.env['INPUT_RCPATH'] = join(rootPath, DEFAULT_RC_NAME);
    const res = getInputs();
    expect(res.rcPath).toBe(process.env['INPUT_RCPATH']);
    expect(res.url).toBe(RcJSON.collect.url);
    expect(res.serverBaseUrl).toBe('');
    expect(res.serverToken).toBe('');
    expect(res.basicAuthUsername).toBe('user-flow'); // default value
    expect(res.basicAuthPassword).toBe('');
  });

  test('rcPath returns cgf object filled with action params', () => {
    process.env['INPUT_RCPATH'] = join(rootPath, DEFAULT_RC_NAME);
    process.env['INPUT_SERVERBASEURL'] = 'INPUT_SERVERBASEURL';
    process.env['INPUT_SERVERTOKEN'] = 'INPUT_SERVERTOKEN';
    process.env['INPUT_BASICAUTHUSERNAME'] = 'INPUT_BASICAUTHUSERNAME';
    process.env['INPUT_BASICAUTHPASSWORD'] = 'INPUT_BASICAUTHPASSWORD';
    const res = getInputs();
    expect(res.rcPath).toBe(process.env['INPUT_RCPATH']);
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
    process.chdir(rootPath);
  });
  beforeEach(() => {
    resetProcessParams()
  });
  afterAll(async () => {
    prj.teardown();
  })

  test('rcPath has NO collect.url given', () => {
    process.env['INPUT_RCPATH'] = join(prj.root, DEFAULT_RC_NAME);
    expect(() => getInputs()).toThrow(noUrlError);
  });

});
