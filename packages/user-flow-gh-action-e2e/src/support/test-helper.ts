import { CliProjectFactory } from '../../../test-data/src/lib/cli-project-factory';

export function withProject<T extends { }>(cfg: any, fn: (prj: unknown) => Promise<void>): () => Promise<void> {
  return async () => {
    let prj = await CliProjectFactory.create<T>(cfg);
    await prj.setup();
    //  const cwd = process.cwd();
    //  process.chdir(prj.root);
    await fn(prj).finally(async () => {
      //  process.chdir(cwd);
      await prj.teardown();
    });
  }
}
