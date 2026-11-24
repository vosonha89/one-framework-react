import 'reflect-metadata';

/**
 * Abstract HTTP service contract for framework adapters.
 * @template TRequest Request type
 * @template TResponse Response type
 * @public
 */
export abstract class AbstractHttpService<TRequest = unknown, TResponse = unknown> {
    /**
     * Send a GET request.
     * @param url The endpoint URL.
     * @param params Optional query parameters.
     * @returns Promise resolving to the response.
     */
    public abstract get(url: string, params?: Record<string, unknown>): Promise<TResponse>;

    /**
     * Send a POST request.
     * @param url The endpoint URL.
     * @param body The request body.
     * @returns Promise resolving to the response.
     */
    public abstract post(url: string, body: TRequest): Promise<TResponse>;

    /**
     * Send a PUT request.
     * @param url The endpoint URL.
     * @param body The request body.
     * @returns Promise resolving to the response.
     */
    public abstract put(url: string, body: TRequest): Promise<TResponse>;

    /**
     * Send a DELETE request.
     * @param url The endpoint URL.
     * @param params Optional query parameters.
     * @returns Promise resolving to the response.
     */
    public abstract delete(url: string, params?: Record<string, unknown>): Promise<TResponse>;
}