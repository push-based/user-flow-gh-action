import { RcJson } from '@push-based/user-flow';

export const REMOTE_RC_NAME = '.user-flow.remote.json';
export const REMOTE_RC_JSON: RcJson = {
  'collect': {
    'url': 'https://google.com',
    'ufPath': './src/lib/user-flows', // DEFAULT_COLLECT_UF_PATH
  },
  'persist': {
    'outPath': './src/lib/measures', //DEFAULT_PERSIST_OUT_PATH,
    'format': ['json']
  },
  'assert': {}
};
