import request from 'supertest';
import app from '../src/app';

import { StatusCodes } from '../src/constants/statusCodes';
import { Messages } from '../src/constants/messages';

import { logger } from '../src/utils/logger';

describe('Auth API', () => {
  let adminToken: string;
  let userToken: string;

  it(`should return ${StatusCodes.BAD_REQUEST} when required fields are missing`, async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com', // password is missing
    });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.message).toBe(Messages.MISSING_FIELDS);

    logger.debug('[Auth] Missing fields login test passed');
  });

  it('should login as admin successfully', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('token');

    adminToken = res.body.token;

    logger.debug('[Auth] Admin login test passed');
  });

  it('should register a new user with admin token', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'testpassword',
      role: 'USER',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(userData);

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body.user).toHaveProperty('email', userData.email);
    expect(res.body.user).toHaveProperty('role', userData.role);
    expect(res.body.message).toBe(Messages.USER_REGISTERED);

    logger.debug('[Auth] Admin-created user registration test passed');
  });

  it('should login with the newly registered user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'newuser@example.com',
      password: 'testpassword',
    });

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('token');

    userToken = res.body.token;

    logger.debug('[Auth] New user login test passed');
  });

  it(`should return ${StatusCodes.FORBIDDEN} when non-admin user tries to register`, async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'unauthorized@example.com',
        password: 'pass1234',
        role: 'USER',
      });

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.message).toBe(Messages.FORBIDDEN);

    logger.debug('[Auth] Non-admin user register attempt test passed');
  });
});
