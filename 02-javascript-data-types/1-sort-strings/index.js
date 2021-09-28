/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = arr.slice();

  return (param === "desc") ?
    newArr.sort((a, b) => sortHelper(a, b)) :
    newArr.sort((a, b) => sortHelper(b, a)) // "asc"
}

export function sortHelper(a, b) {
  return b.localeCompare(a, "ru-u-kf-upper")
}
