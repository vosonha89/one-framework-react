/**
 * Abstract type for data
 */
export abstract class AbstractType {
    public abstract mapResponse<TResponse>(response: TResponse): void;
}

/**
 * Any Type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;

/**
 * Undefined Type
 */
export type UndefinedType = undefined;