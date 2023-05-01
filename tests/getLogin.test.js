const { getLogin } = require('../controllers/controller');

describe('getLogin', () => {
  it('should clear the token cookie', () => {
    const req = {
      cookies: {
        token: 'testtoken'
      }
    };
    const res = {
      clearCookie: jest.fn(),
      render: jest.fn()
    };

    getLogin(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith('token');
  });

  it('should render the login page', () => {
    const req = {};
    const res = {
      clearCookie: jest.fn(),
      render: jest.fn()
    };

    getLogin(req, res);

    expect(res.render).toHaveBeenCalledWith(expect.any(String), { title: 'Login' });
  });
});
