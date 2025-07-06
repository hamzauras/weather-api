import request from 'supertest';
import app from '../src/app';
import { StatusCodes } from '../src/constants/statusCodes';
import { Messages } from '../src/constants/messages';
import { logger } from '../src/utils/logger';
import nock from 'nock';

describe('Weather API', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    jest.setTimeout(10000); // increase timeout to 10 seconds

    // Mock the external weather API
    nock('https://api.openweathermap.org')
      .persist() // keep the mock active for all tests
      .get(/.*/) // intercept all GET requests
      .reply(uri => {
        // Return different mock responses based on the requested URI
        if (uri.includes('Istanbul')) {
          return [
            200,
            {
              name: 'Istanbul',
              main: { temp: 25 },
              weather: [{ description: 'Sunny' }],
            },
          ];
        }
        if (uri.includes('INVALIDCITY123')) {
          return [
            500,
            { message: Messages.WEATHER_FETCH_ERROR },
          ];
        }
        // Default mock response
        return [
          200,
          {
            name: 'DefaultCity',
            main: { temp: 20 },
            weather: [{ description: 'Cloudy' }],
          },
        ];
      });

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

  // 1. Get weather by city
  it('should return weather data for a valid city with user token', async () => {
    const res = await request(app)
      .get('/api/weather/Istanbul') // should be path parameter, not query
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

  // 2. Get weather data for the current user location
  it('should return weather data for the current user location', async () => {
    // If there is a relation to mock in the /weather/my endpoint, mocking should be done inside the service.
    // We expect it to return a dummy array for this test.
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

  // 3. Admin fetches all weather data
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
