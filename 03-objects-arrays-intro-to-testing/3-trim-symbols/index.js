/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */

export function trimSymbols(string, size = string.length) {
  if (size === 0) return "";
  let charOccurrencesStorage = {};  // temporal storage for tracking current state of each character
  let trimmedString = ""; // storage for characters, final result
  let occurrenceQuantity = 0; // temporal variable for tracking a current number of char occurrences

  for (let i = 0; i < string.length; i++) {
    if (charOccurrencesStorage.hasOwnProperty(string[i])) {
      // continue adding chars into a string if we are still in the 'size' range
      if (occurrenceQuantity < size) {
        occurrenceQuantity++;
        trimmedString += string[i];
      }
    } else { // reset an object and occurrences, because we have a new char
      charOccurrencesStorage = {};
      occurrenceQuantity = 1;
      trimmedString += string[i];
    }
    // always keep counting a number of occurrences for the current char
    charOccurrencesStorage[string[i]] = occurrenceQuantity;
  }

  return trimmedString;
}
