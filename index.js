const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const errorHandler = require('./util/middlewares').errorHandler;

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)

app.use(errorHandler)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()

// const main = async () => {
//     try {
//         await sequelize.authenticate()
//         console.log('Connection has been established successfully.')
//         const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
//         blogs.map(blog => console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`))
//         sequelize.close()
//     } catch (error) {
//         console.error('Unable to connect to the database:', error)
//     }
// }

// main()