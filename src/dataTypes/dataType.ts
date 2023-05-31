import string from './stringDataType'

export default interface DataType<T, U = unknown> {
  staticSize: unknown extends U ? true : false
  size: unknown extends U ? number : (value: T) => [number, U]
  encode(value: unknown extends U ? T : U, view: DataView, offset: number): void
  decode(view: DataView, offset: number): T
}

export type AnyDataType = typeof string | DataType<number | boolean>
