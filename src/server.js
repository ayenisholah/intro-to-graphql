import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import config from './config'
import { connect } from './db'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    type Cat {
      name: String
      color: String
      age: Int 
    }

    type Query {
      myCat: Cat
      cats: [cat]
      hello: String
    }

    input CatInput {
      name: String
      age: Int!
      color: String
    }

    type Mutation {
      newCat(input: CatInput!): cat!
    }

    schema {
      query: Query
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Query: {
        myCat() {
          return { name: 'Garfield', age: 2, color: 'White' }
        }
      }
    },
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
