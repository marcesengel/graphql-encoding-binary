import DataType from './dataType'

// int is a 32-bit signed integer per spec
const int: DataType<number> = {
  staticSize: true,
  size: 4,
  encode(value, view, offset) {
    view.setInt32(offset, value)
  },
  decode(view, offset) {
    return view.getInt32(offset)
  },
}

export default int
