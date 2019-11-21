export interface PaginateKeys {
  data?: string
  total?: string
  lastPage?: string
  currentPage?: string
}

export interface CrudRoute {
  decorators?: MethodDecorator[]
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
  grid?: false,
  form?: false,
  find?: CrudRouteForFind | false,
  findOne?: CrudRouteForFindOne | false,
  create?: CrudRouteWithDto | false,
  update?: CrudRouteWithDto | false,
  delete?: CrudRoute | false,

}
export interface CrudOptions {
  routes?: CrudRoutes
}
export interface OptionItem {
  text: string
  value: string
}
export interface Field {
  label?: string
  icon?: string
  type?: 'hide' | 'text' | 'input' | 'autocomplete' | 'textarea' | 'number' | 'checkbox' | 'checkbox-button' | 'radio' | 'date' | 'dates' | 'week' | 'month' | 'year' | 'daterange' | 'time' | 'datetime' | 'datetimerange' | 'switch' | 'yesno' | 'slider' | 'password' | 'color' | 'select' | 'cascader' | 'transfer' | 'rate' | 'tag' | 'image' | 'button' | 'json-editor' | 'upload-file' | 'image-uploader' | 'tree-select' | 'video-uploader' | 'quill-editor' | 'markdown-editor' | 'bmap' | 'codemirror' | 'gallery'
  listable?: boolean
  editable?: boolean
  attrs?: any
  layout?: number
  tip?: string
  options?: OptionItem[]
  class?: string | string[]
  style?: any
  width?: string | number
  [key: string]: any
  column?: Field[]
}

export interface Fields {
  [key: string]: Field
}

export interface AvueCrudOption {
  addBtn?: boolean
  addRowBtn?: boolean
  align?: string
  border?: boolean
  calcHeight?: number
  cancelBtnTitle?: string
  columnBtn?: boolean
  dataType?: string
  cellBtn?: boolean
  dateBtn?: boolean
  cancelBtn?: boolean
  dateDefault?: boolean
  dicData?: any
  dicMethod?: string
  dicQuery?: any
  dicUrl?: string
  delBtn?: boolean
  defaultSort?: any
  dialogFullscreen?: boolean
  dialogEscape?: boolean
  dialogClickModal?: boolean
  dialogCloseBtn?: boolean
  dialogModal?: boolean
  dialogTop?: string | number
  dialogType?: string
  dialogWidth?: string | number
  dialogHeight?: string | number
  defaultExpandAll?: boolean
  expandRowKeys?: string[]
  editBtn?: boolean
  emptyText?: string
  expand?: boolean
  expandWidth?: number
  expandFixed?: boolean
  excelBtn?: boolean
  filterBtn?: boolean
  formWidth?: string | number
  height?: number
  header?: boolean
  index?: boolean
  indexLabel?: string
  indexWidth?: number
  indexFixed?: boolean
  rowKey?: string
  indeterminate?: boolean
  labelWidth?: number
  maxHeight?: number
  menu?: boolean
  menuWidth?: number
  menuXsWidth?: number
  menuAlign?: string
  menuType?: string
  menuBtnTitle?: string
  pageSize?: string
  pageSizes?: number[]
  printBtn?: boolean
  refreshBtn?: boolean
  saveBtn?: boolean
  updateBtn?: boolean
  cancalBtn?: boolean
  saveBtnTitle?: string
  selection?: boolean
  selectionWidth?: number
  selectionFixed?: boolean
  searchBtn?: boolean
  selectable?: boolean
  reserveSelection?: true
  selectClearBtn?: boolean
  showHeader?: boolean
  showSummary?: boolean
  size?: string
  sumColumnList?: string[]
  stripe?: boolean
  tip?: string
  tipPlacement?: string
  title?: string
  checkStrictly?: boolean
  updateBtnTitle?: string
  viewBtn?: boolean
  width?: number
  column?: Field[]
  group?: Field[]
}

export interface AvueCrudConfig {
  option?: AvueCrudOption
  [key: string]: any
}

export interface CrudOptionsWithModel extends CrudOptions {
  name?: string | string[],
  model: any
  fields?: Fields
  config?: ((instance?: any) => AvueCrudConfig | Promise<AvueCrudConfig>) | AvueCrudConfig
}
