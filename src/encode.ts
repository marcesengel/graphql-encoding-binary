import { NodeMap } from './buildNodeMap'
import boolean from './dataTypes/booleanDataType'
import { AnyDataType } from './dataTypes/dataType'
import float from './dataTypes/floatDataType'
import int from './dataTypes/intDataType'
import string from './dataTypes/stringDataType'
import { traverseNodeMap } from './traverseNodeMap'

// to size strings we need to convert them to utf8
// in order not to do this again to encode them, we use this cache
// keys are using dot notation so no need for nested objects
export type SizingComputationCache = Record<string, Uint8Array>

export default function encode(data: any, nodeMap: NodeMap): ArrayBuffer {
  const cache: SizingComputationCache = {}
  const size = getSize(data, nodeMap, cache)

  const encoded = new ArrayBuffer(size)
  const view = new DataView(encoded)

  let offset = 0
  traverseNodeMap(data, nodeMap, {
    onDataType(node, value, key, pathPrefix) {
      if (node.staticSize) {
        node.encode(value, view, offset)
        offset += node.size
      } else {
        node.encode(cache[pathPrefix + key], view, offset)
        // TODO: find a good way to include this in DataType
        offset += cache[pathPrefix + key].length + 2
      }
    },
  })

  return encoded
}

function getSize(
  data: any,
  nodeMap: NodeMap,
  cache: SizingComputationCache,
): number {
  let size = 0
  traverseNodeMap(data, nodeMap, {
    onDataType(node, value, key, pathPrefix) {
      if (node.staticSize) {
        size += node.size
      } else {
        const [nodeSize, cacheValue] = node.size(value)
        cache[pathPrefix + key] = cacheValue
        size += nodeSize
      }
    },
  })

  return size
}
