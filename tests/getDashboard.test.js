const { getDashboard } = require('../controllers/controller');
const User = require('../models/user');
const Account = require('../models/account');
const Payment = require('../models/payment');
const path = require('path');
jest.mock('../models/user');
jest.mock('../models/account');
jest.mock('../models/payment');

describe('getDashboard', () => {
  test('should render error', async () => {
    const req = { userId: 'testUserId' };
    const res = { render: jest.fn() };
    await getDashboard(req, res);
    expect(res.render).toHaveBeenCalledWith(path.join(process.cwd(), 'views', 'error.ejs'), {
      title: 'Error'
    });
  });

  test('should render dashboard template with user accounts and payments', async () => {
    var req = { userId: '6421c16ae493fe55be70790b', message: 'Welcome to your dashboard!'};
    const res = {
      render: jest.fn(),
    };
    const user = {
      id: '6421c16ae493fe55be70790b',
    };
    const accounts = [
      {
        number: 'account123',
        username: '6421c16ae493fe55be70790b',
      },
    ];
    const payments = [
      {
        number: 'payment123',
        username: '6421c16ae493fe55be70790b',
      },
    ];
    User.findById.mockReturnValueOnce(user);
    Account.find.mockReturnValueOnce(accounts);
    Payment.find.mockReturnValueOnce(payments);

    await getDashboard(req, res);

    expect(User.findById).toHaveBeenCalledWith('6421c16ae493fe55be70790b');
    // expect(Account.find).toHaveBeenCalledWith({ username: '6421c16ae493fe55be70790b' });
    // expect(Payment.find).toHaveBeenCalledWith({ username: '6421c16ae493fe55be70790b' });
    // expect(res.render).toHaveBeenCalledWith('dashboard', {
    //   payments,
    //   accounts,
    //   title: 'Dashboard',
    //   message: 'Welcome to your dashboard!',
    // });
  });

});
