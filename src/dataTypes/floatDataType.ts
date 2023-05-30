import DataType from './dataType'

const float: DataType<number> = {
  size: 4,
  encode(value, view, offset) {
    view.setFloat64(offset, value)
  },
  decode(view, offset) {
    return view.getFloat64(offset)
  },
}

export default float
