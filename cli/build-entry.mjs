import { object as render } from 'json-templater';
import { EOL } from 'os';

var IMPORT_TEMPLATE = "import {{name}} from './{{name}}';";
var MAIN_TEMPLATE = `
{{imports}}

export{
{{exports}}
}
`;

var includeHooksTemplate = [];
/**
 * @param {Array} packagesDir  包的名字，
 * @param {String} name 新加的包名
 * @param {Object} ctx  上下文
 */
export default function buildEntry(packagesDir) {
  packagesDir.forEach((dir) => {
    // 需要被 import 进去的模板
    includeHooksTemplate.push(
      render(IMPORT_TEMPLATE, {
        name: dir,
      }),
    );
  });
  console.log('🚀 ~ packagesDir.forEach ~ includeHooksTemplate:', includeHooksTemplate);

  const template = render(MAIN_TEMPLATE, {
    imports: includeHooksTemplate.join(EOL),
    exports: packagesDir.map((v) => `  ${v}`).join(',' + EOL),
  });

  return template;
}
