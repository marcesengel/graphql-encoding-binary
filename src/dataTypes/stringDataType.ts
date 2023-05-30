import DataType from './dataType'

// could make the length bytes dynamic
const lengthBytes = 2
const maxLength = 256 ** lengthBytes - 1

// strings are utf-8 per spec
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const string: DataType<string, Uint8Array> = {
  size(value) {
    const uint8Array = textEncoder.encode(value)
    if (uint8Array.length > maxLength) {
      throw new Error(
        `Binary string representation exceeds max length of ${maxLength} bytes.`,
      )
    }

    return [uint8Array.length + lengthBytes, uint8Array]
  },
  encode(value, view, offset) {
    view.setUint16(offset, value.length)
    offset += 2
    new Uint8Array(view.buffer, offset, value.length).set(value)
  },
  decode(view, offset) {
    const length = view.getUint16(offset)
    offset += 2

    return textDecoder.decode(new Uint8Array(view.buffer, offset, length))
  },
}

export default string
