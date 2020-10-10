import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { isFunction } from './util';

@Injectable()
export default class CrudTransformService {
  static transform({ options, data, req, method }: { options: any, data: any, req: any, method: string }) {
    const transformGlobal = get(options, `routes.global.transform`);
    const transform = get(options, `routes.${method}.transform`);

    let resultData = data;
    if(isFunction(transformGlobal)) {
      resultData = transformGlobal(data, req);
    }
    if(isFunction(transform)) {
      resultData = transform(data, req);
    }

    return resultData;
  }

  static filter({ options, data, req, method }: { options: any, data: any, req: any, method: string }) {
    const filterGlobal = get(options, `routes.global.filter`);
    const filter = get(options, `routes.${method}.filter`);

    let resultData = data;
    if(isFunction(filterGlobal)) {
      resultData = filterGlobal(data, req);
    }
    if(isFunction(filter)) {
      resultData = filter(data, req);
    }

    return resultData;
  }
}
