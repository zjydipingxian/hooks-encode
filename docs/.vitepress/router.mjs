const Router = {
  // Request: ['useRequest', 'useAxios'],
  Dom: [
    'useEventListener',
    'useWindowSize',
    'useClickAway',
    'useHover',
    // 'useSize',
    'useRect',
    // 'useKeyPress',
    // 'useFullscreen',
    // 'useDocumentVisibility',
    // 'useHover',
    // 'useInViewport',
  ],
  State: [
    // 'useUrlState',
    'useToggle',
    'useBoolean',
    // 'useLocalStorageState',
    // 'useLocalforage',
    // 'useThrottle',
    // 'useDebounce',
  ],
  // Data: ['useTable'],
  Worker: ['useCountDown'],
  // 'useWorkerFunction'
};

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


getRouterConfig()


export {
  getRouterConfig
}