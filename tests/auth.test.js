const { generateAccessToken } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

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