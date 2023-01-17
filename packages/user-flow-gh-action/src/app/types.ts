export type VerboseValue = 'on' | 'off';
export type GhActionInputs = {
  // global
  verbose: VerboseValue,
  rcPath: string;
  // collect
  url: string;
  // assert
  // upload
  serverBaseUrl: string;
  serverToken: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
}
