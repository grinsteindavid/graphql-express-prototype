const express = require('express')
const graphqlHTTP = require('express-graphql')
const { importSchema } = require('graphql-import')
const { makeExecutableSchema } = require('graphql-tools')
const data = require('./data')

const { posts, authors } = data

const resolvers = {
    Query: {
        authors: (parent, args, request) => {
            return authors
        },
        posts: () => {
            return posts
        },
        post: (parent, { id }, request) => {
            return posts.find(post => post.id === id)
        },
        test: (parent, args, request) => {
            return request.test
        }
    },
    Mutation: {
        deletePost: (parent, { id }, request) => {
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
app.use((req, res, next) => {
    req.test = 'Test Message from middleware'
    next()
});
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

app.listen(4000, () => {
    console.log('App listening on port 4000')
})