import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  MariaDbContainer,
  StartedMariaDbContainer,
} from '@testcontainers/mariadb';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedMariaDbContainer;
  jest.setTimeout(200000);

  beforeAll(async () => {
    container = await new MariaDbContainer('mariadb:latest')
      .withDatabase('testdb')
      .withUsername('testuser')
      .withUserPassword('testpass')
      .withEnvironment({ MARIADB_CHARACTER_SET_SERVER: 'utf8mb4' })
      .withName('testDB')
      .start();

    process.env.DB_HOST = container.getHost();
    process.env.DB_PORT = container.getPort().toString();
    process.env.DB_USER = container.getUsername();
    process.env.DB_PASSWORD = container.getUserPassword();
    process.env.DB_DATABASE = container.getDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const dataSource = moduleFixture.get(DataSource);
    await dataSource.runMigrations();
  });

  afterAll(async () => {
    await container.stop();
    await app.close();
  });

  describe("user's endpoints", () => {
    let createdUser: any;
    it('POST /create - создать пользователя', async () => {
      const body = {
        full_name: 'Иван Иванов',
        role: 'admin',
        efficiency: 85,
      };
      const res = await request(app.getHttpServer())
        .post('/create')
        .send(body)
        .expect(201);

      expect(res.body).toHaveProperty(['id']);
      createdUser = { ...body, ...res.body };
    });

    it('GET /get - получить всех пользователей', async () => {
      const res = await request(app.getHttpServer()).get('/get').expect(200);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBeGreaterThan(0);
    });

    it('GET /get/:id - получить одного пользователя', async () => {
      const res = await request(app.getHttpServer())
        .get(`/get/${createdUser.id}`)
        .expect(200);

      expect(res.body).toHaveProperty(['users', 0, 'id'], createdUser.id);
    });

    it('PATCH /update/:id - обновить пользователя', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/update/${createdUser.id}`)
        .send({
          full_name: 'Иван Петров',
          role: 'manager',
          efficiency: 70,
        })
        .expect(200);

      expect(res.body).toHaveProperty(['full_name'], 'Иван Петров');
    });

    it('DELETE /delete/:id - удалить пользователя', async () => {
      await request(app.getHttpServer())
        .delete(`/delete/${createdUser.id}`)
        .expect(200);
    });
  });
});
