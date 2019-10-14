import { CrudOptions } from "./crud.interface";
import { get, merge } from 'lodash'

export const defaultPaginate = {
  data: 'data',
  total: 'total',
  lastPage: 'lastPage',
  currentPage: 'page',
}

export class CrudConfig {
  public static options: CrudOptions = {
    model: null,
    routes: {
      find: {
        paginate: { ...defaultPaginate }
      }
    }
  };
  static setup(options: CrudOptions) {
    this.options = merge({}, this.options, options);
  }
  static get(key, defaultValue = undefined) {
    return get(this.options, key, defaultValue)
  }
}
