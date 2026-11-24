import 'reflect-metadata';

/**
 * Abstract routing service contract for framework adapters.
 * @public
 */
export abstract class AbstractRoutingService {
    /**
     * Navigate to a specific path.
     * @param path The route path.
     * @param params Optional route parameters.
     * @returns void
     */
    public abstract navigate(path: string, params?: Record<string, unknown>): void;

    /**
     * Replace the current route.
     * @param path The route path.
     * @param params Optional route parameters.
     * @returns void
     */
    public abstract replace(path: string, params?: Record<string, unknown>): void;

    /**
     * Go back in history.
     * @returns void
     */
    public abstract back(): void;
}