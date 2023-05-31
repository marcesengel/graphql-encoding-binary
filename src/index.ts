import { DocumentNode } from 'graphql/language'

import buildNodeMap from './buildNodeMap'
import encode from './encode'

export function encodeGraphQL(
  schema: DocumentNode,
  query: DocumentNode,
  data: any,
): ArrayBuffer {
  const nodeMap = buildNodeMap(schema, query)
  return encode(data, nodeMap)
}
