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
});