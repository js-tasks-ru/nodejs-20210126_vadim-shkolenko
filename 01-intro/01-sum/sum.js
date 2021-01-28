function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Argument must be a number');
  } else {
    return a + b;
  }
}

module.exports = sum;
