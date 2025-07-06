import request from 'supertest';
import app from '../src/app';
import { StatusCodes } from '../src/constants/statusCodes';
import { Messages } from '../src/constants/messages';
import { logger } from '../src/utils/logger';

describe('User Management API', () => {
  let adminToken: string;
  let userToken: string;
  let targetUserId: string;
  let anotherUserId: string;

  beforeAll(async () => {
    // Admin login
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: '123456',
    });
    adminToken = adminRes.body.token;

    // Create a normal user to test with
    const userRes = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'usertomanage@example.com',
        password: 'userpass',
        role: 'USER',
      });

    targetUserId = userRes.body.user.id;

    // Create another user to test delete/update restrictions
    const anotherUserRes = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'anotheruser@example.com',
        password: 'userpass2',
        role: 'USER',
      });

    anotherUserId = anotherUserRes.body.user.id;

    // Login as normal user
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'usertomanage@example.com',
      password: 'userpass',
    });
    userToken = loginRes.body.token;
  });

  it('should allow admin to list all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(Array.isArray(res.body)).toBe(true);

    logger.debug('[User] Admin can list users test passed');
  });

  it('should forbid normal user from listing all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.message).toBe(Messages.FORBIDDEN);

    logger.debug('[User] Non-admin cannot list users test passed');
  });

  it('should not allow registering with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'usertomanage@example.com', // duplicate email
        password: 'password',
        role: 'USER',
      });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST); // Conflict
    expect(res.body.message).toBe(Messages.EMAIL_IN_USE);
  });

  it('should forbid access to list users without token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.message).toBe(Messages.TOKEN_MISSING);
  });

  it('should allow admin to update user role', async () => {
    const res = await request(app)
      .put(`/api/users/${targetUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'ADMIN' });

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.message).toBe(Messages.USER_UPDATED);

    logger.debug('[User] Admin can update user role test passed');
  });

  it('should return NOT_FOUND when updating non-existent user', async () => {
    const fakeId = 999999;

    const res = await request(app)
      .put(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'USER' });

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body.message).toBe(Messages.USER_NOT_FOUND);

    logger.debug('[User] Update non-existent user test passed');
  });

  it('should allow admin to delete a user', async () => {
    const res = await request(app)
      .delete(`/api/users/${anotherUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.message).toBe(Messages.USER_DELETED);

    logger.debug('[User] Admin can delete user test passed');
  });

  it('should forbid normal user from deleting another user', async () => {
    const res = await request(app)
      .delete(`/api/users/${targetUserId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.message).toBe(Messages.FORBIDDEN);

    logger.debug('[User] Non-admin delete attempt test passed');
  });
});

describe('User Management API - Additional Edge Cases', () => {
  let adminToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Admin login
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: '123456',
    });
    adminToken = adminRes.body.token;

    // Create a user for edge case tests
    const userRes = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'edgecaseuser@example.com',
        password: 'edgepass',
        role: 'USER',
      });

    testUserId = userRes.body.user.id;
  });

  it('should return UNAUTHORIZED when updating user role without token', async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .send({ role: 'ADMIN' });

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.message).toBe(Messages.TOKEN_MISSING);
  });

  it('should return NOT_FOUND when deleting non-existent user', async () => {
    const res = await request(app)
      .delete('/api/users/9999999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body.message).toBe(Messages.USER_NOT_FOUND);
  });

});
