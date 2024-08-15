import Router from './generate-router.js'

function getRouterConfig(langPrefix = '/') {
  return [
    ...Object.entries(Router).map(([text, children]) => ({
      text,
      items: children.map(hookName => ({
        link: `${langPrefix}${hookName}/`,
        text: hookName,
      })),
    })),
  ];
}

export {
  getRouterConfig
}