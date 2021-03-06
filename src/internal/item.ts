/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from './internal';
import {Environment} from '../core/environment';
import {minVersion, versionCompare, getVersion} from './util/version';

export class Item {

  private static baseID: string;

  private static MAX_SLOTS: number = 2;
  private static lastSlot: number = Item.MAX_SLOTS - 1;
  private static itemSlotMap: string[] = [];
  private static islockedSourceSlot: boolean = false;

  /** Prepare an item for manipulation */
  static attach(itemID: string): number {
    let slot = Item.itemSlotMap.indexOf(itemID);
    if (slot === -1) {
      slot = ++Item.lastSlot % Item.MAX_SLOTS;
      if (Item.islockedSourceSlot && slot === 0) {
        ++slot; // source cannot attach to first slot
      }
      Item.lastSlot = slot;
      Item.itemSlotMap[slot] = itemID;
      if (!Environment.isSourcePlugin()) {
        exec('SearchVideoItem' +
          (String(slot) === '0' ? '' : (slot + 1)),
          itemID
        );
      } else {
        let hasGlobalSources = versionCompare(getVersion())
          .is
          .greaterThan(minVersion);

        if (hasGlobalSources) {
          exec('AttachVideoItem' + (slot + 1),
            itemID
          );
        } else {
          exec('AttachVideoItem' +
            (String(slot) === '0' ? '' : (slot + 1)),
            itemID
          );
        }
      }
    }
    return slot;
  }

  /** used for source plugins. lock an id to slot 0 */
  static lockSourceSlot(itemID: string) {
    if (itemID !== undefined) {
      Item.islockedSourceSlot = true;
      Item.itemSlotMap[0] = itemID;
    } else {
      Item.islockedSourceSlot = false;
      Item.itemSlotMap[0] = '';
    }
  }

  /** Get an item's local property asynchronously */
  static get(name: string, id?: string): Promise<string> {
    return new Promise(resolve => {
      let slot = id !== undefined && id !== null ? Item.attach(id) : -1;
      let hasGlobalSources = versionCompare(getVersion())
        .is
        .greaterThan(minVersion);

      if (
        (!Environment.isSourcePlugin() && String(slot) === '0') ||
        (
          Environment.isSourcePlugin() &&
          String(slot) === '0' &&
          !hasGlobalSources
        )
      ) {
        slot = -1;
      }

      exec('GetLocalPropertyAsync' +
        (String(slot) === '-1' ? '' : slot + 1),
        name,
        val => {
          resolve(val);
        });
    });
  }

  /** Sets an item's local property */
  static set(name: string, value: string, id?: string): Promise<boolean> {
    return new Promise(resolve => {
      let slot = id !== undefined && id !== null ? Item.attach(id) : -1;
      let hasGlobalSources = versionCompare(getVersion())
        .is
        .greaterThan(minVersion);

      if (
        (!Environment.isSourcePlugin() && String(slot) === '0') ||
        (
          Environment.isSourcePlugin() &&
          String(slot) === '0' &&
          !hasGlobalSources
        )
      ) {
        slot = -1;
      }

      exec('SetLocalPropertyAsync' +
        (String(slot) === '-1' ? '' : slot + 1),
        name,
        value,
        val => {
          resolve(!(Number(val) < 0));
        });
    });
  }

  /** helper function to get current source on init */
  static setBaseId(id: string): void {
    Item.baseID = id;
  }

  /** helper function for Source.getCurrentSource() */
  static getBaseId(): string {
    return Item.baseID;
  }
}
