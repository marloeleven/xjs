
/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemEffect, IItemEffect, MaskEffect} from './ieffects';
import {ItemTransition, IItemTransition} from './itransition';
import {ItemPlayback, IItemPlayback, ActionAfterPlayback} from './iplayback';
import {IItemAudio, ItemAudio} from './iaudio';
import {CuePoint} from './cuepoint';
import {Item} from './item';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';

/**
 * The MediaItem class represents a playable media file.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemPlayback Core/IItemPlayback}
 *
 *  All methods marked as *Chainable* resolve with the original `MediaItem`
 *  instance.
 */
export class MediaItem extends Item implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, IItemPlayback, IItemAudio, IItemEffect {

  /**
   * return: Promise<object>
   *
   * Gets file information such as codecs, bitrate, resolution, etc.
   *
   * sample file info object format:
   *
   * {
   *  "audio": {
   *    "duration":"1436734690",
   *    "samplerate":"44100",
   *    "bitrate":"128000",
   *    "codec":"mp3"},
   *  "video":{
   *    "frameduration":"333670",
   *    "bitrate":"1132227",
   *    "duration":"1436436440",
   *    "height":"240",
   *    "width":"320",
   *    "codec":"mpeg4"}
   * }
   *
   * #### Usage
   *
   * ```javascript
   * mediaItem.getFileInfo().then(function(value) {
   *   // Do something with the value
   *   var audioCodec;
   *   if (typeof value['audio'] !== 'undefined' && typeof value['audio']['codec']) {
   *     audioCodec = value['audio']['codec'];
   *   }
   * });
   * ```
   */
  getFileInfo(): Promise<Object> {
    return new Promise((resolve, reject) => {
      iItem.get('FileInfo', this._id).then(val => {
        try {
          let fileInfoObj: Object = {};
          let fileInfoJXON = JXON.parse(val);
          if (typeof fileInfoJXON['children'] !== 'undefined'
            && fileInfoJXON['children'].length > 0) {
            let fileInfoChildren = fileInfoJXON['children'];
            for (var i = fileInfoChildren.length - 1; i >= 0; i--) {
              var child = fileInfoChildren[i];
              var childObj: Object = {};
              var childObjKeys = Object.keys(child);
              for (var j = childObjKeys.length - 1; j >= 0; j--) {
                var key = childObjKeys[j];
                if (key !== 'value' && key !== 'tag') {
                  childObj[key] = child[key];
                }
              }
              var tag = child['tag'];
              fileInfoObj[tag] = childObj;
            }
            resolve(fileInfoObj);
          } else {
            resolve(fileInfoObj);
          }
        } catch (e) {
          reject(Error('Error retrieving file information'));
        }
      });
    });
  }

  // ItemLayout

  /**
   * See: {@link #core/IItemLayout#isKeepAspectRatio isKeepAspectRatio}
   */
  isKeepAspectRatio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isPositionLocked isPositionLocked}
   */
  isPositionLocked: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isEnhancedResizeEnabled isEnhancedResizeEnabled}
   */
  isEnhancedResizeEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#getCanvasRotate getCanvasRotate}
   */
  getCanvasRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getCropping getCropping}
   */
  getCropping: () => Promise<Object>;

  /**
   * See: {@link #core/IItemLayout#getEnhancedRotate getEnhancedRotate}
   */
  getEnhancedRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getPosition getPosition}
   */
  getPosition: () => Promise<Rectangle>;

  /**
   * See: {@link #core/IItemLayout#getRotateY getRotateY}
   */
  getRotateY: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateX getRotateX}
   */
  getRotateX: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateZ getRotateZ}
   */
  getRotateZ: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#setCanvasRotate setCanvasRotate}
   */
  setCanvasRotate: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition: (value: Rectangle) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ: (value: number) => Promise<MediaItem>;

  // ItemColor

  /**
   * See: {@link #core/IItemColor#getTransparency getTransparency}
   */
  getTransparency: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBrightness getBrightness}
   */
  getBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getContrast getContrast}
   */
  getContrast: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getHue getHue}
   */
  getHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getSaturation getSaturation}
   */
  getSaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBorderColor getBorderColor}
   */
  getBorderColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemColor#isFullDynamicColorRange isFullDynamicColorRange}
   */
  isFullDynamicColorRange: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemColor#setTransparency setTransparency}
   */
  setTransparency: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor: (value: Color) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<MediaItem>;

  // ItemChroma

  /**
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;

  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<MediaItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB

  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;

  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<MediaItem>;

  // CHROMA LEGACY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<MediaItem>;

  // CHROMA KEY RGB MODE

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<MediaItem>;

  // COLOR KEY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<MediaItem>;

  // ItemTransition

  /**
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;

  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition: (value: Transition) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;

  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<MediaItem>;

  // ItemPlayback

  /**
   * See: {@link #core/IItemPlayback#isSeekable isSeekable}
   */
  isSeekable: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackPosition getPlaybackPosition}
   */
  getPlaybackPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackPosition setPlaybackPosition}
   */
  setPlaybackPosition: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackDuration getPlaybackDuration}
   */
  getPlaybackDuration: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#isPlaying isPlaying}
   */
  isPlaying: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setPlaying setPlaying}
   */
  setPlaying: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackStartPosition getPlaybackStartPosition}
   */
  getPlaybackStartPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackStartPosition setPlaybackStartPosition}
   */
  setPlaybackStartPosition: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackEndPosition getPlaybackEndPosition}
   */
  getPlaybackEndPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackEndPosition setPlaybackEndPosition}
   */
  setPlaybackEndPosition: (value: number) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#getActionAfterPlayback getActionAfterPlayback}
   */
  getActionAfterPlayback: () => Promise<ActionAfterPlayback>;

  /**
   * See: {@link #core/IItemPlayback#setActionAfterPlayback setActionAfterPlayback}
   */
  setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#isAutostartOnSceneLoad isAutostartOnSceneLoad}
   */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setAutostartOnSceneLoad setAutostartOnSceneLoad}
   */
  setAutostartOnSceneLoad: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#isForceDeinterlace isForceDeinterlace}
   */
  isForceDeinterlace: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setForceDeinterlace setForceDeinterlace}
   */
  setForceDeinterlace: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#isRememberingPlaybackPosition isRememberingPlaybackPosition}
   */
  isRememberingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setRememberingPlaybackPosition setRememberingPlaybackPosition}
   */
  setRememberingPlaybackPosition: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#isShowingPlaybackPosition isShowingPlaybackPosition}
   */
  isShowingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setShowingPlaybackPosition setShowingPlaybackPosition}
   */
  setShowingPlaybackPosition: (value: boolean) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#getCuePoints getCuePoints}
   */
  getCuePoints: () => Promise<CuePoint[]>;

  /**
   * See: {@link #core/IItemPlayback#setCuePoints setCuePoints}
   */
  setCuePoints: (value: CuePoint[]) => Promise<MediaItem>;

  // Inherited from base class, no need to redefine
  // getValue: () => Promise<string>;
  // setValue: (value: string) => Promise<MediaItem>;

  /**
   * See: {@link #core/IItemPlayback#isAudio isAudio}
   */
  isAudio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#isVideo isVideo}
   */
  isVideo: () => Promise<boolean>;

  // ItemAudio

  /** See: {@link #core/IItemAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IItemAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<MediaItem>;

  /** See: {@link #core/IItemAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<MediaItem>;

  /** See: {@link #core/IItemAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

  // ItemEffect

  /** See: {@link #core/IItemEffect#getMaskEffect getMaskEffect} */
  getMaskEffect: () => Promise<MaskEffect>;

  /** See: {@link #core/IItemEffect#setMaskEffect setMaskEffect} */
  setMaskEffect: (value: MaskEffect) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectRadius getBorderEffectRadius} */
  getBorderEffectRadius: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectRadius setBorderEffectRadius} */
  setBorderEffectRadius: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectThickness getBorderEffectThickness} */
  getBorderEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectThickness setBorderEffectThickness} */
  setBorderEffectThickness: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectOpacity getBorderEffectOpacity} */
  getBorderEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectOpacity setBorderEffectOpacity} */
  setBorderEffectOpacity: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectColor getBorderEffectColor} */
  getBorderEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setBorderEffectColor setBorderEffectColor} */
  setBorderEffectColor: (value: Color) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectColor getShadowEffectColor} */
  getShadowEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setShadowEffectColor setShadowEffectColor} */
  setShadowEffectColor: (value: Color) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectThickness getShadowEffectThickness} */
  getShadowEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectThickness setShadowEffectThickness} */
  setShadowEffectThickness: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectBlur getShadowEffectBlur} */
  getShadowEffectBlur: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectBlur setShadowEffectBlur} */
  setShadowEffectBlur: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOpacity getShadowEffectOpacity} */
  getShadowEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOpacity setShadowEffectOpacity} */
  setShadowEffectOpacity: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetX getShadowEffectOffsetX} */
  getShadowEffectOffsetX: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetX setShadowEffectOffsetX} */
  setShadowEffectOffsetX: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetY getShadowEffectOffsetY} */
  getShadowEffectOffsetY: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetY setShadowEffectOffsetY} */
  setShadowEffectOffsetY: (value: number) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#getFileMask getFileMask} */
  getFileMask: () => Promise<string>;

  /** See: {@link #core/IItemEffect#setFileMask setFileMask} */
  setFileMask: (value: string) => Promise<MediaItem>;

  /** See: {@link #core/IItemEffect#isFileMaskingGuideVisible isFileMaskingGuideVisible} */
  isFileMaskingGuideVisible: () => Promise<boolean>;

  /** See: {@link #core/IItemEffect#showFileMaskingGuide showFileMaskingGuide} */
  showFileMaskingGuide: (value: boolean) => Promise<MediaItem>;
}

applyMixins(MediaItem, [ItemLayout, ItemColor, ItemChroma,
  ItemTransition, ItemPlayback, ItemAudio, ItemEffect]);
