import 'reflect-metadata';

/**
 * Abstract validation service contract for framework adapters.
 * @template TModel Model type to validate
 * @public
 */
export abstract class AbstractValidationService<TModel = unknown> {
    /**
     * Validate a model instance.
     * @param model The model to validate.
     * @returns True if valid, false otherwise.
     */
    public abstract validate(model: TModel): boolean;

    /**
     * Get validation errors for a model instance.
     * @param model The model to check.
     * @returns An array of error messages or objects.
     */
    public abstract getErrors(model: TModel): Array<string | { property: string; error: string }>;
}