export default interface DataType<T, U = unknown> {
  size: unknown extends U ? number : (value: T) => [number, U]
  encode(value: unknown extends U ? T : U, view: DataView, offset: number): void
  decode(view: DataView, offset: number): T
}
