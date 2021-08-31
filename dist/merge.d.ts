/** @fileoverview Merge utils. */
/**
 * Merges target object with the base object recursively and returns newly
 * created object. The values of the target object have priority over the base
 * values.
 *
 * Functions, Map, Set, Arrays or any other 'non-plain' JSON objects are
 * copied by reference. Plain JSON objects not found in the 'partial' are also
 * copied by reference.
 */
export declare function getDeepMerge<T>(base: T, target: T): T;
/**
 * Returns a clone of the given source object with all its fields recursively
 * cloned.
 */
export declare function deepClone<T>(source: T): T;
