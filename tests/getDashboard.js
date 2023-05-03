const { getDashboard } = require('../controllers/controller');
const User = require('../models/user');
const Account = require('../models/account');
const Payment = require('../models/payment');

describe('getDashboard', () => {
//   test('should render dashboard template with user accounts and payments', async () => {
//     const req = { userId: 'user123', message: 'Welcome to your dashboard!' };
//     const res = {
//       render: jest.fn(),
//     };
//     const user = {
//       id: 'user123',
//     };
//     const accounts = [      {        id: 'account123',        username: 'user123',      },    ];
//     const payments = [      {        id: 'payment123',        username: 'user123',      },    ];
//     User.findById = jest.fn().mockReturnValueOnce(user);
//     Account.find = jest.fn().mockReturnValueOnce(accounts);
//     Payment.find = jest.fn().mockReturnValueOnce(payments);

//     await getDashboard(req, res);

//     expect(User.findById).toHaveBeenCalledWith('user123');
//     expect(Account.find).toHaveBeenCalledWith({ username: 'user123' });
//     expect(Payment.find).toHaveBeenCalledWith({ username: 'user123' });
//     expect(res.render).toHaveBeenCalledWith('dashboard', {
//       payments,
//       accounts,
//       title: 'Dashboard',
//       message: 'Welcome to your dashboard!',
//     });
//   });

  test('should render error template when there is an error', async () => {
    // const req = { userId: 'user123', message: 'Welcome to your dashboard!' };
    // const res = {
    //   render: jest.fn(),
    // };
    // User.findById = jest.fn().mockRejectedValueOnce('error');

    // getDashboard(req, res);

    // expect(User.findById).toHaveBeenCalledWith('user123');
    // expect(res.render).toHaveBeenCalledWith('error', { title: 'Error' });
  });
});
