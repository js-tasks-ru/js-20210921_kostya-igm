/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */

// Object -> to Array -> map (swap [key,value]) -> to Object
export function invertObj(obj) {
  return (obj === undefined) ? undefined :
    Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]))
}
