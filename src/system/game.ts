/// <reference path="../../defs/es6-promise.d.ts" />

import {Rectangle as Rectangle} from '../util/rectangle';
import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';
import {Addable} from './iaddable';
import {App as iApp} from '../internal/app';

/**
 * The Game Class is the object returned by {@link #system/System System Class'}
 * getGames method. It provides you with methods to fetch the game object's
 * attributes, as well as methods to add any game to the current scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 * var xml;
 *
 * System.getGames().then(function(games) {
 *  for (var i in games) {
 *    if(games[i].isFullscreen()) {
 *      games[i].addToScene();
 *    }
 *  }
 * });
 * ```
 */
export class Game implements Addable {

  private _pid: number;
  private _handle: number;
  private _hwnd: number;
  private _gapitype: string;
  private _width: number;
  private _height: number;
  private _flags: number;
  private _wndname: string;
  private _lastframets: number;
  private _fpsRender: number;
  private _fpsCapture: number;
  private _imagename: string;
  private _replace: string;
  private _gameTrack: boolean;

  /**
   * return: number
   *
   * Gets the game's process ID.
   *
   * #### Usage
   *
   * ```javascript
   * var processId = game.getPid();
   * ```
   */
  getPid() {
    return this._pid;
  }

  /**
   * return: number
   *
   * Gets the Graphics API handle.
   *
   * #### Usage
   *
   * ```javascript
   * var handle = game.getHandle();
   * ```
   */
  getHandle() {
    return this._handle;
  }

  /**
   * return: number
   *
   * Gets the window handle.
   *
   * #### Usage
   *
   * ```javascript
   * var windowHandle = game.getWindowHandle();
   * ```
   */
  getWindowHandle() {
    return this._hwnd;
  }

  /**
   * return: string
   *
   * Gets the Graphics API type.
   *
   * #### Usage
   *
   * ```javascript
   * var gApiType = game.getGapiType();
   * ```
   *
   * #### Possible Values
   *
   * ```
   * OGL, DX8, DX8_SwapChain, DX9, DX9Ex, DX9_SwapChain,
   * DX9_PresentEx, DX10, DX11, DX11.1, DX11.1_Present1
   * ```
   */
  getGapiType() {
    return this._gapitype;
  }

  /**
   * return: Rectangle
   *
   * Gets the game resolution in pixels.
   *
   * #### Usage
   *
   * ```javascript
   * var resolution = game.getResolution();
   * ```
   */
  getResolution() {
    return Rectangle.fromDimensions(this._width, this._height);
  }

  /**
   * return: boolean
   *
   * Checks if game has exclusive full screen.
   *
   * #### Usage
   *
   * ```javascript
   * var isFullscreen = game.isFullscreen();
   * ```
   */
  isFullscreen() {
    return this._flags === 1 ? true: false;
  }

  /**
   * return: string
   *
   * Gets the window title
   *
   * #### Usage
   *
   * ```javascript
   * var windowName = game.getWindowName();
   * ```
   */
  getWindowName() {
    return this._wndname;
  }

  /**
   * return: number
   *
   * Gets timestamp of last frame in milliseconds.
   *
   * #### Usage
   *
   * ```javascript
   * var lastFrameTimestamp = game.getLastFrameTimestamp();
   * ```
   */
  getLastFrameTimestamp() {
    return this._lastframets;
  }

  /**
   * return: number
   *
   * Get the FPS Render of the game
   */
  getFpsRender() {
    return this._fpsRender;
  }

  /**
   * return: number
   *
   * Get the Captured FPS of the game
   */
  getFpsCapture() {
    return this._fpsCapture;
  }

  /**
   * return: string
   *
   * Get the image name of the game
   */
  getImageName() {
    return this._imagename;
  }

  /**
   * return: string
   *
   * Get the replace image value of the game
   */
  getReplace() {
    return this._replace;
  }

  /**
   * param: gameJSON<JXON>
   * ```
   * return: Game
   * ```
   *
   * Converts a JSON object into a Game object
   *
   * #### Usage
   *
   * ```javascript
   * var XJS = require('xjs');
   * var game = XJS.Game.parse(jsonObj);
   * ```
   */
  static parse(jxon: JXON): Game {
    var g = new Game();

    g._pid = jxon['pid'] !== undefined ? parseInt(jxon['pid']) : undefined;
    g._handle = jxon['handle'] !== undefined ? parseInt(jxon['handle']) :
      undefined;
    g._hwnd = jxon['hwnd'] !== undefined ? parseInt(jxon['hwnd']) : undefined;
    g._gapitype = jxon['GapiType'];
    g._width = jxon['width'] !== undefined ? parseInt(jxon['width']) :
      undefined;
    g._height = jxon['height'] !== undefined ? parseInt(jxon['height']) :
      undefined;
    g._flags = jxon['flags'] !== undefined ? parseInt(jxon['flags']) :
      undefined;
    g._wndname = jxon['wndname'];
    g._lastframets = jxon['lastframets'] !== undefined ?
      parseInt(jxon['lastframets']) : undefined;
    g._fpsRender = jxon['fpsRender'] !== undefined ? Number(jxon['fpsRender']) :
      undefined;
    g._fpsCapture = jxon['fpsCapture'] !== undefined ?
      Number(jxon['fpsCapture']) : undefined;
    g._imagename = jxon['imagename'];
    g._replace = jxon['replace'];

    return g;
  }

  /**
   * return: XML
   *
   * Converts Game object into an XML object
   *
   * #### Usage
   *
   * ```javascript
   * var gameXML = game.toXML();
   * ```
   */
  toXML() : XML {
    var gamesource = new JXON();

    gamesource.tag = 'src';
    gamesource['pid'] = this._pid;
    gamesource['handle'] = this._handle;
    gamesource['hwnd'] = this._hwnd;
    gamesource['gapitype'] = this._gapitype;
    gamesource['width'] = this._width;
    gamesource['height'] = this._height;
    gamesource['flags'] = this._flags;
    gamesource['wndname'] = this._wndname;
    gamesource['lastframets'] = this._lastframets;
    gamesource['selfclosing'] = true;

    return XML.parseJSON(gamesource);
  }

  /**
   *  Adds this game to the current scene.
   */
  addToScene(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.callFunc('addgamesource', 'dev:' + this.toXML()).then(() => {
        resolve(true);
      });
    });
  }



  static _autoDetect: Game;

  /**
   *  return: Game
   *
   *  Returns a special Game object that may be added to the stage. This
   *  object automatically detects any compatible games that are running
   *  and focused, and changes the displayed game on the stage accordingly.
   *
   *  #### Usage
   *
   * ```javascript
   * var xjs = require('xjs');
   * xjs.Game.autoDetect().addToScene();
   * ```
   */
  static autoDetect(): Game {
    if (Game._autoDetect === undefined) {
      Game._autoDetect = new Game();
      let ad = Game._autoDetect;
      ad._pid = 0;
      ad._handle = 0;
      ad._hwnd = 0;
      ad._gapitype = "";
      ad._width = 0;
      ad._height = 0;
      ad._flags = 0;
      ad._wndname = "";
      ad._lastframets = 0;
      ad._fpsRender = 0;
      ad._fpsCapture = 0;
      ad._imagename = "";

      Game._autoDetect.addToScene = function() {
        return new Promise(resolve => {
          let adstring = '<item GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt; " name="Game: Auto Detect"  type="7" pos_left="0" pos_top="0" pos_right="0.5" pos_bottom="0.5"/>';
          iApp.callFunc('additem', adstring).then(() => {
            resolve(true);
          });
        });
      };
    }

    return Game._autoDetect;
  }
}
