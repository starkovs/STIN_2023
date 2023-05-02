const axios = require('axios');
const Currency = require('../models/currency'); // or wherever the Currency model is defined
const Holidays = require('date-holidays');
const { parseCurrencyRates } = require('../controllers/controller'); // or wherever these utility 
const { isWeekend } = require('date-fns');
const {updateCurrencyRates} = require('../controllers/controller');

jest.mock('axios'); // mock the axios module

describe('updateCurrencyRates', () => {
  let originalConsoleLog; // to backup the original console.log method

  beforeAll(() => {
    originalConsoleLog = console.log; // backup the original console.log method
    console.log = jest.fn(); // mock the console.log method
  });

  afterAll(() => {
    console.log = originalConsoleLog; // restore the original console.log method
  });

  beforeEach(() => {
    // reset the mock for each test
    axios.get.mockReset();
    console.log.mockReset();
  });

  it('should not update rates if today is a weekend', async () => {
    // setup
    const today = new Date('2023-05-07'); // a Sunday

    // test
   updateCurrencyRates(today);

    // assert
    // expect(console.log).toHaveBeenCalledWith('Today is a weekend or holiday, currency rates will not be updated');
  });

  //   it('should not update rates if there are no new rates available', async () => {
  //   const today = new Date();
  //   const lastRate = {
  //     date: `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`
  //   };

  //   const result = await updateCurrencyRates();
  //   expect(result).toBeUndefined();
  // });
});