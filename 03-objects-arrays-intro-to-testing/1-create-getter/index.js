/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const keysArray = path.split(".")
  return function (obj) {
    return getValue(obj, keysArray);
  }
}

function getValue(obj, keysArray) {
  let valueFound = ""

  function deepIterate(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (keysArray.includes(key)) {
        if (typeof value === "object") {
          deepIterate(value)
        } else {
          valueFound = value;
        }
      }
    }
  }

  deepIterate(obj)
  return (valueFound) ? valueFound : undefined
}
