const router = require('express').Router()
const { Blog } = require('../models')
const sequelize = require('../util/db')
const { Sequelize } = require('sequelize');

router.get('/', async (req, res) => {
    const query = await Blog.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'articles'],
            [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
            'author',
        ],
        group: ['author'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
        raw: true,
    });
    res.json(query);
})

module.exports = router