/**
 * Returns the name of a class or object with type checking.
 */
export function nameof<T>(name: keyof T) {
    return name;
}
