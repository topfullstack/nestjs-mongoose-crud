# NestJs + Mongoose CRUD

Nest.js crud module for mongoose models **without** `@nestjsx/crud`

## Important
- NestJs 6.x ----> nestjs-mongoose-crud v1.x
- NestJs 7.x ----> nestjs-mongoose-crud v2.x

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
  data?: string
  total?: string
  lastPage?: string
  currentPage?: string
}

export interface CrudRoute {
  decorators?: MethodDecorator[]
}
export interface CrudRouteWithDto extends CrudRoute {
  dto?: any
  transform?: (data: any) => any
}
export interface CrudRouteForFind extends CrudRoute {
  paginate?: PaginateKeys | false
  limit?: number
  populate?: string | any
  sort?: string | any
  where?: any
}
export interface CrudRouteForFindOne extends CrudRoute {
  populate?: string | any
  where?: any
  select?: any
}

export interface CrudRoutes {
  grid?: false,
  form?: false,
  find?: CrudRouteForFind | false,
  findOne?: CrudRouteForFindOne | false,
  create?: CrudRouteWithDto | false,
  update?: CrudRouteWithDto | false,
  delete?: CrudRoute | false,

}
export interface CrudOptions {
  routes?: CrudRoutes
}
export interface OptionItem {
  text: string
  value: string
}
export interface Field {
  label?: string
  icon?: string
  type?: 'hide' | 'text' | 'input' | 'autocomplete' | 'textarea' | 'number' | 'checkbox' | 'checkbox-button' | 'radio' | 'date' | 'dates' | 'week' | 'month' | 'year' | 'daterange' | 'time' | 'datetime' | 'datetimerange' | 'switch' | 'yesno' | 'slider' | 'password' | 'color' | 'select' | 'cascader' | 'transfer' | 'rate' | 'tag' | 'image' | 'button' | 'json-editor' | 'upload-file' | 'image-uploader' | 'tree-select' | 'video-uploader' | 'quill-editor' | 'markdown-editor' | 'bmap' | 'codemirror' | 'gallery'
  listable?: boolean
  editable?: boolean
  attrs?: any
  layout?: number
  tip?: string
  options?: OptionItem[]
  class?: string | string[]
  style?: any
  width?: string | number
  [key: string]: any
  column?: Field[]
}

export interface Fields {
  [key: string]: Field
}

export interface AvueCrudOption {
  addBtn?: boolean
  addRowBtn?: boolean
  align?: string
  border?: boolean
  calcHeight?: number
  cancelBtnTitle?: string
  columnBtn?: boolean
  dataType?: string
  cellBtn?: boolean
  dateBtn?: boolean
  cancelBtn?: boolean
  dateDefault?: boolean
  dicData?: any
  dicMethod?: string
  dicQuery?: any
  dicUrl?: string
  delBtn?: boolean
  defaultSort?: any
  dialogFullscreen?: boolean
  dialogEscape?: boolean
  dialogClickModal?: boolean
  dialogCloseBtn?: boolean
  dialogModal?: boolean
  dialogTop?: string | number
  dialogType?: string
  dialogWidth?: string | number
  dialogHeight?: string | number
  defaultExpandAll?: boolean
  expandRowKeys?: string[]
  editBtn?: boolean
  emptyText?: string
  expand?: boolean
  expandWidth?: number
  expandFixed?: boolean
  excelBtn?: boolean
  filterBtn?: boolean
  formWidth?: string | number
  height?: number
  header?: boolean
  index?: boolean
  indexLabel?: string
  indexWidth?: number
  indexFixed?: boolean
  rowKey?: string
  indeterminate?: boolean
  labelWidth?: number
  maxHeight?: number
  menu?: boolean
  menuWidth?: number
  menuXsWidth?: number
  menuAlign?: string
  menuType?: string
  menuBtnTitle?: string
  pageSize?: string
  pageSizes?: number[]
  printBtn?: boolean
  refreshBtn?: boolean
  saveBtn?: boolean
  updateBtn?: boolean
  cancalBtn?: boolean
  saveBtnTitle?: string
  selection?: boolean
  selectionWidth?: number
  selectionFixed?: boolean
  searchBtn?: boolean
  selectable?: boolean
  reserveSelection?: true
  selectClearBtn?: boolean
  showHeader?: boolean
  showSummary?: boolean
  size?: string
  sumColumnList?: string[]
  stripe?: boolean
  tip?: string
  tipPlacement?: string
  title?: string
  checkStrictly?: boolean
  updateBtnTitle?: string
  viewBtn?: boolean
  width?: number
  column?: Field[]
  group?: Field[]
}

export interface AvueCrudConfig {
  option?: AvueCrudOption
  [key: string]: any
}

export interface CrudOptionsWithModel extends CrudOptions {
  name?: string | string[],
  model: any
  fields?: Fields
  config?: ((instance?: any) => AvueCrudConfig | Promise<AvueCrudConfig>) | AvueCrudConfig
}

```