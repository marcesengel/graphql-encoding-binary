import DataType from './dataType'

const boolean: DataType<boolean> = {
  staticSize: true,
  size: 1,
  encode(value, view, offset) {
    view.setUint8(offset, Number(value))
  },
  decode(view, offset) {
    return Boolean(view.getUint8(offset))
  },
}

export default boolean
