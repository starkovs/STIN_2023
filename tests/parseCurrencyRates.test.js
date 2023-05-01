const { parseCurrencyRates, parseLine } = require('../controllers/controller');

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
      { code: 'kód', quantity: NaN, rate: NaN},
      { code: 'AUD', quantity: 1, rate: 14.099},
      { code: 'BRL', quantity: 1, rate: 4.278},
      { code: 'BGN', quantity: 1, rate: 12.019},  
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

});








