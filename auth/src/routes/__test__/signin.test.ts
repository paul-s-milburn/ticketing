import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'notauser@test.com',
    password: 'password'
  })
  .expect(400);
});

it('it fails when an incorrect password is supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'user@test.com',
    password: 'password'
  })
  .expect(201);

  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'user@test.com',
    password: 'wordy'
  })
  .expect(400);

});

it('responds with a cookie when given valid creds', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@test.com',
      password: 'password'
    })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'user@test.com',
      password: 'password'
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();

});
