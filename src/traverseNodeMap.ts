import { NodeMap } from './buildNodeMap'
import { NodeMapTraversalHandlers, isDataType } from './encode'

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
