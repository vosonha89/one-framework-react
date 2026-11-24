import { AbstractStorageService } from "@core";
import "reflect-metadata";
import { singleton } from "tsyringe";

/**
 * Web storage implementation of the abstract storage contract.
 */
@singleton()
export class StorageService extends AbstractStorageService {
  /**
   * Resolve the storage backend.
   * @param isLocal Use localStorage when true, otherwise sessionStorage.
   * @returns The storage instance.
   */
  public getStore(isLocal = true): Storage {
    if (isLocal) {
      return localStorage;
    } else {
      return sessionStorage;
    }
  }

  /**
   * Clear all storage.
   */
  public async clear(): Promise<void> {
    localStorage.clear();
    sessionStorage.clear();
  }

  /**
   * Save an object to storage.
   * @param key Storage key.
   * @param value Value to serialize.
   * @param isLocal Use localStorage when true.
   * @returns True when saved successfully.
   */
  public async saveObject<T>(
    key: string,
    value: T,
    isLocal = true,
  ): Promise<boolean> {
    const me = this;
    try {
      const store = me.getStore(isLocal);
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

  /**
   * Get an object from storage.
   * @param key Storage key.
   * @param isLocal Use localStorage when true.
   * @returns The deserialized object or undefined.
   */
  public async getObject<T>(
    key: string,
    isLocal = true,
  ): Promise<T | undefined> {
    const me = this;
    try {
      const store = me.getStore(isLocal);
      const data = store.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      } else {
        return undefined;
      }
    } catch (ex) {
      console.log(ex);
      return undefined;
    }
  }

  /**
   * Delete an object from storage.
   * @param key Storage key.
   * @param isLocal Use localStorage when true.
   * @returns True when removed successfully.
   */
  public async deleteObject(key: string, isLocal = true): Promise<boolean> {
    const me = this;
    try {
      const store = me.getStore(isLocal);
      store.removeItem(key);
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}