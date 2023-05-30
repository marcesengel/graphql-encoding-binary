import DataType from './dataType'

// int is a 32-bit signed integer per spec
const int: DataType<number> = {
  size: 2,
  encode(value, view, offset) {
    view.setInt32(offset, value)
  },
  decode(view, offset) {
    return view.getInt32(offset)
  },
}

export default int
