const path = require('path');
const chokidar = require('chokidar');

const templates = path.resolve(process.cwd(), './packages/hooks/src/**/index.md');
console.log('🚀 ~ templates:', templates);

let watcher = chokidar.watch([templates]);

watcher.on('ready', function () {
  watcher.on('change', function () {
    exec('pnpm run build:file');
  });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}
