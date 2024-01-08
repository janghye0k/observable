/**
 * Check parameters are equal
 * @param  {*} value1
 * @param  {*} value2
 * @return {boolean} Returns true if they're equal in value
 */
function isEqual(value1: any, value2: any) {
  /**
   * check type
   * @param  {any} val
   * @return {string}
   */
  function typeOf(val: any) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
  }

  // Get the value type
  const type = typeOf(value1);

  if (type !== typeOf(value2)) return false;

  if (type === 'array') {
    if (value1.length !== value2.length) return false;
    for (let i = 0; i < value1.length; i++) {
      if (!isEqual(value1[i], value2[i])) return false;
    }
    return true;
  }
  if (type === 'object') {
    if (Object.keys(value1).length !== Object.keys(value2).length) return false;
    for (const key in value1) {
      if (Object.prototype.hasOwnProperty.call(value1, key)) {
        if (!isEqual(value1[key], value2[key])) return false;
      }
    }
    return true;
  }
  if (type === 'function') return value1.toString() === value2.toString();
  return value1 === value2;
}

export default isEqual;
