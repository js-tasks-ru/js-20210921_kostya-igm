/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */

export const omit = (obj, ...fields) => {
  const newObj = {};
  for (let [key, value] of Object.entries(obj)) {
    let isFieldExist = false;

    // "for" loop is used instead of forEach method,
    // because the ability to interrupt a loop is desired in this scenario.
    for (let i = 0; i < fields.length; i++) {
      if (key === fields[i]) {
        isFieldExist = true;
        break; // there is no need to continue if the field exists
      }
    }
    if (!isFieldExist) newObj[key] = value;
  }
  return newObj;
};
