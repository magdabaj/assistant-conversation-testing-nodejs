"use strict";
/** @fileoverview Merge utils. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepClone = exports.getDeepMerge = void 0;
/**
 * Merges target object with the base object recursively and returns newly
 * created object. The values of the target object have priority over the base
 * values.
 *
 * Functions, Map, Set, Arrays or any other 'non-plain' JSON objects are
 * copied by reference. Plain JSON objects not found in the 'partial' are also
 * copied by reference.
 */
function getDeepMerge(base, target) {
    return unprotectedDeepMerge(deepClone(base), target);
}
exports.getDeepMerge = getDeepMerge;
/**
 * Returns a clone of the given source object with all its fields recursively
 * cloned.
 */
function deepClone(source) {
    return unprotectedDeepMerge({}, source);
}
exports.deepClone = deepClone;
/**
 * Merges target object with the base object recursively and returns newly
 * created object.
 * Unlike getDeepMerge This merge does not protected copies of the 'base',
 * and is only for internal usage by the getDeepMerge.
 */
function unprotectedDeepMerge(base, target) {
    if (!isPlainObject(base) || !isPlainObject(target)) {
        return target;
    }
    const result = { ...base };
    for (const key of Object.keys(target)) {
        const baseValue = base[key];
        const partialValue = target[key];
        result[key] = getDeepMerge(baseValue, partialValue);
    }
    return result;
}
/** Checks if the object is a plain JSON object. */
function isPlainObject(obj) {
    return !!obj && typeof obj === 'object' && obj.constructor === Object;
}
//# sourceMappingURL=merge.js.map