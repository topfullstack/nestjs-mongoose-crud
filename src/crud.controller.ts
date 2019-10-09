import { Model, Document } from 'mongoose'
import { Get, Param, Post, Put, Delete, Body, Query } from '@nestjs/common'
import { ApiOperation, ApiModelProperty, ApiImplicitQuery } from '@nestjs/swagger'
import { CrudQuery, ICrudQuery } from './crud-query.decorator';
import { CrudConfig, defaultPaginate } from "./crud-config";
import { get, merge } from 'lodash'
import { CrudOptions, PaginateKeys } from './crud.interface';

export class CrudPlaceholderDto {
  fake: string
}

export class CrudController<T> {
  constructor(public model: Model<T | any>, public crudOptions?: CrudOptions) { }

  @Get()
  @ApiOperation({ title: 'Find all records', operationId: 'list' })
  @ApiImplicitQuery({
    name: 'query',
    type: Object,
    required: false,
    description: 'Query options',
  })
  find(@CrudQuery('query') query: ICrudQuery = {}) {
    const getOption = (key: string, defaultValue: any = undefined) => get(this.crudOptions, `routes.find.${key}`, defaultValue)
    let {
      where = getOption('where', {}),
      limit = getOption('limit', 10),
      page = 1,
      skip = 0,
      populate = getOption('populate', undefined),
      sort = getOption('sort', undefined)
    } = query

    if (skip < 1) {
      skip = (page - 1) * limit
    }

    const paginateKeys: PaginateKeys | false = get(this.crudOptions, 'routes.find.paginate', defaultPaginate)

    const find = async () => {
      const data = await this.model.find().where(where).skip(skip).limit(limit).sort(sort).populate(populate)
      if (paginateKeys !== false) {
        const total = await this.model.countDocuments(where)
        return {
          [paginateKeys.total]: total,
          [paginateKeys.data]: data,
          [paginateKeys.lastPage]: Math.ceil(total / limit),
          [paginateKeys.currentPage]: page,
        }
      }
      return data
    }
    return find()
  }

  @Get(':id')
  @ApiOperation({ title: 'Find a record' })
  findOne(@Param('id') id: string, @CrudQuery('query') query: ICrudQuery = {}) {
    const getOption = (key: string, defaultValue: any = undefined) => get(this.crudOptions, `routes.find.${key}`, defaultValue)
    let {
      where = getOption('where', {}),
      populate = getOption('populate', undefined),
    } = query
    return this.model.findById(id).populate(populate).where(where)
  }

  @Post()
  @ApiOperation({ title: 'Create a record' })
  create(@Body() body: CrudPlaceholderDto) {
    return this.model.create(body)
  }

  @Put(':id')
  @ApiOperation({ title: 'Update a record' })
  update(@Param('id') id: string, @Body() body: CrudPlaceholderDto) {
    return this.model.findByIdAndUpdate(id, body, {
      new: true,
      upsert: false,
      runValidators: true
    })
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete a record' })
  delete(@Param('id') id: string) {
    return this.model.findByIdAndDelete(id)
  }

}