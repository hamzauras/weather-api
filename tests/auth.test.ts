import request from 'supertest';
import app from '../src/app';
import { StatusCodes } from '../src/constants/statusCodes';
import { Messages } from '../src/constants/messages';

describe('Auth API', () => {
  it('should return '+StatusCodes.BAD_REQUEST+' when '+Messages.MISSING_FIELDS, async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.message).toBe(Messages.MISSING_FIELDS);
  });
});





// other tests







// cleanup

import prisma from '../prisma/prismaClient';

afterAll(async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
});

import { redisClient } from '../src/config/redisConfig';

afterAll(async () => {
  await redisClient.quit();
});
