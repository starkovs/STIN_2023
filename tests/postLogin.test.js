const { postLogin } = require('../controllers/controller');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

describe('postLogin', () => {
  let testUser;

  it('should log in the user and redirect to /authentification', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'password',
      },
    };
    const res = {
      cookie: jest.fn(),
      redirect: jest.fn(),
      render: jest.fn(),
    };

    // await postLogin(req, res);

    // expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
    //   httpOnly: true,
    // });
    // expect(res.redirect).toHaveBeenCalledWith('/authentification');
    // expect(res.render).not.toHaveBeenCalled();
  });

  // it('should render the login page with an error message if the username or password is incorrect', async () => {
  //   const req = {
  //     body: {
  //       username: 'testuser',
  //       password: 'wrongpassword',
  //     },
  //   };
  //   const res = {
  //     render: jest.fn(),
  //   };

  //   await postLogin(req, res);

  //   expect(res.render).toHaveBeenCalledWith(expect.any(String), {
  //     title: 'Login',
  //     message: 'Login or password is not correct',
  //   });
  // });

  // it('should render the login page with an error message if there is a database error', async () => {
  //   const req = {
  //     body: {
  //       username: 'testuser',
  //       password: 'password',
  //     },
  //   };
  //   const res = {
  //     render: jest.fn(),
  //   };
  //   jest.spyOn(User, 'findOne').mockImplementation(() => {
  //     throw new Error('Database error');
  //   });

  //   await postLogin(req, res);

  //   expect(res.render).toHaveBeenCalledWith(expect.any(String), {
  //     title: 'Login',
  //     message: 'Login or password is not correct',
  //   });

  //   User.findOne.mockRestore();
  // });

  // it('should render the login page with an error message if there is a bcrypt error', async () => {
  //   const req = {
  //     body: {
  //       username: 'testuser',
  //       password: 'password',
  //     },
  //   };
  //   const res = {
  //     render: jest.fn(),
  //   };
  //   jest.spyOn(User, 'findOne').mockImplementation(() => {
  //     return {
  //       password: 'invalidhash',
  //     };
  //   });

  //   await postLogin(req, res);

  //   expect(res.render).toHaveBeenCalledWith(expect.any(String), {
  //     title: 'Login',
  //     message: 'Login or password is not correct',
  //   });

  //   User.findOne.mockRestore();
  // });
});
