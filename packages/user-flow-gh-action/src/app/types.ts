export type GhActionInputs = {
  // global
  rcPath: string;
  verbose: boolean;
  dryRun: boolean;
  // collect
  url: string;
  ufPath?: string;
  serveCommand?: string;
  awaitServerStdout?: string;
  configPath?: string;
  // persist
  format?: string[];
  outPath?: string;
  // assert
  budgetPath?: string;
  // upload
  //serverBaseUrl: string;
  //serverToken: string;
  //basicAuthUsername: string;
  //basicAuthPassword: string;
}
