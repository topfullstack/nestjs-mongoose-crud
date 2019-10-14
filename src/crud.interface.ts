export interface PaginateKeys {
  data?: string
  total?: string
  lastPage?: string
  currentPage?: string
}

export interface CrudRoute {
  decorators?: (MethodDecorator | PropertyDecorator)[]
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
  find?: CrudRouteForFind | false,
  findOne?: CrudRouteForFindOne | false,
  create?: CrudRouteWithDto | false,
  update?: CrudRouteWithDto | false,
  delete?: CrudRoute | false,
}
export interface CrudOptions {
  routes?: CrudRoutes
}
export interface CrudOptionsWithModel extends CrudOptions {
  model: any
}