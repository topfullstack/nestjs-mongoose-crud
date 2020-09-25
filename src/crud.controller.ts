import { Model, Document } from "mongoose";
import {
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Req, Request,
} from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CrudQuery, ICrudQuery } from "./crud-query.decorator";
import { defaultPaginate } from "./crud-config";
import { get } from "lodash";
import { CrudOptionsWithModel, PaginateKeys } from "./crud.interface";
import CrudTransformService from "./crud-transform.service";

export class CrudPlaceholderDto {
  fake?: string;
  [key: string]: any;
}

export class CrudController {
  constructor(
    public model: Model<{} | any>,
    public crudOptions?: CrudOptionsWithModel,
  ) {

  }

  @Get("config")
  @ApiOperation({ summary: "API Config", operationId: "config" })
  async config(@Req() req) {
    const { config } = this.crudOptions;
    if (typeof config === "function") {
      return config.call(this, req);
    }
    return config;
  }

  @Get()
  @ApiOperation({ summary: "Find all records", operationId: "list" })
  @ApiQuery({
    name: "query",
    type: String,
    required: false,
    description: "Query options"
  })
  find(@CrudQuery("query") query: ICrudQuery = {}, @Request() req) {
    let {
      where = get(this.crudOptions, "routes.find.where", {}),
      limit = get(this.crudOptions, "routes.find.limit", 10),
      page = 1,
      skip = 0,
      populate = get(this.crudOptions, "routes.find.populate", undefined),
      sort = get(this.crudOptions, "routes.find.sort", undefined)
    } = query;

    if (skip < 1) {
      skip = (page - 1) * limit;
    }

    const paginateKeys: PaginateKeys | false = get(
      this.crudOptions,
      "routes.find.paginate",
      defaultPaginate
    );

    const whereTransformed = CrudTransformService.transform(this.crudOptions, where, req);

    const find = async () => {
      const data = await this.model
        .find()
        .where(whereTransformed)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate(populate);
      if (paginateKeys !== false) {
        const total = await this.model.countDocuments(where);
        return {
          [paginateKeys.total]: total,
          [paginateKeys.data]: data,
          [paginateKeys.lastPage]: Math.ceil(total / limit),
          [paginateKeys.currentPage]: page
        };
      }
      return data;
    };
    return find();
  }

  @Get(":id")
  @ApiOperation({ summary: "Find a record" })
  findOne(@Param("id") id: string, @CrudQuery("query") query: ICrudQuery = {}, @Request() req) {
    let {
      where = get(this.crudOptions, "routes.findOne.where", {}),
      populate = get(this.crudOptions, "routes.findOne.populate", undefined),
      select = get(this.crudOptions, "routes.findOne.select", null)
    } = query;

    const whereTransformed = CrudTransformService.transform(this.crudOptions, where, req);

    return this.model
      .findById(id)
      .populate(populate)
      .select(select)
      .where(whereTransformed);
  }

  @Post()
  @ApiOperation({ summary: "Create a record" })
  create(@Body() body: CrudPlaceholderDto, @Request() req) {
    const createBody = CrudTransformService.transform(this.crudOptions, body, req);
    return this.model.create(createBody);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a record" })
  update(@Param("id") id: string, @Body() body: CrudPlaceholderDto, @Request() req) {
    const updateBody = CrudTransformService.transform(this.crudOptions, body, req);
    return this.model.findOneAndUpdate({ _id: id }, updateBody, {
      new: true,
      upsert: false,
      runValidators: true
    });
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a record" })
  delete(@Param("id") id: string, @Request() req) {
    const conditions = CrudTransformService.transform(this.crudOptions, { _id: id}, req);
    return this.model.findOneAndRemove(conditions);
  }
}
