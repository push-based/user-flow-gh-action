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
console.log('process.argv', process.argv[1], process.argv);
/*
const projectName = 'action';
const projectJsonPath = `./packages/${projectName}/project.json`;
const projectJson: ProjectJson = JSON.parse(fs.readFileSync(projectJsonPath, {encoding: 'utf8'}));

const actionFileName = 'action.yml';
const distPath = join(projectJson.targets['build-app'].options.outputPath);
const distActionPath = join(projectJson.targets['build-app'].options.outputPath, actionFileName);
const rootActionPath = join('./', actionFileName);

console.log(`Process post build`);
const distActionString: string = fs.readFileSync(distActionPath, {encoding: 'utf8'});
const matcher = /^(  main: ')([a-zA-Z\/.])*(')$/m;

const newYml = distActionString.replace(matcher, `$1${join(distPath, 'main.js')}$3`);
console.log('updated yml');
fs.writeFileSync(rootActionPath, newYml, {encoding: 'utf8'});
fs.rmSync(distActionPath);

console.log(`Moved action.yml from '${distPath}' to ${rootActionPath}`);
*/
