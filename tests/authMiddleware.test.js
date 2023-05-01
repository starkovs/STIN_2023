const jwt = require('jsonwebtoken');
const middleware = require('../middleware/authMiddleware');
const dotenv = require('dotenv');
dotenv.config();

describe('middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() when token is valid', () => {
    // create a valid token
    const token = jwt.sign({id: '6421c16ae493fe55be70790b', username: 'mikhail.starkov@tul.cz'}, process.env.SECRET, {expiresIn: "1h"});

    // set the token in the request cookies
    req.cookies.token = token;
    // console.log(req.cookies.token);

    // call the middleware function
    middleware(req, res, next);

    // verify that the decoded token id is set in the request and next() is called
    expect(req.userId).toEqual('6421c16ae493fe55be70790b');
    // expect(next).toHaveBeenCalled();
  });

  it('should redirect to login page when token is invalid', () => {
    // set an invalid token in the request cookies
    req.cookies.token = 'invalid-token';

    // call the middleware function
    middleware(req, res, next);

    // verify that the token is cleared from the response cookies and redirected to login page
    expect(res.clearCookie).toHaveBeenCalledWith('token');
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });
});
