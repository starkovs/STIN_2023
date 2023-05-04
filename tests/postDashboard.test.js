const { postDashboard } = require('../controllers/controller');
const User = require('../models/user');
const Account = require('../models/account');
const Payment = require('../models/payment');
const Currency = require('../models/currency');

describe('postDashboard', () => {
  test('should generate a total between 0 and 1000', async () => {
    const req = { body: { typePayment: 1 } };
    // const res = { send: jest.fn() };
    const res = {
      redirect: jest.fn(),
    };

    const currencies = [];
    Currency.find = jest.fn().mockReturnValueOnce(currencies);
    await postDashboard(req, res);
    expect(Currency.find).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('should generate correctly', async () => {
    const req = {
      userId: '6421c16ae493fe55be70790b',
      body: {
        typePayment: 1,
      },
    };
    const res = {
      redirect: jest.fn(),
    };
    const currencies = [{code: 'USD'}, {code: 'EUR'}, {code: 'GBP'}];
    const account = [{currencyRate: 1, currency: 'USD', number: 123, username: '6421c16ae493fe55be70790b', total: 1000, number: "123"}];
    Currency.find = jest.fn().mockReturnValueOnce(currencies);
    Account.find = jest.fn().mockReturnValueOnce(account);
    Payment.create = jest.fn().mockReturnValueOnce({});
    Account.updateOne = jest.fn().mockReturnValueOnce({});

    await postDashboard(req, res);

    expect(Currency.find).toHaveBeenCalled();
    expect(Account.find).toHaveBeenCalled();
    expect(Payment.create).toHaveBeenCalled();
    expect(Account.updateOne).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
    
  });

  test('should provide INCOME payment in CZK', async () => {
    const req = {
      userId: '6421c16ae493fe55be70790b',
      body: {
        typePayment: 1,
      },
    };
    const res = {
      redirect: jest.fn(),
    };
    const currencies = [{code: 'USD'}, {code: 'EUR'}, {code: 'GBP'}];
    const account = [{currencyRate: 1, currency: 'CZK', number: 123, username: '6421c16ae493fe55be70790b', total: 1000, number: "123", balance: 1000000}];
    Currency.find = jest.fn().mockReturnValueOnce(currencies);
    Account.find = jest.fn().mockReturnValueOnce(account);
    Currency.findOne = jest.fn().mockReturnValueOnce({rate: 1, currency: 'CZK', quantity: 1});
    Payment.create = jest.fn().mockReturnValueOnce({});
    Account.updateOne = jest.fn().mockReturnValueOnce({});

    await postDashboard(req, res);

    expect(Currency.find).toHaveBeenCalled();
    expect(Account.find).toHaveBeenCalled();
    expect(Payment.create).toHaveBeenCalled();
    expect(Account.updateOne).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

    test('should provide INCOME payment not in CZK', async () => {
    const req = {
      userId: '6421c16ae493fe55be70790b',
      body: {
        typePayment: 1,
      },
    };
    const res = {
      redirect: jest.fn(),
    };
    const currencies = [{code: 'USD'}];
    const account = [];
    Currency.find = jest.fn().mockReturnValueOnce(currencies);
    Account.find = jest.fn().mockReturnValueOnce(account);
    Currency.findOne = jest.fn().mockReturnValueOnce({rate: 1, currency: 'CZK', quantity: 1});
    Payment.create = jest.fn().mockReturnValueOnce({});
    Account.updateOne = jest.fn().mockReturnValueOnce({});

    await postDashboard(req, res);

    expect(Currency.find).toHaveBeenCalled();
    expect(Account.find).toHaveBeenCalled();
    expect(Payment.create).toHaveBeenCalled();
    expect(Account.updateOne).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('should provide OUTCOME payment in CZK', async () => {
    const req = {
      userId: '6421c16ae493fe55be70790b',
      body: {
        typePayment: 2,
      },
    };
    const res = {
      redirect: jest.fn(),
    };
    const currencies = [{code: 'USD'}, {code: 'EUR'}, {code: 'GBP'}];
    const account = [{currency: 'CZK', number: 123, username: '6421c16ae493fe55be70790b', balance: 10000000, number: "123"}];
    Currency.find = jest.fn().mockReturnValueOnce(currencies);
    Account.find = jest.fn().mockReturnValueOnce(account);
    Payment.create = jest.fn().mockReturnValueOnce({});
    Account.updateOne = jest.fn().mockReturnValueOnce({});

    await postDashboard(req, res);

    expect(Currency.find).toHaveBeenCalled();
    expect(Account.find).toHaveBeenCalled();
    expect(Payment.create).toHaveBeenCalled();
    expect(Account.updateOne).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
    
  });

  // test('dont should provide OUTCOME payment in CZK', async () => {
  //   const req = {
  //     userId: '6421c16ae493fe55be70790b',
  //     body: {
  //       typePayment: 2,
  //     },
  //   };
  //   const res = {
  //     redirect: jest.fn(),
  //   };
  //   const currencies = [{code: 'USD'}, {code: 'EUR'}, {code: 'GBP'}];
  //   const account = [{currency: 'CZK', number: 123, username: '6421c16ae493fe55be70790b', balance: 1, number: "123"}];
  //   Currency.find = jest.fn().mockReturnValueOnce(currencies);
  //   Account.find = jest.fn().mockReturnValueOnce(account);
  //   Payment.create = jest.fn().mockReturnValueOnce({});
  //   Account.updateOne = jest.fn().mockReturnValueOnce({});
  //   Currency.findOne = jest.fn().mockReturnValueOnce({rate: 1, currency: 'CZK', quantity: 1});
  //   Account.find = jest.fn().mockReturnValueOnce(account);

  //   await postDashboard(req, res);

  //   expect(Currency.find).toHaveBeenCalled();
  //   expect(Account.find).toHaveBeenCalled();
  //   expect(Account.find).toHaveBeenCalled();
  //   expect(Payment.create).toHaveBeenCalled();
  //   expect(Account.updateOne).toHaveBeenCalled();
  //   expect(res.render).toHaveBeenCalledWith(expect.any(String), { title: 'Login' });
    
  // });
});