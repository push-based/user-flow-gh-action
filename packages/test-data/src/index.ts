import { readFileSync } from 'fs';
import * as path from 'path';
export * from './lib/reports/index';
export * from './lib/sandbox/remote/index';

// project.json value
const { targets } = JSON.parse(readFileSync(path.join(__dirname, '..', '..','..','packages','user-flow-gh-action', 'project.json')).toString());
// path to dist folder
export const BIN_PATH = targets['build-app'].options.outputPath;
