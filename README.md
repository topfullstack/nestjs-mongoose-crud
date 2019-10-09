# NestJs + Mongoose CRUD

Nest.js crud module for mongoose models **without** `@nestjsx/crud`

> Nest.js + Typegoose 中文视频教程请移步哔哩哔哩: [全栈之巅](https://space.bilibili.com/341919508)

## Usage
1. Install and setup [nestjs-typegoose](https://github.com/kpfromer/nestjs-typegoose#basic-usage) or [nestjs-mongoose](https://docs.nestjs.com/techniques/mongodb)
1. Install
    ```shell
    yarn add nestjs-mongoose-crud
    # or
    npm i nestjs-mongoose-crud
    ```
1. Import model to module:
    ```ts
    import { Module } from '@nestjs/common';
    import { UsersController } from './users.controller';
    import { TypegooseModule } from 'nestjs-typegoose';
    import { User } from './user.model';

    @Module({
      imports: [
        TypegooseModule.forFeature([User])
      ],
      controllers: [UsersController]
    })
    export class UsersModule {}
    ```
1. Add `@Crud()` decorator and inject imported model to `model` property.
    ```ts
    import { Controller } from '@nestjs/common';
    import { Crud } from 'nestjs-mongoose-crud'
    import { User } from './user.model';
    import { InjectModel } from 'nestjs-typegoose';
    import { ModelType } from '@typegoose/typegoose/lib/types';

    @Crud({
      model: User
    })
    @Controller('users')
    export class UsersController {
      constructor(@InjectModel(User) public model: ModelType<User>) {}
    }
    ```

1. Test your CRUD APIs: http://localhost:3000/users

## APIs
e.g. `@Crud()` for `UsersController`
|METHOD|PATH|DESC|
|--|--|--|
|GET|/users|Get all users|
|GET|/users/:id|Get a user|
|POST|/users|Create a user|
|PUT|/users/:id|update a user|
|DELETE|/users/:id|Delete a user|

> You can find all routes and DTOs by setup [swagger](https://docs.nestjs.com/recipes/swagger)

## Query
Use a JSON (in string) `query` parameter to find records:

[/users?query={"where":{"username":"user1","age":{"$gt":18}},"sort":"-_id","limit":10,"page":2,"populate":"friends"}]()

## Interfaces
```ts
export interface PaginateKeys {
  data: string
  total: string
  lastPage: string
  currentPage: string
}

export interface CrudRoute {
  decorators?: (MethodDecorator | PropertyDecorator)[]
}
export interface CrudRouteWithDto extends CrudRoute {
  dto?: any
}
export interface CrudRouteForFind extends CrudRoute {
  paginate?: PaginateKeys | false
  limit?: number
  populate?: string | any
  sort?: string | any
  where?: any
}

export interface CrudRoutes {
  find?: CrudRouteForFind | false,
  findOne?: CrudRoute | false,
  create?: CrudRouteWithDto | false,
  update?: CrudRouteWithDto | false,
  delete?: CrudRoute | false,
}
export interface CrudOptions {
  model: any
  routes?: CrudRoutes
}
```