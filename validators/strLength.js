const isString = require('./isString');

/**
 * Curried function that takes a number on first call
 * @function validateStrLength
 * @param {number} len
 * @returns {function} - takes a string to validate against curried length
 * @param {string} str
 * @returns {string || undefined} - string on pass; undefined on fail
 */
const validateStrLength = (len) => (str) => {
  return (isString(str) || str.length <= len)
    ? str
    : undefined;
}

module.exports = validateStrLength;
