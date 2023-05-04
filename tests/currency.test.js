const { parseCurrencyRates, parseLine } = require('../helpers/currency');
const axios = require('axios');
const Holidays = require('date-holidays');
const { isWeekend } = require('date-fns');
const Currency = require('../models/currency');
const { updateCurrencyRates } = require('../helpers/currency');
const Account = require('../models/account');
const Payment = require('../models/payment');

jest.mock('axios');

describe('parseCurrencyRates', () => {
  it('should return the correct date and rates', () => {
    const data = `28.04.2023 #83
    země|měna|množství|kód|kurz
    Austrálie|dolar|1|AUD|14,099
    Brazílie|real|1|BRL|4,278
    Bulharsko|lev|1|BGN|12,019`;

    const result = parseCurrencyRates(data);

    expect(result.date).toBe('28.04.2023');
    expect(result.rates).toEqual([
      { code: 'AUD', quantity: 1, rate: 14.099 },
      { code: 'BRL', quantity: 1, rate: 4.278 },
      { code: 'BGN', quantity: 1, rate: 12.019 },
    ]);
  });
});


describe('parseLine', () => {
  it('parses the line correctly', () => {
    const line = 'Austrálie|dolar|1|AUD|14,099';
    const expected = {
      quantity: 1,
      code: 'AUD',
      rate: 14.099,
    };

    const result = parseLine(line);

    expect(result).toEqual(expected);
  });

  it('parseLine() returns null when rate is undefined', () => {
    const line = 'Canada|Dollar|1|CAD|';

    const result = parseLine(line);

    expect(result).toBeNull();
  });

});

describe('updateCurrencyRates', () => {
  test('does not update currency rates on weekends', async () => {
    const weekendDate = new Date('2023-05-07'); // Sunday
    const weekendResult = await updateCurrencyRates(weekendDate);
    expect(weekendResult).toBeUndefined();
  });

  test('does not update currency rates on holidays', async () => {
    const weekendDate = new Date('2023-05-01'); //Holiday in Chech Republic
    const weekendResult = await updateCurrencyRates(weekendDate);
    expect(weekendResult).toBeUndefined();
  });

  test('updates currency rates only once per day', async () => {
    const date = new Date('2023-05-03');
    const result1 = await updateCurrencyRates(date);
    const result2 = await updateCurrencyRates(date);
    expect(result2).toBeUndefined();
  });
});










