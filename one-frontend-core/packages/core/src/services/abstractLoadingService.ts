import 'reflect-metadata';

export abstract class AbstractLoadingService {
    /**
     * For showing loading
     */
    public abstract show(): boolean;

    /**
     * For hidden loading
     */
    public abstract hide(): boolean;
}