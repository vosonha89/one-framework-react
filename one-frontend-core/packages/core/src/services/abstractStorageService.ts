import 'reflect-metadata';

export abstract class AbstractStorageService {
    /**
     * Clear all storage
     */
    public abstract clear(): Promise<void>;

    /**
     * Save object to storage
     * @param key
     * @param value
     */
    public abstract saveObject<T>(key: string, value: T): Promise<boolean>;

    /**
     * Get object from storage
     * @param key
     */
    public abstract getObject<T>(key: string): Promise<T | undefined>;

    /**
    * Delete object to storage
    * @param key
    * @param value
    */
    public abstract deleteObject(key: string): Promise<boolean>;
}