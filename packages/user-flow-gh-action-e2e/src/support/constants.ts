import { readFileSync } from 'fs';
import * as path from 'path';

const { targets } = JSON.parse(readFileSync(path.join(__dirname, '..', '..','..','user-flow-gh-action', 'project.json')).toString());

export const OUT_PATH = targets.build.options.outputPath;
