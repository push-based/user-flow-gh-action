import { RcJson } from '@push-based/user-flow';

export const REMOTE_RC_NAME = '.user-flow.remote.json';
export const REMOTE_RC_JSON: RcJson = {
  'collect': {
    'url': 'https://google.com',
    'ufPath': './packages/user-flow-gh-action-e2e/user-flows', // DEFAULT_COLLECT_UF_PATH
  },
  'persist': {
    'outPath': './packages/user-flow-gh-action-e2e/measures', //DEFAULT_PERSIST_OUT_PATH,
    'format': ['md']
  },
  'assert': {}
};
