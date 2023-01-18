import { executeUFCI } from './executeUFCI';
import { expect, test } from '@jest/globals';
import { join } from "path";
import { CliProject } from '@push-based/node-cli-testing';
import { DEFAULT_RC_NAME } from '@push-based/user-flow';
import { CliProjectFactory } from './get-inputs.spec';
import { processResult } from './process-result';


const rootFolder = 'user-flow-gh-action-e2e';
const rootPath = join(__dirname,'..','..','..',rootFolder);
let prj: CliProject<any>;
let rcPath: string;
const RcJSON = {
  persist: {
    outPath: 'test'
  }
};
let prjCfg = {
  root: rootPath,
  bin: '',
  rcFile: {
    [DEFAULT_RC_NAME]: RcJSON
  },
  create: {
    "user-flow1": ''
  }
};


describe('processResults', () => {

  beforeAll(async () => {
    prj = await CliProjectFactory.create(prjCfg);
    prj.setup();
    rcPath = join(prj.root, DEFAULT_RC_NAME)
    process.chdir(rootPath);
  });

  afterAll(async () => {
    prj.teardown();
  })


  test('throws invalid number', async () => {
    const rcJson = ({ rcPath: false,  } as unknown as any);
    expect(processResult(rcJson)).rejects.toEqual('rcPath not given');
  });

});
