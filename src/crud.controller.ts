import { Model, Document } from "mongoose";
import {
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Req
} from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CrudQuery, ICrudQuery } from "./crud-query.decorator";
import { CrudConfig, defaultPaginate } from "./crud-config";
import { get, merge } from "lodash";
import { CrudOptionsWithModel, PaginateKeys, Fields } from "./crud.interface";
import { CRUD_FIELD_METADATA } from "./constants";

export class CrudPlaceholderDto {
  fake?: string;
  [key: string]: any;
}

export class CrudController {
  constructor(
    public model: Model<{} | any>,
    public crudOptions?: CrudOptionsWithModel
  ) {}

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
  find(@CrudQuery("query") query: ICrudQuery = {}) {
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

    const find = async () => {
      const data = await this.model
        .find()
        .where(where)
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
  findOne(@Param("id") id: string, @CrudQuery("query") query: ICrudQuery = {}) {
    let {
      where = get(this.crudOptions, "routes.findOne.where", {}),
      populate = get(this.crudOptions, "routes.findOne.populate", undefined),
      select = get(this.crudOptions, "routes.findOne.select", null)
    } = query;
    return this.model
      .findById(id)
      .populate(populate)
      .select(select)
      .where(where);
  }

  @Post()
  @ApiOperation({ summary: "Create a record" })
  create(@Body() body: CrudPlaceholderDto) {
    const transform = get(this.crudOptions, "routes.create.transform");
    if (transform) {
      body = transform(body);
    }
    return this.model.create(body);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a record" })
  update(@Param("id") id: string, @Body() body: CrudPlaceholderDto) {
    const transform = get(this.crudOptions, "routes.update.transform");
    if (transform) {
      body = transform(body);
    }
    return this.model.findOneAndUpdate({ _id: id }, body, {
      new: true,
      upsert: false,
      runValidators: true
    });
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a record" })
  delete(@Param("id") id: string) {
    return this.model.findOneAndRemove({ _id: id });
  }
}
