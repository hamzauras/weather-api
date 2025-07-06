import request from 'supertest';
import app from '../src/app';
import { StatusCodes } from '../src/constants/statusCodes';
import { Messages } from '../src/constants/messages';
import { logger } from '../src/utils/logger';

describe('Weather API', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Admin login
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: '123456',
    });
    adminToken = adminRes.body.token;

    // Register a user
    await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'weatheruser@example.com',
        password: 'userpass',
        role: 'USER',
      });

    // User login
    const userLoginRes = await request(app).post('/api/auth/login').send({
      email: 'weatheruser@example.com',
      password: 'userpass',
    });
    userToken = userLoginRes.body.token;
  });

  // 1. Şehre göre hava durumu
it('should return weather data for a valid city with user token', async () => {
  const res = await request(app)
    .get('/api/weather/Istanbul')   // path parametre şeklinde olmalı, query değil
    .set('Authorization', `Bearer ${userToken}`);

  expect(res.statusCode).toBe(StatusCodes.OK);
  expect(res.body).toHaveProperty('name', 'Istanbul');
  expect(res.body.main).toHaveProperty('temp');
  expect(res.body.weather).toBeInstanceOf(Array);
  expect(res.body.weather[0]).toHaveProperty('description');

  logger.debug('[Weather] Valid city weather fetch test passed');
});


  it('should return UNAUTHORIZED if no token is provided', async () => {
    const res = await request(app)
      .get('/api/weather/London');

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.message).toBe(Messages.TOKEN_MISSING);

    logger.debug('[Weather] Unauthorized city fetch test passed');
  });

  it('should return INTERNAL_SERVER_ERROR for invalid city name', async () => {
    const res = await request(app)
      .get('/api/weather/INVALIDCITY123')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body.message).toBe(Messages.WEATHER_FETCH_ERROR);

    logger.debug('[Weather] Invalid city test passed');
  });

  // 2. Kullanıcının hava durumu
 it('should return weather data for the current user location', async () => {
  const res = await request(app)
    .get('/api/weather/my')
    .set('Authorization', `Bearer ${userToken}`);

  expect(res.statusCode).toBe(StatusCodes.OK);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty('city');
  
  logger.debug('[Weather] My weather fetch test passed');
});

  it('should return UNAUTHORIZED when accessing /weather/my without token', async () => {
    const res = await request(app).get('/api/weather/my');

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.message).toBe(Messages.TOKEN_MISSING);

    logger.debug('[Weather] My weather unauthorized access test passed');
  });

  // 3. Admin'in tüm hava verilerini çekmesi
  it('should allow admin to access all weather data', async () => {
    const res = await request(app)
      .get('/api/weather/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(Array.isArray(res.body)).toBe(true);

    logger.debug('[Weather] Admin all weather data fetch test passed');
  });

  it('should FORBID normal user from accessing all weather data', async () => {
    const res = await request(app)
      .get('/api/weather/all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.message).toBe(Messages.FORBIDDEN);

    logger.debug('[Weather] Non-admin all weather access forbidden test passed');
  });
});
