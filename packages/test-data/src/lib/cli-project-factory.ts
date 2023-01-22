import { CliProject, ProjectConfig } from '@push-based/node-cli-testing';

export class CliProjectFactory {
  static async create<T extends {}>(cfg: ProjectConfig<T>): Promise<CliProject<T>> {
    const prj = new CliProject<T>();
    await prj._setup(cfg);
    return prj;
  }
}
