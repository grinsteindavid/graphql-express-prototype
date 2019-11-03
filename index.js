const express = require('express')
const graphqlHTTP = require('express-graphql')
const { importSchema } = require('graphql-import')
const { makeExecutableSchema } = require('graphql-tools')
const data = require('./data')

const { posts, authors } = data

const resolvers = {
    Query: {
        authors: (parent, args, context, info) => {
            return authors
        },
        posts: () => {
            return posts
        },
        post: (parent, { id }, context, info) => {
            return posts.find(post => post.id === id)
        },
        test: (parent, args, context, info) => {
            return context.test
        }
    },
    Mutation: {
        deletePost: (parent, { id }, context, info) => {
            return posts.find(post => post.id === id)
        }
    },
    Post: {
        author(post) {
            return authors.find(author => author.name === post.author);
        },
    },
}
const context = ({ req }) => ({
    test: req.test,
    user: { name: 'david', role: 'admin' }
})
const typeDefs = importSchema('schema.graphql')
const schema = makeExecutableSchema({ typeDefs, resolvers, context })

const app = express()
app.use((req, res, next) => {
    req.test = 'Test Message from middleware'
    next()
});
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

app.listen(4000, () => {
    console.log('App listening on port 4000')
})