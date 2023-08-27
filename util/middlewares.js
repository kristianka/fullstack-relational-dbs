const jwt = require('jsonwebtoken')
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    return res.status(400).json({ error })
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

module.exports = { errorHandler, tokenExtractor }