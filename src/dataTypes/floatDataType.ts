import DataType from './dataType'

const float: DataType<number> = {
  staticSize: true,
  size: 8,
  encode(value, view, offset) {
    view.setFloat64(offset, value)
  },
  decode(view, offset) {
    return view.getFloat64(offset)
  },
}

export default float
