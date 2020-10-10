import { get } from 'lodash';
import { isFunction } from './util';

export default class CrudTransformService {
  static transform({ options, data, req, method }: { options: any, data: any, req: any, method: string }) {
    const transformGlobal = get(options, `routes.global.transform`);
    const transform = get(options, `routes.${method}.transform`);

    return CrudTransformService.apply(transformGlobal, transform, data, req);
  }

  static filter({ options, data, req, method }: { options: any, data: any, req: any, method: string }) {
    const filterGlobal = get(options, `routes.global.filter`);
    const filter = get(options, `routes.${method}.filter`);

    return CrudTransformService.apply(filterGlobal, filter, data, req);
  }

  static apply(global, local, data, req) {
    let resultData = data;
    if (isFunction(global)) {
      resultData = global(data, req);
    }
    if (isFunction(local)) {
      resultData = local(data, req);
    }

    return resultData;
  }
}
