import { RcJson } from '@push-based/user-flow';

export const REMOTE_RC_NAME = '.user-flow.remote.json';
export const REMOTE_RC_JSON: RcJson = {
  'collect': {
    'url': 'https://coffee-cart.netlify.app/',
    'ufPath': './src/lib/user-flows', // DEFAULT_COLLECT_UF_PATH
  },
  'persist': {
    'outPath': './src/lib/measures', //DEFAULT_PERSIST_OUT_PATH,
    'format': ['md']
  },
  'assert': {
    'budgets': [
      {
        'resourceSizes': [
          {
            'resourceType': 'total',
            'budget': 2000
          },
          {
            'resourceType': 'script',
            'budget': 150
          },
          {
            'resourceType': 'third-party',
            'budget': 10
          }
        ],
        'resourceCounts': [
          {
            'resourceType': 'stylesheet',
            'budget': 1
          },
          {
            'resourceType': 'third-party',
            'budget': 1
          }
        ],
        'timings': [
          {
            'metric': 'first-meaningful-paint',
            'budget': 2000
          },
          {
            'metric': 'interactive',
            'budget': 2100
          }
        ]
      }
    ]
  }
};
