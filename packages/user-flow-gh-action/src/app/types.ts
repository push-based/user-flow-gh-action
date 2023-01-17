export type GhActionInputs = {
  // global
  verbose: boolean,
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
