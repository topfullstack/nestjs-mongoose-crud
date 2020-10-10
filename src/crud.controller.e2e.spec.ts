import { Test } from "@nestjs/testing";
import { CrudController } from "./crud.controller";
import * as mongoose from "mongoose";
import { INestApplication, Controller } from "@nestjs/common";
import * as request from "supertest";
import { Crud } from "./crud.decorator";

const DB = process.env.DB || "mongodb://localhost/nestjs-mongoose-crud-test-e2e";
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const UserModel = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: String,
      age: Number,
      test: Boolean,
      testPersist: String,
    },
    {
      timestamps: true
    }
  )
);

describe("CrudController e2e", () => {
  @Crud({
    model: UserModel,
  })
  @Controller('/users')
  class UserController {
    private model;
    constructor() {
      this.model = UserModel;
    }
  }
  let app: INestApplication;
  let totalUsers = 57

  beforeAll(async () => {
    await UserModel.deleteMany({});
    const users = Array(totalUsers)
      .fill(1)
      .map((v, i) => ({
        username: `user${i}`,
        age: Math.floor(Math.random() * 100)
      }));
    await UserModel.insertMany(users);
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController]
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  describe("create", () => {
    it("should return paginated users", async () => {
      return request(app.getHttpServer())
      .get(`/users?query={"limit":8}`)
      .expect(200)
      .expect(res => expect(res.body.data.length).toBe(8))
    });
    // end of it()
  });
});

describe("CrudController e2e test routes handlers", () => {
  @Crud({
    model: UserModel,
    routes: {
      global: {
        filter: (data, request) => {
          return {...data,test: true};
        },
        transform:(data,request) => {
          return {...data, testPersist: 'test'};
        }
      }
    }
  })
  @Controller('/users')
  class UserController {
    private model;
    constructor() {
      this.model = UserModel;
    }
  }
  let app: INestApplication;
  let totalUsers = 57

  beforeAll(async () => {
    await UserModel.deleteMany({});
    const users = Array(totalUsers)
      .fill(1)
      .map((v, i) => ({
        username: `user${i}`,
        age: Math.floor(Math.random() * 100)
      }));
    await UserModel.insertMany(users);
    await UserModel.create({
      username: 'test_user',
      age: 123,
      test: true,
    });
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(() => {
    mongoose.disconnect();
  });
  describe("get", () => {
    it("should return one test user", async () => {
      return request(app.getHttpServer())
        .get(`/users`)
        .expect(200)
        .expect(res => expect(res.body.data.length).toBe(1))
    });
    // end of it()
  });
  describe("post", () => {
    it("should create user with field testPersist=test", async () => {
      return request(app.getHttpServer())
        .post(`/users`).send({
          username: 'test_user2',
          age: 234,
          test: true,
        })
        .expect(201)
        .expect(res => expect(res.body.testPersist).toEqual('test'))
    });
    // end of it()
  });
});
