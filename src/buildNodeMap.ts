import {
  BREAK,
  DocumentNode,
  Kind,
  ListTypeNode,
  NamedTypeNode,
  OperationTypeNode,
  TypeDefinitionNode,
  TypeNode,
  visit,
} from 'graphql/language'

import boolean from './dataTypes/booleanDataType'
import { AnyDataType } from './dataTypes/dataType'
import float from './dataTypes/floatDataType'
import int from './dataTypes/intDataType'
import string from './dataTypes/stringDataType'

export type NodeMap = {
  [key: string]: AnyDataType | NodeMap
}

export default function buildNodeMap(
  schema: DocumentNode,
  query: DocumentNode,
): NodeMap {
  const gqlTypeByName: Record<string, TypeDefinitionNode> = {}
  for (const def of schema.definitions) {
    if (def.kind !== Kind.OBJECT_TYPE_DEFINITION) {
      continue
    }

    gqlTypeByName[def.name.value] = def
  }

  const queryDefinition = gqlTypeByName['Query']
  if (queryDefinition.kind !== Kind.OBJECT_TYPE_DEFINITION) {
    throw new Error('Query definition not found')
  }

  const nodeMap: NodeMap = {}
  visit(query, {
    enter(node) {
      if (
        node.kind === Kind.OPERATION_DEFINITION &&
        node.operation === OperationTypeNode.QUERY
      ) {
        const {
          selectionSet: { selections },
        } = node

        for (const selection of selections) {
          if (selection.kind !== Kind.FIELD) {
            continue
          }

          const { name } = selection
          const queryNodeMap = (nodeMap[name.value] = {} as NodeMap)

          let queryType = queryDefinition.fields?.find(
            (f) => f.name.value === name.value,
          )?.type
          if (!queryType) {
            throw new Error(`Missing gql type for field '${name.value}'.`)
          }

          queryType = unwrapNonNullType(queryType).type

          if (queryType.kind === Kind.LIST_TYPE) {
            throw new Error('Lists are not supported yet.')
          }

          const realType = gqlTypeByName[queryType.name.value]
          console.log(realType)

          if (realType.kind !== Kind.OBJECT_TYPE_DEFINITION) {
            throw new Error('Only object types are supported.')
          }

          if (selection.selectionSet) {
            for (const fieldSelection of selection.selectionSet.selections) {
              if (fieldSelection.kind !== Kind.FIELD) {
                throw new Error(
                  `Unsupported field selection kind '${fieldSelection.kind}'.`,
                )
              }

              const selectedField = realType.fields?.find(
                (f) => f.name.value === fieldSelection.name.value,
              )
              if (!selectedField) {
                throw new Error(
                  `Field '${fieldSelection.name.value}' not found on type '${realType.name.value}'.`,
                )
              }

              const { type: fieldType } = unwrapNonNullType(selectedField.type)
              console.log(fieldSelection.name.value, fieldType)

              if (fieldType.kind === Kind.LIST_TYPE) {
                throw new Error('Lists are not supported yet.')
              }

              queryNodeMap[fieldSelection.name.value] =
                dataTypeFromNamedTypeNode(fieldType)
            }
          }
        }

        return BREAK
      }
    },
  })

  return nodeMap
}

function unwrapNonNullType(type: TypeNode): {
  nullable: boolean
  type: NamedTypeNode | ListTypeNode
} {
  if (type.kind === Kind.NON_NULL_TYPE) {
    return { nullable: false, type: type.type }
  }

  return { nullable: true, type }
}

function dataTypeFromNamedTypeNode(type: NamedTypeNode): AnyDataType {
  switch (type.name.value) {
    case 'Int':
      return int
    case 'Float':
      return float
    case 'String':
      return string
    case 'ID':
      return string
    case 'Boolean':
      return boolean
    default:
      throw new Error(`Unsupported type '${type.name.value}'.`)
  }
}
