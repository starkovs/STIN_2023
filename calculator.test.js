const calculator = require('./index.js')
 
test('Return sum of two numbers', () => {
    expect(calculator.sum(2,2)).toBe(4);
  });