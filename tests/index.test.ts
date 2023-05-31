import gql from 'graphql-tag'

import { encodeGraphQL } from '../src'

describe('GraphQL Encoding Binary', () => {
  describe('Encode', () => {
    it('should be able to encode a basic object', () => {
      const data = {
        int: 420,
        float: 6.9,
        string: 'Hello World',
        id: '001',
        boolean: true,
      }

      const result = encodeGraphQL(schema, query, {
        data,
      })

      console.log(result.byteLength, result)

      const view = new DataView(result)
      expect(view.getInt32(0)).toBe(data.int)
      expect(view.getFloat64(4)).toBe(data.float)
      // TODO: test strings - I don't want to, will be tested on en- + decode tests
      expect(view.getUint8(30)).toBe(Number(data.boolean))
    })
  })

  describe('Decode', () => {
    it('should be able to decode a basic object', () => {
      //
    })
  })
})

const schema = gql`
  type Data {
    int: Int!
    float: Float!
    string: String!
    id: ID!
    boolean: Boolean!
  }

  type Query {
    data: Data!
  }

  schema {
    query: Query
  }
`

const query = gql`
  query {
    data {
      int
      float
      string
      id
      boolean
    }
  }
`
