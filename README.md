# NestJs + Mongoose CRUD

Nest.js crud module for mongoose models **without** `@nestjsx/crud`

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