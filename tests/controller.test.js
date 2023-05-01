const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { generateAccessToken, getDashboard } = require('../controllers/controller');
const { describe, it, expect } = require('@jest/globals');
const User = require('../models/user');
const Account = require('../models/account');
const Payment = require('../models/payment');

describe('generateAccessToken', () => {
  it('should return a string', () => {
    const token = generateAccessToken('6421c16ae493fe55be70790b', 'mikhail.starkov@tul.cz');
    expect(typeof token).toBe('string');
  });

  it('should contain a valid JWT payload', () => {
    const id = '6421c16ae493fe55be70790b';
    const username = 'mikhail.starkov@tul.cz';
    const token = generateAccessToken(id, username);
    const decoded = jwt.verify(token, process.env.SECRET);
    expect(decoded.id).toBe(id);
    expect(decoded.username).toBe(username);
  });
});

describe('getDashboard', () => {
  // it('should return a 200 status code and render the dashboard template with the correct data when the request is valid and the user is authenticated', async () => {
  //   const req = { userId: '6421c16ae493fe55be70790b' };
  //   const res = {
  //     render: jest.fn(),
  //   };
  //   const mockUser = { id: '6421c16ae493fe55be70790b' };
  //   const mockAccounts = [{ accountId: 'account1' }, { accountId: 'account2' }];
  //   const mockPayments = [{ paymentId: 'payment1' }, { paymentId: 'payment2' }];
  //   const userFindByIdSpy = jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
  //   const accountFindSpy = jest.spyOn(Account, 'find').mockResolvedValue(mockAccounts);
  //   const paymentFindSpy = jest.spyOn(Payment, 'find').mockResolvedValue(mockPayments);

  //   await getDashboard(req, res);

  //   expect(userFindByIdSpy).toHaveBeenCalledWith('validUserId');
  //   expect(accountFindSpy).toHaveBeenCalledWith({ username: 'validUserId' });
  //   expect(paymentFindSpy).toHaveBeenCalledWith({ username: 'validUserId' });
  //   expect(res.render).toHaveBeenCalledWith(createPath('dashboard'), {
  //     payments: mockPayments,
  //     accounts: mockAccounts,
  //     title: 'Dashboard',
  //   });
  //   expect(res.render).toHaveBeenCalledTimes(1);
  // });

  //   it('should return a 500 status code and render the error template when an error occurs', async () => {
  //   const req = { userId: 'validUserId' };
  //   const res = {
  //     render: jest.fn(),
  //   };
  //   const error = new Error('Database error');
  //   jest.spyOn(User, 'findById').mockRejectedValue(error);

  //   await getDashboard(req, res);

  //   expect(res.render).toHaveBeenCalledWith(createPath('error'), { title: 'Error' });
  //   expect(res.render).toHaveBeenCalledTimes(1);
  // });

});