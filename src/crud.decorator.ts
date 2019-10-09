import { CrudController, CrudPlaceholderDto } from "./crud.controller";
import { Document } from "mongoose";
import { PARAMTYPES_METADATA } from '@nestjs/common/constants'
import { get, merge } from 'lodash'
import { CrudOptions } from "./crud.interface";
import { ICrudQuery } from "./crud-query.decorator";
import { CrudConfig } from "./crud-config";

const CRUD_ROUTES = {
  find: 'find',
  findOne: 'findOne',
  create: 'create',
  update: 'update',
  delete: 'delete'
}

const allMethods = Object.values(CRUD_ROUTES)

function cloneDecorators(from, to) {
  Reflect.getMetadataKeys(from).forEach(key => {
    const value = Reflect.getMetadata(key, from)
    Reflect.defineMetadata(key, value, to)
  })
}
function clonePropDecorators(from, to, name) {
  Reflect.getMetadataKeys(from, name).forEach(key => {
    const value = Reflect.getMetadata(key, from, name)
    Reflect.defineMetadata(key, value, to, name)
  })
}

export const Crud = function <T>(options: CrudOptions) {
  options = merge({}, CrudConfig.options, options)
  return target => {
    const Controller = target
    const controller = target.prototype
    const crudController = new CrudController<T>(options.model)

    controller.crudOptions = options


    const methods = allMethods.filter(v => get(options, `routes.${v}`) !== false)
    for (let method of methods) {
      if (controller[method]) {
        continue
      }
      controller[method] = crudController[method]
      // clone instance decorators
      cloneDecorators(crudController, controller)
      // clone instance method decorators
      clonePropDecorators(crudController, controller, method)
      // clone class "method" decorators
      clonePropDecorators(CrudController, Controller, method)

      // get exists param types
      const types: [] = Reflect.getMetadata(PARAMTYPES_METADATA, controller, method)

      Reflect.decorate([
        
        // replace fake dto to real dto
        Reflect.metadata(PARAMTYPES_METADATA, types.map((v: any) => {
          if (get(v, 'name') === CrudPlaceholderDto.name) {
            return get(options, `routes.${method}.dto`, options.model)
          }
          return v
        })),
        ...get(options, `routes.${method}.decorators`, [])
      ], controller, method, Object.getOwnPropertyDescriptor(controller, method))

    }
  }
}
