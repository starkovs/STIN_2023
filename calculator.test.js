const calculator = require('./index.js')
 
test('Return sum of two numbers', () => {
    expect(calculator.sum(1,2)).toBe(3);
  });