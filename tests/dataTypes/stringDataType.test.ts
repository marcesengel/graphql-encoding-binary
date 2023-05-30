import string from '../../src/dataTypes/stringDataType'

describe('String Data Type', () => {
  it('should be able to encode a string without throwing', () => {
    const [size, uint8Array] = string.size('hello')
    expect(() =>
      string.encode(uint8Array, new DataView(new ArrayBuffer(size)), 0),
    ).not.toThrow()
  })

  it('should be able to decode a previously encoded string', () => {
    const value = 'Hello World!'

    const [size, uint8Array] = string.size(value)
    const view = new DataView(new ArrayBuffer(size))
    string.encode(uint8Array, view, 0)

    expect(string.decode(view, 0)).toEqual(value)
  })

  it('should work with an offset', () => {
    const offset = 3
    const value = 'Hello World!'

    const [size, uint8Array] = string.size(value)
    const view = new DataView(new ArrayBuffer(size + offset * 2))
    string.encode(uint8Array, view, offset)

    expect(string.decode(view, offset)).toEqual(value)
  })
})
