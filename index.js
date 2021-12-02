// imports
const { GraphQLServer } = require('graphql-yoga')

// schemas
const messages = [] // we won't work with a db

typeDefs = `
    # schemas
    type Message {
        id: ID!
        user: String!
        content: String!
    }
    # queries
    type Query {
        getMessages: [Message!]
    }
    # mutations
    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }
`

resolvers = {
    Query: {
        getMessages: () => messages
    },
    Mutation: {
        postMessage: (_, { user, content }) => {
            const id = messages.length
            messages.push({ id, user, content })
            return id
        }
    },
    // Subscription: {

    // }
}

// setup
const server = new GraphQLServer({ typeDefs, resolvers })

server.start(({ port }) => {
    console.log(`Server on http://localhost:${port}`)
})