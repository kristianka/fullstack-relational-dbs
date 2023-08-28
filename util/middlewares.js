const jwt = require('jsonwebtoken')
const Session = require('../models/session')
const User = require('../models/user')
const errorHandler = (error, req, res, next) => {
    console.error(error)
    return res.status(400).json({ error: error.message })
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
        } catch (err) {
            console.log(err)
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

const checkAccountStatus = async (req, res, next) => {
    try {
        const session = await Session.findOne({ where: { user_id: req.decodedToken.id } })
        if (!session) {
            return res.status(401).json({ error: "Unauthorized or invalid session" });
        }
        const user = await User.findByPk(session.user_id)
        if (!user) {
            return res.status(401).json({ error: "Unauthorized or invalid user" });
        }
        if (user.disabled) {
            return res.status(401).json({ error: "Account disabled. Please contact admin" });
        }
        if (user && !user.disabled) {
            req.userId = user.id;
            next();
        }
    } catch (error) {
        console.log("accountstatus fail", error);
        return res.status(500).json({ error: error.message });
    }
}


module.exports = { errorHandler, tokenExtractor, checkAccountStatus }