export type GhActionInputs = {
  // global
  onlyComments?: boolean;
  rcPath: string;
  verbose: boolean;
  dryRun: boolean;
  // collect
  url?: string;
  ufPath?: string;
  serveCommand?: string;
  awaitServeStdout?: string;
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
