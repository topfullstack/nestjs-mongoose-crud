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