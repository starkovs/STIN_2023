const axios = require('axios');
const Holidays = require('date-holidays');
const { isWeekend } = require('date-fns');
const Currency = require('../models/currency');

function parseCurrencyRates(data) {
  const lines = data.split("\n");
  const dateMatch = lines[0].match(/\d+\.\d+\.\d+/);
  // const date = dateMatch ? new Date(dateMatch[0]) : null;
  const date = dateMatch[0]
  const rates = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      continue;
    }

    const rate = parseLine(line);

    if (rate) {
      rates.push(rate);
    }
  }

  return {
    date,
    rates,
  };
}

function parseLine(line) {
  const [country, currency, quantity, code, rate] = line.split("|");

  if (isNaN(parseFloat(rate.replace(',', '.')))) {
    return null;
  }

  return {
    quantity: parseInt(quantity),
    code,
    rate: parseFloat(rate.replace(',', '.')),
  };
}

async function updateCurrencyRates(today) {
  if(today===undefined) {
    const today = new Date();
    const lastRate = await Currency.findOne().sort({date: -1});
 
  } else{
    lastRate = [];
    lastRate.date = '03.05.2023';
  }
  const isWeekendToday = isWeekend(today);
  const holidays = new Holidays('cz');
  const isHoliday = holidays.isHoliday(today);
  
  // check if lastRate is not null
  if (lastRate !== null) {
    const [day, month, year] = lastRate.date.split('.');
    const formatDate = `${year}-${month}-${day}`; 
    if (lastRate.date!==null && new Date(formatDate).getTime() === today.getTime()) {
      console.log(`Rates already updated for ${today}`);
      return;
    } 
  }

  // If today is a weekend or holiday, do not update currency rates
  if (isWeekendToday || isHoliday) {
    console.log('Today is a weekend or holiday, currency rates will not be updated');
    return;
  }
  const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

  try {
    const response = await axios.get(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=${formattedDate}`);
    const { date: parsedDate, rates } = parseCurrencyRates(response.data);
    if (rates.length === 0) {
      console.log(`No currency rates available for ${formattedDate}`);
      return;
    }

    // check if parsedDate is equal to lastRate
    if (lastRate!==null && lastRate.date === parsedDate) {
      console.log(`Rates already updated for ${parsedDate}`);
      return;
    }
    const updatedRates = rates.slice(1);
    await Currency.deleteMany({}); // delete all existing currencies
    const currencies = updatedRates.map(rate => ({
      ...rate,
      date: parsedDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await Currency.create(currencies); // insert new currencies
    console.log(`Saved ${currencies.length} currency rates for ${parsedDate}`);
  } catch (err) {
    console.error(`Error updating currency rates: ${err}`);
  }
}

module.exports = {
  parseCurrencyRates,
  parseLine,
  updateCurrencyRates,
};