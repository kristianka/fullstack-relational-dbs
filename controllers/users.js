const router = require('express').Router()

const { Op } = require('sequelize')
const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Blog,
                attributes: { exclude: ['userId'] }
            },
        })
        res.json(users)
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const condition = {
            [Op.or]: [
                {
                    read: {
                        [Op.iLike]: `%${req.query.read}%`
                    },
                },
            ]

        };
        const user = await User.findOne({
            where: { id: req.params.id } && req.query.search ? condition : {},
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Blog,
                    as: 'entries',
                    attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
                    through: {
                        attributes: ['id', 'read'],
                        where: req.query?.read != null ? { read: req.query.read } : {},
                    },
                }
            ]
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
})

router.put('/:username', async (req, res) => {
    try {
        console.log(req.params.username)
        const user = await User.findOne({
            where: {
                username: req.params.username
            }
        })
        console.log("USER", user)
        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }
        user.username = req.body.username
        await user.save()
        res.json(user)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router