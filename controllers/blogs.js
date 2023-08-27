const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../util/middlewares')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
    const condition = {
        [Op.or]: [
            {
                title: {
                    [Op.iLike]: `%${req.query.search}%`
                },
            },
            {
                author: {
                    [Op.iLike]: `%${req.query.search}%`,
                },
            }
        ]

    };
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['username', 'name']
        },
        where: req.query.search ? condition : {},
        order: [['likes', 'DESC']]
    })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
        res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: "blog not found" })
        }
        const user = await User.findByPk(req.decodedToken.id)
        if (user.id !== blog.userId) {
            return res.status(401).json({ error: "unauthorized" })
        }
        await blog.destroy()
        res.status(204).json({ message: "blog deleted" })
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