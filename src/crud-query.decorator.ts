import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export class ICrudQuery {
  where?: any
  limit?: number
  page?: number
  skip?: number
  sort?: string | any
  populate?: string | any
  select?: string | any
}

export const CrudQuery = createParamDecorator((name = 'query', req: Request) => {
  try {
    return JSON.parse(req.query[name])
  } catch (e) {
    return {}
  }
})