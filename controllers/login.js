const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
    try {
        const body = request.body

        const user = await User.findOne({
            where: {
                username: body.username
            }
        })

        const passwordCorrect = body.password === 'secret'

        if (!(user && passwordCorrect)) {
            return response.status(401).json({
                error: 'invalid username or password'
            })
        }

        const userForToken = {
            username: user.username,
            id: user.id,
        }

        const token = jwt.sign(userForToken, SECRET)
        await Session.create({ user_id: user.id, token })

        response.status(200).send({ token, username: user.username, name: user.name })
    } catch (error) {
        console.log("login fail", error);
        return response.status(500).json({ error: error.message });
    }
})

module.exports = router