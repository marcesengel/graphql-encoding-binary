import { NodeMap } from './buildNodeMap'
import { AnyDataType } from './dataTypes/dataType'
import int from './dataTypes/intDataType'
import float from './dataTypes/floatDataType'
import string from './dataTypes/stringDataType'
import boolean from './dataTypes/booleanDataType'

interface NodeMapTraversalHandlers {
  onDataType: (
    node: AnyDataType,
    value: any,
    key: string,
    pathPrefix: string,
  ) => void
}
export function traverseNodeMap(
  data: any,
  nodeMap: NodeMap,
  handlers: NodeMapTraversalHandlers,
  pathPrefix = '',
) {
  for (const [key, node] of Object.entries(nodeMap)) {
    if (typeof data[key] === 'undefined') {
      throw new Error(`Missing required key: ${key}`)
    }

    if (isDataType(node)) {
      handlers.onDataType(node, data[key], key, pathPrefix)
    } else {
      traverseNodeMap(data[key], node, handlers, pathPrefix + key + '.')
    }
  }
}

const dataTypes = [int, float, string, boolean]
export function isDataType(value: any): value is AnyDataType {
  return dataTypes.includes(value)
}
