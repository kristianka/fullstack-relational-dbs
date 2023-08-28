const router = require('express').Router()
const { ReadingList } = require('../models')
const sequelize = require('../util/db')
const { Sequelize } = require('sequelize');
const { Blog, User } = require('../models');
const { tokenExtractor } = require('../util/middlewares');

router.get('/', async (req, res) => {
    try {
        const readinglists = await ReadingList.findAll()
        res.json(readinglists)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const readinglist = await ReadingList.findOne({
            where: { id: req.params.id }
        })
        res.json(readinglist)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { blogId, userId } = req.body
        const blog = await Blog.findByPk(blogId);
        const user = await User.findByPk(userId);

        if (!blog || !user) {
            return res.status(404).json({ error: "Blog or user not found" });
        }

        const readinglist = await ReadingList.create({ ...req.body })

        res.json(readinglist)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
})

router.put('/:id', tokenExtractor, async (req, res) => {
    try {
        const { read } = req.body
        const user = await User.findByPk(req.decodedToken.id)
        const readinglist = await ReadingList.findOne({
            where: { id: req.params.id }
        })

        if (!readinglist) {
            return res.status(404).json({ error: "Reading list not found" })
        }

        if (user.id !== readinglist.userId) {
            return res.status(401).json({ error: "unauthorized" })
        }

        readinglist.read = read
        await readinglist.save()
        res.json(readinglist)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }

})

module.exports = router