import * as fs from 'fs';
import {join} from 'path';

type ProjectJson = {
  sourceRoot: string;
  targets: {
    "build-app": {
      options: {
        outputPath: string
      }
    }
  }
};

const projectName = process.argv[2];
const projectJsonPath = `./packages/${projectName}/project.json`;
const projectJson: ProjectJson = JSON.parse(fs.readFileSync(projectJsonPath, {encoding: 'utf8'}));

const actionFileName = 'action.yml';
const distPath = join(projectJson.targets['build-app'].options.outputPath);
const distActionPath = join(projectJson.targets['build-app'].options.outputPath, actionFileName);
const rootPath = process.cwd();
const rootActionPath = join(rootPath, actionFileName);

console.log(`Post build executing in: ${rootPath}`);
console.log(`Process post build distPath: ${distPath}`);
if(!fs.existsSync(distPath)) {
  throw new Error(`distPath: ${distPath} not present`);
}
const distActionString: string = fs.readFileSync(distActionPath, {encoding: 'utf8'});
if(!distActionString) {
  throw new Error(`distPath: ${distPath} has no content`);
}
// run: node ${{ github.action_path }}/dist/packages/user-flow-gh-action/main.js
const matcher = `run: node ./dist/packages/user-flow-gh-action/main.js`;
const newYml = distActionString.replace(matcher, 'run: node ${{ github.action_path }}/dist/packages/user-flow-gh-action/main.js');
console.log(`updated yml ${distActionPath}`);

fs.writeFileSync(rootActionPath, newYml, {encoding: 'utf8'});
console.log(`Wrote action to rootActionPath: ${rootActionPath}`);
fs.rmSync(distActionPath);

console.log(`Moved action.yml from '${distPath}' to ${rootPath}`);
