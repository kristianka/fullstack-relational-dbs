const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')

app.use(express.json())

const errorHandler = require('./util/middlewares').errorHandler;

app.use('/api/blogs', blogsRouter)
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