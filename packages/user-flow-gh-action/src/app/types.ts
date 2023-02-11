export type GhActionInputs = {
  // global
  rcPath: string;
  verbose: boolean;
  dryRun: boolean;
  keepComments: boolean;
  // collect
  url: string;
  // assert
  // upload
  serverBaseUrl: string;
  serverToken: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
}
