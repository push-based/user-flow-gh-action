import { ProjectConfig } from '@push-based/node-cli-testing';
import { DEFAULT_RC_NAME, RcJson } from '@push-based/user-flow';
import { REMOTE_RC_JSON, REMOTE_RC_NAME } from './rc';
import { REMOTE_USERFLOW_CONTENT, REMOTE_USERFLOW_NAME } from './flow1.uf';
import { join } from 'path';

export const REMOTE_USERFLOW_PATH = join(REMOTE_RC_JSON.collect.ufPath, REMOTE_USERFLOW_NAME);
export const REMOTE_PRJ_NAME = 'user-flow-gh-action-e2e';
export const REMOTE_PRJ_ROOT = join(__dirname, '..', '..', '..', '..', '..', REMOTE_PRJ_NAME);
export const REMOTE_PRJ_BIN = join(__dirname, '..', '..', '..', '..', '..', '..', 'dist/packages/user-flow-gh-action', 'main.js');

export const REMOTE_PRJ_CFG: ProjectConfig<RcJson> = {
  root: REMOTE_PRJ_ROOT,
  bin: REMOTE_PRJ_BIN,
  rcFile: {
    [REMOTE_RC_NAME]: REMOTE_RC_JSON
  },
  create: {
    [REMOTE_RC_JSON.collect.ufPath]: undefined,
    [REMOTE_RC_JSON.persist.outPath]: undefined,
    [REMOTE_USERFLOW_PATH]: REMOTE_USERFLOW_CONTENT
  },
  delete: [REMOTE_RC_JSON.collect.ufPath, REMOTE_RC_JSON.persist.outPath]
};

