const express = require('express')
const graphqlHTTP = require('express-graphql')
const data = require('./data')
const { importSchema } = require('graphql-import')
const { makeExecutableSchema } = require('graphql-tools')

const { posts, authors } = data

const resolvers = {
    Query: {
        authors: (source, args, request) => {
            return authors[source.author]
        },
        posts: () => {
            return posts
        }
    },
    Mutation: {
        post: (source, { id }, request) => {
            return posts.find(post => post.id === id)
        }
    },
    Post: {
        author(post) {
            return authors.find(author => author.name === post.author);
        },
    },
}
const typeDefs = importSchema('schema.graphql')

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

app.listen(4000, () => {
    console.log('App listening on port 4000')
})