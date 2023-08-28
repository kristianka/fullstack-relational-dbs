const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const { tokenExtractor, checkAccountStatus } = require('../util/middlewares')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const Session = require('../models/session')

router.delete('/', tokenExtractor, async (req, res) => {
    try {
        await Session.destroy({ where: { user_id: req.decodedToken.id } });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

router.get('/', async (req, res) => {
    res.send("logout")
})

module.exports = router