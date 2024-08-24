/* eslint-disable no-unused-vars */
import { ref, Ref, shallowRef, toRaw } from 'vue';
import { createSingletonPromise, getGlobal } from '../utils';
import useSupported from '../useSupported';
import useEventListener from '../useEventListener';

const _global = getGlobal<Window>();

/**
 * 定义了usePermission钩子函数的返回类型
 * 该类型是一个只读的引用，指向PermissionState对象或undefined
 * 使用Ref类型确保组件可以响应权限状态的变化
 */
export type UsePermissionReturn = Readonly<Ref<PermissionState | undefined>>;

// 定义通用权限描述符类型，
export type GeneralPermissionDescriptor = PermissionDescriptor | { name: PermissionName };

export interface ConfigurableNavigator {
  /*
   * Specify a custom `navigator` instance, e.g. working with iframes or in testing environments.
   */
  navigator?: Navigator;
}

export interface UsePermissionOptions<Controls extends boolean> extends ConfigurableNavigator {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls;
}
// 此接口定义了包含权限状态、是否支持的标记和查询权限状态的方法的对象。
export interface UsePermissionReturnWithControls {
  state: UsePermissionReturn;
  isSupported: Ref<boolean>;
  query: () => Promise<PermissionStatus | undefined>;
}

function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options?: UsePermissionOptions<false>,
): UsePermissionReturn;

function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options: UsePermissionOptions<true>,
): UsePermissionReturnWithControls;

function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options: UsePermissionOptions<boolean> = {},
): UsePermissionReturn | UsePermissionReturnWithControls {
  // 不支持权限管理
  if (!(_global && _global.navigator)) {
    return ref(undefined);
  }

  const { controls = false, navigator = _global && _global.navigator } = options;

  const isSupported = useSupported(() => navigator && 'permissions' in navigator);
  const permissionStatus = shallowRef<PermissionStatus>();

  // 请求权限的名称  https://developer.mozilla.org/zh-CN/docs/Web/API/PermissionStatus/name
  const desc =
    typeof permissionDesc === 'string'
      ? ({ name: permissionDesc } as PermissionDescriptor)
      : (permissionDesc as PermissionDescriptor);

  // https://developer.mozilla.org/zh-CN/docs/Web/API/PermissionStatus/state
  const state = shallowRef<PermissionState | undefined>();

  const update = () => {
    state.value = permissionStatus.value?.state ?? 'prompt';
  };

  useEventListener('change', update);

  // 创建一个单例Promise对象，用于处理权限查询逻辑
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Permissions/query
  const query = createSingletonPromise(async () => {
    // 如果当前环境不支持权限管理，则直接返回
    if (!isSupported.value) return;

    if (!permissionStatus.value) {
      try {
        permissionStatus.value = await navigator!.permissions.query(desc);
      } catch {
        permissionStatus.value = undefined;
      } finally {
        update();
      }
    }

    if (controls)
      // 根据一个 Vue 创建的代理返回其原始对象
      return toRaw(permissionStatus.value);
  });

  query();

  if (controls) {
    return {
      state: state as UsePermissionReturn,
      isSupported,
      query,
    };
  } else {
    return state as UsePermissionReturn;
  }
}

export default usePermission;
