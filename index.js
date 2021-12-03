// imports
const { GraphQLServer, PubSub  } = require('graphql-yoga')
const express = require('express')
const cors = require('cors')

// schemas
const messages = [] // we won't work with a db
const subscribers = [];
const MSG_SUB = 'MSG_SUB'
// const onMessagesUpdates = (fn) => subscribers.push(fn);

typeDefs = `
    # schemas
    type Message {
        id: ID!
        user: String!
        content: String!
    }
    # queries
    type Query {
        messages: [Message!]
    }
    # mutations
    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }
    #subs
    type Subscription {
        messages: [Message!]
    }
`

resolvers = {
    Query: {
        messages: () => messages
    },
    Mutation: {
        postMessage: (parent, { user, content }, { pubsub }) => {
            const id = messages.length;
            messages.push({ id, user, content});
            // subscribers.forEach((fn) => fn());
            pubsub.publish('MSG_SUB', { sentMessage: messages[id] })
            return id;
        }
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                // const channel = Math.random().toString(36).slice(2, 15);
                // onMessagesUpdates(() => pubsub.publish(channel, { messages }));
                // setTimeout(() => pubsub.publish(channel, { messages }), 0);
                // return pubsub.asyncIterator(channel);
                return pubsub.asyncIterator(MSG_SUB)
            }
        }
    }
}

// setup
const app = express()
app.use(cors())

const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
server.start(({ port }) => {
    console.log(`Server on http://localhost:${port}`)
})