import fs from 'fs-extra';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// 创建模板

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const require = createRequire(import.meta.url);

export const packagesDir = resolve(__dirname, '../packages/hooks/src');
export const prettierConfig = fs.readFileSync(resolve(__dirname, '../', '.prettierrc.json'), 'utf-8');
