const nodemailer = require('nodemailer');
const { getAuthentification } = require('../controllers/controller');
// const { email, password } = require('../config');

const dotenv = require('dotenv');
dotenv.config();

jest.mock('nodemailer');

describe('getAuthentification', () => {
  // it('should send an email', () => {
  //   const req = {};
  //   const res = {
  //     render: jest.fn()
  //   };
  //   getAuthentification(req, res);
  //   expect(nodemailer.createTransport).toHaveBeenCalledWith({
  //     service: 'gmail',
  //     auth: {
  //       user: process.env.EMAIL,
  //       pass: process.env.PASSWORD
  //     }
  //   });
  //   expect(nodemailer.sendMail).toHaveBeenCalledWith({
  //     from: process.env.EMAIL,
  //     to: 'mikhail.starkov@tul.cz',
  //     subject: 'Code to login',
  //     text: '12345678'
  //   }, expect.any(Function));
  // });

  it('should render the authentification view', () => {
    const req = {};
    const res = {
      render: jest.fn()
    };
    getAuthentification(req, res);
    expect(res.render).toHaveBeenCalledWith('/Users/starkov/STIN_2023/views/authentification.ejs', {
      title: 'Authentification'
    });
  });
});
