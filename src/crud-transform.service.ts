import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { isFunction } from './util';

@Injectable()
export default class CrudTransformService {
  static transform(options, data, req) {
    const transformGlobal = get(options, "routes.global.transform");
    const transform = get(options, "routes.delete.transform");

    let resultData = data;
    if(isFunction(transformGlobal)) {
      resultData = transformGlobal(data, req);
    }
    if(isFunction(transform)) {
      resultData = transform(data, req);
    }

    return resultData;
  }
}
