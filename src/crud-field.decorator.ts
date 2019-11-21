import { Field } from "./crud.interface"
import { CRUD_FIELD_METADATA } from "./constants"

export const CrudField = (field: Field) => {

  return (target: any, property: string) => {
    Reflect.defineMetadata(CRUD_FIELD_METADATA, field, target, property)
  }
}