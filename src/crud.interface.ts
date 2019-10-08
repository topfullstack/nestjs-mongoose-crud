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
export interface CrudRouteWithPaginate extends CrudRoute {
  paginate?: PaginateKeys
  limit?: number
}

export interface CrudRoutes {
  find?: CrudRouteWithPaginate | false,
  findOne?: CrudRoute | false,
  create?: CrudRouteWithDto | false,
  update?: CrudRouteWithDto | false,
  delete?: CrudRoute | false,
}
export interface CrudOptions {
  model: any
  routes?: CrudRoutes
}