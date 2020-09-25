import { createParamDecorator, ExecutionContext } from "@nestjs/common";
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

export const CrudQuery = createParamDecorator((name = 'query', ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest()
  try {
    return JSON.parse(String(req.query[name] || ''))
  } catch (e) {
    return {}
  }
})