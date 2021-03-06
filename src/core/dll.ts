/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {EventEmitter} from '../util/eventemitter';

/**
 *  The Dll class allows access to functions in DLL files that are placed within
 *  the Scriptdlls folder.
 *
 *  The class also emits two events for developers to know when the user
 *  changes the DLL permission setting for the plugin through the permissions
 *  window.
 *
 *  The following events are emitted.
 *    - `access-granted`
 *    - `access-revoked`
 *
 *  Use the `on(event: string, handler: Function)` function to listen to events.
 *
 */
export class Dll extends EventEmitter {
  /**
   *  param: (path: string)
   *
   *  Loads one or more DLLs for the plugin to use. Currently, only Xjs.dll is
   *  auto-loaded and does not require loading. Loading DLLs will trigger a
   *  notification for the user, requesting access to be granted to DLL files.
   *  Your plugin should only call this once, at the beginning of execution.
   *
   *  Paths are relative to the main XBC application folder, so sample usage is:
   *
   *  ```javascript
   *  Dll.load(['Scriptdlls\\SplitMediaLabs\\XjsEx.dll']);
   *  ```
   */
  static load(path: string[]) {
    exec('LoadDll', path.join(','));
  }

  static _emitter = new Dll();

  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event.
   */
  static emit(event: string, ...params: any[]) {
    params.unshift(event);
    Dll._emitter.emit.apply(Dll._emitter, params);
  }

  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits. Currently there are two:
   *  `access-granted` and `access-revoked`.
   */
  static on(event: string, handler: Function) {
    Dll._emitter.on(event, handler);
  }

  /**
   *  param: (funcName: string, ...params: string[])
   *
   *  return: string (see DLL documentation)
   *
   *  Calls a function from a loaded "safe" DLL. The only safe DLL we are
   *  currently exposing is `Xjs.dll`.
   */
  static call(func: string, ...params: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const funcCall = 'CallDll';
      params.unshift(func);
      params.unshift(funcCall);
      const retValue: string = exec.apply(this, params);
      if (retValue !== undefined) {
        resolve(retValue);
      } else {
        reject('DLL call not accessible.');
      }
    });
  }

  /**
   *  param: (funcName: string, ...params: string[])
   *
   *  return: string (see DLL documentation)
   *
   *  Calls a function from a loaded "unsafe" DLL. The first DLL containing
   *  the function name will be called, so you need to ensure there are no
   *  function name collisions among DLLs for functions you require.
   *
   *  Some DLLs have callbacks. Assign a handler function to that callback in
   *  the global namespace, and the DLL will call that function accordingly.
   *
   *  See the documentation of your specific DLL for more details.
   */
  static callEx(func: string, ...params: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const funcCall = 'CallDllEx';
      params.unshift(func);
      params.unshift(funcCall);
      const retValue: string = exec.apply(this, params);
      if (retValue !== undefined) {
        resolve(retValue);
      } else {
        reject('DLL call not accessible.');
      }
    });
  }


  /**
   *  return: Promise<boolean>
   *
   *  Determines if user has granted DLL access for this plugin, or whether
   *  DLL security is disabled altogether.
   */
  static isAccessGranted(): Promise<boolean> {
    return new Promise(resolve => {
      resolve(exec('CheckDllGrant') === '1');
    });
  }
}

window.UpdateLocalProperty = (prop: string, value: string) => {
  if (prop === 'prop:dlldogrant') {
    const granted: boolean = value === '1';
    if (granted) {
      Dll.emit('access-granted');
    } else {
      Dll.emit('access-revoked');
    }
  }
};

window.Setdlldogrant = (value: string) => {
  const granted: boolean = value === '1';
  if (granted) {
    Dll.emit('access-granted');
  } else {
    Dll.emit('access-revoked');
  }
}
