import { readFileSync } from 'fs';
import * as path from 'path';

// project.json value
const { targets } = JSON.parse(readFileSync(path.join(__dirname, '..', '..','..','user-flow-gh-action', 'project.json')).toString());
// path to dist folder
export const OUT_PATH = targets['build-app'].options.outputPath;
