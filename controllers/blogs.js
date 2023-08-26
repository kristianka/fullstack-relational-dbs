const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../util/middlewares')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        }
    })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        console.log(req.body)
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
        res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: "blog not found" })
        }
        await blog.destroy()
        res.status(204).send("success")
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: "blog not found" })
        }
        blog.likes = req.body.likes
        await blog.save()
        res.json(blog)
    } catch (error) {
        next(error)
    }
})

module.exports = router