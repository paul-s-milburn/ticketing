import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

let mongo: any;


declare global {
  var signin: () => Promise<string[]>;
};


beforeAll(async () => {
  process.env.JWT_KEY = 'asdfghjkl';
  
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, { });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  for (let collection of collections || []) {
    await collection.deleteMany({});
  }
});

afterAll(async() => {
  await mongo.stop();
  await mongoose.connection.close();
});


global.signin = async (): Promise<string[]> => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error("Failed to get cookie from response");
  }
  return cookie;
}